exports.up = (pgm) => {
  pgm.createTable("solare_overlay_sessions", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },
    token: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },
    region: {
      type: "varchar(8)",
      notNull: true,
    },
    user_nickname: {
      type: "varchar(64)",
      notNull: true,
    },
    user_no: {
      type: "bigint",
      notNull: false,
    },
    anchor_rating: {
      type: "integer",
      notNull: true,
    },
    anchor_record_no: {
      type: "bigint",
      notNull: true,
      default: 0,
    },
    session_start_record_no: {
      type: "bigint",
      notNull: true,
      default: 0,
    },
    started_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
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

  pgm.createIndex("solare_overlay_sessions", ["region", "user_nickname"]);
};

exports.down = false;
