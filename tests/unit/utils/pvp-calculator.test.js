import {
  PvpCalculator,
  calculateComboDamage,
} from "~/app/utils/PvpCalculator.js";

describe("PvpCalculator (Official BDO PvP Spreadsheet Benchmarks)", () => {
  const attacker1 = {
    class_name: "Sorceress",
    spec: "Awakening",
    ap: 383,
    aap: 385,
    adventureap: 986,
    adventureaap: 988,
    chrp: 67.5,
    adad: 35.5,
    abad: 34.5,
    aaad: 29.5,
    acc: 1301,
    chc: 100,
  };

  const attacker2 = {
    class_name: "Sorceress",
    spec: "Awakening",
    ap: 383,
    aap: 385,
    adventureap: 974,
    adventureaap: 976,
    chrp: 67.0,
    adad: 29.0,
    abad: 34.0,
    aaad: 29.0,
    acc: 1266,
    chc: 100,
  };

  const defender1 = {
    class_name: "Sorceress",
    spec: "Awakening",
    hp: 12163,
    bdrp: 30,
    mldr: 661,
    radr: 661,
    madr: 661,
    meev: 1159,
    raev: 1152,
    maev: 1152,
  };

  const defender2 = {
    class_name: "Sorceress",
    spec: "Awakening",
    hp: 12498,
    bdrp: 30,
    mldr: 642,
    radr: 642,
    madr: 642,
    meev: 1309,
    raev: 1302,
    maev: 1302,
  };

  const skill = {
    skill_spec: "Awakening",
    crit_hit_rate: 100,
    pvp_damage: 28.13,
    hits: [
      {
        damage_percent: 10607,
        down_hits: 3,
      },
    ],
  };

  const hit = skill.hits[0];

  test("Example 1: Attacker #1 vs Defender #1", () => {
    const calc = new PvpCalculator({
      attacker: attacker1,
      defender: defender1,
      skill,
      hit,
    });

    const hitRate = calc.calculateHitRate();
    const effectiveHitRate = 2 * hitRate - hitRate * hitRate;
    const totalHpLoss = calculateComboDamage(attacker1, defender1, [skill]);
    const percentHpLoss = (totalHpLoss / defender1.hp) * 100;

    expect((hitRate * 100).toFixed(1)).toBe("100.0");
    expect((effectiveHitRate * 100).toFixed(1)).toBe("100.0");
    expect(totalHpLoss.toFixed(1)).toBe("4068.8");
    expect(percentHpLoss.toFixed(1)).toBe("33.5");
  });

  test("Example 2: Attacker #2 vs Defender #1", () => {
    const calc = new PvpCalculator({
      attacker: attacker2,
      defender: defender1,
      skill,
      hit,
    });

    const hitRate = calc.calculateHitRate();
    const effectiveHitRate = 2 * hitRate - hitRate * hitRate;
    const totalHpLoss = calculateComboDamage(attacker2, defender1, [skill]);
    const percentHpLoss = (totalHpLoss / defender1.hp) * 100;

    expect((hitRate * 100).toFixed(1)).toBe("95.5");
    expect((effectiveHitRate * 100).toFixed(1)).toBe("99.8");
    expect(totalHpLoss.toFixed(1)).toBe("3739.9");
    expect(percentHpLoss.toFixed(1)).toBe("30.7");
  });

  test("Example 3: Attacker #1 vs Defender #2", () => {
    const calc = new PvpCalculator({
      attacker: attacker1,
      defender: defender2,
      skill,
      hit,
    });

    const hitRate = calc.calculateHitRate();
    const effectiveHitRate = 2 * hitRate - hitRate * hitRate;
    const totalHpLoss = calculateComboDamage(attacker1, defender2, [skill]);
    const percentHpLoss = (totalHpLoss / defender2.hp) * 100;

    expect((hitRate * 100).toFixed(1)).toBe("66.8");
    expect((effectiveHitRate * 100).toFixed(1)).toBe("88.9");
    expect(totalHpLoss.toFixed(1)).toBe("3830.9");
    expect(percentHpLoss.toFixed(1)).toBe("30.7");
  });

  test("Example 4: Attacker #2 vs Defender #2", () => {
    const calc = new PvpCalculator({
      attacker: attacker2,
      defender: defender2,
      skill,
      hit,
    });

    const hitRate = calc.calculateHitRate();
    const effectiveHitRate = 2 * hitRate - hitRate * hitRate;
    const totalHpLoss = calculateComboDamage(attacker2, defender2, [skill]);
    const percentHpLoss = (totalHpLoss / defender2.hp) * 100;

    expect((hitRate * 100).toFixed(1)).toBe("58.0");
    expect((effectiveHitRate * 100).toFixed(1)).toBe("82.4");
    expect(totalHpLoss.toFixed(1)).toBe("3274.2");
    expect(percentHpLoss.toFixed(1)).toBe("26.2");
  });
});
