exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // Discord snowflake ID (64-bit integer up to 20 digits, stored as string)
    discord_id: {
      type: "varchar(32)",
      notNull: true,
      unique: true,
    },

    // Discord usernames are unique and limited to 2-32 characters
    username: {
      type: "varchar(32)",
      notNull: true,
      unique: true,
    },

    // Discord global display name
    display_name: {
      type: "varchar(100)",
      notNull: false,
    },

    // Discord avatar hash used to build CDN avatar URLs:
    // https://cdn.discordapp.com/avatars/{discord_id}/{avatar}.png
    avatar: {
      type: "varchar(100)",
      notNull: false,
    },

    // Why timestamp with timezone ? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
