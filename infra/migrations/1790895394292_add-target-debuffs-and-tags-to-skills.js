exports.up = (pgm) => {
  pgm.addColumn("skills", {
    target_debuffs: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'{}'::jsonb"),
    },
    tags: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'[]'::jsonb"),
    },
  });
};

exports.down = false;
