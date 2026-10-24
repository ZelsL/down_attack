exports.up = (pgm) => {
  // Limpa os dados de partidas anteriores (com vary_rank_rating imprecisos) e
  // adiciona a constraint UNIQUE (region, record_no, user_nickname) de forma idempotente.
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'solare_match_players_region_record_no_user_nickname_key'
      ) THEN
        TRUNCATE TABLE solare_matches RESTART IDENTITY CASCADE;
        ALTER TABLE solare_match_players
          ADD CONSTRAINT solare_match_players_region_record_no_user_nickname_key
          UNIQUE (region, record_no, user_nickname);
      END IF;
    END $$;
  `);
};

exports.down = false;
