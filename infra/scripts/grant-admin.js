import fs from "node:fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import database from "../database.js";

if (fs.existsSync(".env")) {
  dotenvExpand.expand(dotenv.config());
}

const MOCK_DISCORD_ID = "268473310986240001";

const ADMIN_FEATURES = [
  "read:session",
  "read:status",
  "read:status:all",
  "read:user",
  "update:user",
  "update:user:others",
  "read:migrations",
  "run:migrations",
  "create:skill",
  "update:skill",
  "delete:skill",
  "create:preset",
  "update:preset",
  "update:preset:others",
  "delete:preset",
  "delete:preset:others",
  "create:combo",
  "read:combo",
  "read:combo:others",
  "update:combo",
  "update:combo:others",
  "delete:combo",
  "delete:combo:others",
];

async function grantAdmin() {
  const target = process.argv[2] || MOCK_DISCORD_ID;
  const client = await database.getNewClient();

  try {
    let result;

    if (target === MOCK_DISCORD_ID) {
      result = await client.query(
        `
        INSERT INTO users (discord_id, username, display_name, avatar, features)
        VALUES ($1, 'mock_admin', 'Discord', 'f749bb0cbeeb26ef21eca719337d20f1', $2)
        ON CONFLICT (discord_id) DO UPDATE
        SET
          features = ARRAY(SELECT DISTINCT unnest(array_cat(users.features, $2))),
          updated_at = timezone('utc', now())
        RETURNING id, username, discord_id, features;
        `,
        [MOCK_DISCORD_ID, ADMIN_FEATURES],
      );
    } else {
      result = await client.query(
        `
        UPDATE users
        SET
          features = ARRAY(SELECT DISTINCT unnest(array_cat(users.features, $2))),
          updated_at = timezone('utc', now())
        WHERE
          discord_id = $1 OR LOWER(username) = LOWER($1)
        RETURNING id, username, discord_id, features;
        `,
        [target, ADMIN_FEATURES],
      );
    }

    if (result.rowCount === 0) {
      console.error(`❌ User '${target}' not found in the database.`);
      process.exitCode = 1;
      return;
    }

    const updatedUser = result.rows[0];
    console.log(
      `✅ Granted admin features to '${updatedUser.username}' (discord_id: ${updatedUser.discord_id}).`,
    );
    console.log(
      `🔑 Features (${updatedUser.features.length}):`,
      updatedUser.features.join(", "),
    );
  } finally {
    await client.end();
  }
}

grantAdmin().catch((error) => {
  console.error("❌ Error granting admin permissions:", error);
  process.exit(1);
});
