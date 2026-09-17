exports.up = (pgm) => {
  const booleanColumn = {
    type: "boolean",
    notNull: true,
    default: false,
  };

  pgm.createTable("skills", {
    id: {
      type: "integer",
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    class_name: {
      type: "varchar(30)",
      notNull: true,
    },
    skill_spec: {
      type: "varchar(30)",
      notNull: true,
    },
    cooldown: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    crit_hit_rate: {
      type: "numeric",
      notNull: true,
      default: 0,
    },
    pvp_damage: {
      type: "numeric",
      notNull: false,
      default: 0,
    },
    icon_path: {
      type: "varchar(255)",
      notNull: false,
    },
    is_sa: booleanColumn,
    is_fg: booleanColumn,
    is_if: booleanColumn,
    is_down_attack: booleanColumn,
    is_down_smash: booleanColumn,
    is_knockback: booleanColumn,
    is_knockdown: booleanColumn,
    is_stun: booleanColumn,
    is_floating: booleanColumn,
    is_air_smash: booleanColumn,
    is_stiffness: booleanColumn,
    is_bound: booleanColumn,
    is_air_attack: booleanColumn,
    is_grapple: booleanColumn,
    is_freezing: booleanColumn,
    self_buffs: {
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
  pgm.createIndex("skills", "class_name");
};

exports.down = false;
