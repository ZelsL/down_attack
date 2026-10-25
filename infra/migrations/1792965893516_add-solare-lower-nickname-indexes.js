exports.up = (pgm) => {
  pgm.createIndex(
    "solare_players",
    ["region", pgm.func("LOWER(user_nickname)")],
    {
      name: "solare_players_region_lower_user_nickname_index",
      ifNotExists: true,
    },
  );

  pgm.createIndex(
    "solare_match_players",
    ["region", pgm.func("LOWER(user_nickname)")],
    {
      name: "solare_match_players_region_lower_user_nickname_index",
      ifNotExists: true,
    },
  );
};

exports.down = false;
