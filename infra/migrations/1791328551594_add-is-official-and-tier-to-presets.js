exports.up = (pgm) => {
  pgm.addColumn("presets", {
    is_official: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    tier: {
      type: "varchar(50)",
      notNull: false,
    },
  });

  pgm.createIndex("presets", "is_official");
};

exports.down = false;
