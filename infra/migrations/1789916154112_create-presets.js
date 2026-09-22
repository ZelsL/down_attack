exports.up = (pgm) => {
  pgm.createTable("presets", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "CASCADE",
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

    // Combat Stats (matching Garmoth API & PlayerPanel)
    hp: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    ap: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    aap: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    adventureap: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    adventureaap: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    mldr: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    radr: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    madr: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    acc: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    meev: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    raev: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    maev: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    bdrp: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    chrp: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    chc: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    abad: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    adad: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    aaad: {
      type: "numeric",
      notNull: true,
      default: 0,
    },

    is_public: {
      type: "boolean",
      notNull: true,
      default: false,
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

  pgm.createIndex("presets", "class_name");
  pgm.createIndex("presets", "user_id");
};

exports.down = false;
