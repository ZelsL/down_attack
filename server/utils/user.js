import discord from "~~/infra/discord.js";
import {
  NotFoundError,
  ServiceError,
  ValidationError,
} from "~~/infra/errors.js";
import database from "~~/infra/database.js";

async function discordRedirect(event) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  return sendRedirect(
    event,
    `${discord.api}/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`,
  );
}

async function fetchUserFromDiscord(code) {
  const userObject = await fetchUserInfo();
  return userObject;

  async function exchangeToken() {
    const bodyParams = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    const response = await fetch(`${discord.api}/api/oauth2/token`, {
      method: "POST",
      body: bodyParams,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));

      if (response.status >= 400 && response.status < 500) {
        throw new ValidationError({
          message: "Invalid Discord code",
          action: "Start a new authorization flow.",
          cause: errorBody,
        });
      }

      throw new ServiceError({
        message: "Failed to exchange code for access token",
        cause: errorBody,
      });
    }

    const data = await response.json();

    return data.access_token;
  }

  async function fetchUserInfo() {
    const accessToken = await exchangeToken();

    const response = await fetch(`${discord.api}/api/users/@me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));

      if (response.status >= 400 && response.status < 500) {
        throw new ValidationError({
          message: "Failed to fetch user info from Discord",
          action: "Start a new authorization flow.",
          cause: errorBody,
        });
      }
      throw new ServiceError({
        message: "Failed to exchange code for access token",
        cause: errorBody,
      });
    }

    const data = await response.json();

    return data;
  }
}

async function create(userInputValues) {
  const newUser = await runUpsertQuery(
    userInputValues.user.id,
    userInputValues,
  );

  return newUser;

  async function runUpsertQuery(discordId, userInputValues) {
    return await upsert(userInputValues);
  }

  async function upsert(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          users (discord_id, username, display_name, avatar)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (discord_id) DO UPDATE
        SET
          username = EXCLUDED.username,
          display_name = EXCLUDED.display_name,
          avatar = EXCLUDED.avatar,
          updated_at = (now() at time zone 'utc')
        RETURNING *
      ;`,
      values: [
        userInputValues.user.id,
        userInputValues.user.username,
        userInputValues.user.global_name,
        userInputValues.user.avatar,
      ],
    });
    return results.rows[0];
  }
}

async function findOneById(id) {
  const userFound = await runSelectQuery(id);

  return userFound;

  async function runSelectQuery(id) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        id = $1
      LIMIT
        1
      ;`,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "The ID provided was not found in the system.",
        action: "Please check if the ID is typed correctly.",
      });
    }

    return results.rows[0];
  }
}

const user = {
  discordRedirect,
  fetchUserFromDiscord,
  create,
  findOneById,
};

export default user;
