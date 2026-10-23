exports.up = (pgm) => {
  // 1. Matches Table (Composite PK: region + record_no)
  pgm.createTable(
    "solare_matches",
    {
      region: {
        type: "varchar(8)",
        notNull: true,
      },
      record_no: {
        type: "bigint",
        notNull: true,
      },
      play_time_seconds: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      win_record: {
        type: "smallint[]",
        notNull: false,
      },
      repz_download_url: {
        type: "text",
        notNull: false,
      },
      match_date: {
        type: "timestamptz",
        notNull: false,
      },
      crawled_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("timezone('utc', now())"),
      },
    },
    {
      constraints: {
        primaryKey: ["region", "record_no"],
      },
    },
  );

  pgm.createIndex("solare_matches", ["region", "match_date"]);
  pgm.createIndex("solare_matches", ["crawled_at"]);

  // 2. Players Table (Composite PK: region + user_no)
  pgm.createTable(
    "solare_players",
    {
      region: {
        type: "varchar(8)",
        notNull: true,
      },
      user_no: {
        type: "bigint",
        notNull: true,
      },
      user_nickname: {
        type: "varchar(64)",
        notNull: true,
      },
      current_ranking: {
        type: "integer",
        notNull: false,
      },
      class_type: {
        type: "smallint",
        notNull: true,
      },
      skill_branch_type: {
        type: "smallint",
        notNull: true,
      },
      win_count: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      lose_count: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      draw_count: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      win_average: {
        type: "varchar(16)",
        notNull: false,
      },
      download_count: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      last_seen_at: {
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
    },
    {
      constraints: {
        primaryKey: ["region", "user_no"],
      },
    },
  );

  pgm.createIndex("solare_players", ["region", "user_nickname"]);
  pgm.createIndex("solare_players", ["region", "current_ranking"]);

  // 3. Match Participants Table (Each match has 6 player records: 3 on team 0, 3 on team 1)
  pgm.createTable(
    "solare_match_players",
    {
      id: {
        type: "bigserial",
        primaryKey: true,
      },
      region: {
        type: "varchar(8)",
        notNull: true,
      },
      record_no: {
        type: "bigint",
        notNull: true,
      },
      team: {
        type: "smallint",
        notNull: true, // 0 = Allies / Team A, 1 = Enemies / Team B
      },
      user_nickname: {
        type: "varchar(64)",
        notNull: true,
      },
      user_no: {
        type: "bigint",
        notNull: false, // Resolved if player exists in solare_players
      },
      class_type: {
        type: "smallint",
        notNull: true,
      },
      skill_branch_type: {
        type: "smallint",
        notNull: true, // 1 = Awakening, 2 = Succession, 3 = Ascension
      },
      kill_count: {
        type: "smallint",
        notNull: true,
        default: 0,
      },
      death_count: {
        type: "smallint",
        notNull: true,
        default: 0,
      },
      cc_applied_count: {
        type: "smallint",
        notNull: true,
        default: 0,
      },
      damage_done: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      damage_taken: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      recovery: {
        type: "integer",
        notNull: true,
        default: 0,
      },
      is_winner: {
        type: "boolean",
        notNull: true,
      },
      vary_rank_rating: {
        type: "smallint",
        notNull: false, // Rating delta (+25, -20, etc.)
      },
      created_at: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("timezone('utc', now())"),
      },
    },
    {
      constraints: {
        foreignKeys: {
          columns: ["region", "record_no"],
          references: "solare_matches(region, record_no)",
          onDelete: "CASCADE",
        },
      },
    },
  );

  pgm.createIndex("solare_match_players", ["region", "record_no"]);
  pgm.createIndex("solare_match_players", ["user_nickname", "region"]);
  pgm.createIndex("solare_match_players", [
    "class_type",
    "skill_branch_type",
    "is_winner",
  ]);
  pgm.createIndex("solare_match_players", ["user_no", "region"]);
};

exports.down = false;
