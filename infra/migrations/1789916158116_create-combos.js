exports.up = (pgm) => {
  pgm.createTable("combos", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "CASCADE",
      notNull: true,
    },
    preset_id: {
      type: "uuid",
      references: "presets",
      onDelete: "SET NULL",
      notNull: false,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    class_name: {
      type: "varchar(50)",
      notNull: true,
    },
    spec: {
      type: "varchar(30)",
      notNull: true,
      default: "Awakening",
    },
    skills: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
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

  pgm.createIndex("combos", "user_id");
  pgm.createIndex("combos", "class_name");
};

exports.down = false;
