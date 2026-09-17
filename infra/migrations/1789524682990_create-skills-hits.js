exports.up = (pgm) => {
  const booleanColumn = {
    type: "boolean",
    notNull: true,
    default: false,
  };

  pgm.createTable("skills_hits", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    skill_id: {
      type: "integer",
      notNull: true,
    },
    description: {
      type: "varchar(255)",
      notNull: false,
    },
    damage_percent: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    hit_count: {
      type: "integer",
      notNull: true,
      default: 1,
    },
    is_sa: booleanColumn,
    is_fg: booleanColumn,
    is_if: booleanColumn,
    is_down_attack: booleanColumn,
    is_air_attack: booleanColumn,
    is_down_smash: booleanColumn,
    is_knockback: booleanColumn,
    is_stun: booleanColumn,
    is_knockdown: booleanColumn,
    is_floating: booleanColumn,
    is_air_smash: booleanColumn,
    is_stiffness: booleanColumn,
    is_bound: booleanColumn,
    is_grapple: booleanColumn,
    is_freezing: booleanColumn,

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
  pgm.createIndex("skills_hits", "skill_id");
};

exports.down = false;
