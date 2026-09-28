exports.up = (pgm) => {
  pgm.addColumn("skills", {
    command: {
      type: "varchar(255)",
      notNull: false,
    },
  });
};

exports.down = false;
