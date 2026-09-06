import express from "express";
import PvpCalculator from "../controllers/PvpCalculatorController.js";
import db from "../database/connection.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import { garmothRateLimit } from "../middleware/rateLimiters.js";
import {
  validateAttackStateMiddleware,
  validateClassSpecMiddleware,
  validateSkillSpecMiddleware,
  validateStatusMiddleware,
} from "../middleware/pvpCalculatorValidation.js";
import GarmothService from "../services/garmothService.js";

const PvpCalculatorRoutes = express.Router();

PvpCalculatorRoutes.post("/calculate", (req, res) => {
  try {
    const {
      attacker_class,
      defender_class,
      defender_class_spec,
      attacker_class_spec,
      skill_spec,
      total_ap_pvp,
      total_aap_pvp,
      sheet_ap,
      sheet_aap,
      melee_dr,
      ranged_dr,
      magic_dr,
      accuracy,
      melee_evasion,
      ranged_evasion,
      magic_evasion,
      dr_percent,
      critical,
      back_attack,
      down_attack,
      air_attack,
      skill_damage_percent,
      skill_pvp_reduction_percent,
      critical_hit_rate,
      state,
    } = req.body;
    if (skill_damage_percent <= 0) {
      return res.status(400).json({
        error: "skill damage must be greater than 0",
      });
    }
    if (!attacker_class || !defender_class) {
      return res.status(400).json({
        error: "attacker_class and defender_class are required",
      });
    }

    if (!attacker_class_spec || !defender_class_spec || !skill_spec) {
      return res.status(400).json({
        error:
          "attacker_class_spec, defender_class_spec and skill_spec are required",
      });
    }

    // Cria o calculador (sem class_pvp_modifier - ele é calculado internamente)
    const calculator = new PvpCalculator(
      attacker_class,
      defender_class,
      defender_class_spec,
      attacker_class_spec,
      skill_spec,
      parseFloat(total_ap_pvp) || 0,
      parseFloat(total_aap_pvp) || 0,
      parseFloat(sheet_ap) || 0,
      parseFloat(sheet_aap) || 0,
      parseFloat(melee_dr) || 0,
      parseFloat(ranged_dr) || 0,
      parseFloat(magic_dr) || 0,
      parseFloat(accuracy) || 0,
      parseFloat(melee_evasion) || 0,
      parseFloat(ranged_evasion) || 0,
      parseFloat(magic_evasion) || 0,
      parseFloat(dr_percent) || 0,
      parseFloat(critical) || 0,
      parseFloat(back_attack) || 0,
      parseFloat(down_attack) || 0,
      parseFloat(air_attack) || 0,
      parseFloat(skill_damage_percent) || 100,
      parseFloat(skill_pvp_reduction_percent) || 100,
      parseFloat(critical_hit_rate) || 0,
    );

    // Calcula o resultado
    const result = calculator.hpLossCalculator(state || "normal");

    // Retorna resultado com informações adicionais
    res.json({
      success: true,
      data: {
        hp_loss: result.hp_loss,
        hitrate: result.hitrate,
        class_pvp_modifier: calculator.class_pvp_modifier,
        dr_used: calculator.dr,
        evasion_used: calculator.evasion,
      },
    });
  } catch (error) {
    console.error("Error calculating PvP:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

PvpCalculatorRoutes.get(
  "/presets/:id",
  ensureAuthenticated,
  async (req, res) => {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";

    let query = db("calculator_presets").where({ id: id });

    if (!isAdmin) {
      query.where({ discord_id: req.user.discord_id });
    }

    const preset = await query.limit(10).first();

    if (preset) {
      return res.status(200).json({
        success: true,
        preset: preset,
      });
    }

    return res.status(404).json({
      success: false,
      error: "Preset not found.",
    });
  },
);

PvpCalculatorRoutes.get("/presets", async (req, res) => {
  try {
    const { allpresets, class_name } = req.query;
    const isAdmin = req.user?.role === "admin";

    let query = db("calculator_presets");
    const showAll = allpresets === "true";
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 1000);
    const offset = (page - 1) * limit;

    if (class_name) {
      query.where({ class_name });
    }

    if (isAdmin && showAll) {
    } else if (user) {
      query.where((builder) => {
        builder
          .where({ discord_id: user.discord_id })
          .orWhere({ discord_id: "0" });
      });
    } else {
      query.where({ discord_id: "0" });
    }

    const presets = await query
      .select()
      .limit(limit)
      .offset(offset)
      .orderBy("class_name", "asc")
      .orderBy("name", "asc");
    if (presets.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No presets found.",
      });
    }

    res.status(200).json({
      success: true,
      presets: presets,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error("Error fetching PvP presets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch presets" + error.message,
    });
  }
});

PvpCalculatorRoutes.delete(
  "/presets/:id",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const presetId = req.params.id;

      const preset = await db("calculator_presets")
        .where({ id: presetId })
        .first();

      if (!preset) {
        return res.status(404).json({
          success: false,
          error: "Preset not found",
        });
      }

      const isAdmin = req.user.role === "admin";
      const isOwner = preset.discord_id === req.user.discord_id;

      let isAuthorized = isAdmin || isOwner;

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: "You do not have permission to delete this preset",
        });
      }

      const deletedRows = await db("calculator_presets")
        .where({ id: req.params.id })
        .del();

      if (deletedRows === 0) {
        return res.status(500).json({
          success: false,
          error: "Failed to delete preset",
        });
      }
      res.status(200).json({
        success: true,
        message: "Preset deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting PvP preset:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete preset" + error.message,
      });
    }
  },
);

PvpCalculatorRoutes.put(
  "/presets/:id",
  [
    ensureAuthenticated,
    validateAttackStateMiddleware,
    validateClassSpecMiddleware,
    validateSkillSpecMiddleware,
    validateStatusMiddleware,
  ],
  async (req, res) => {
    try {
      const {
        name,
        class_name,
        class_spec,
        total_ap_pvp,
        total_aap_pvp,
        sheet_ap,
        sheet_aap,
        melee_dr,
        ranged_dr,
        magic_dr,
        accuracy,
        melee_evasion,
        ranged_evasion,
        magic_evasion,
        dr_percent,
        critical,
        back_attack,
        down_attack,
        air_attack,
        skill_damage_percent,
        skill_pvp_reduction_percent,
        critical_hit_rate,
        hp,
        attacker_state,
        skill_spec,
      } = req.body;
      const stats_list = {
        name,
        class_name,
        class_spec,
        total_ap_pvp,
        total_aap_pvp,
        sheet_ap,
        sheet_aap,
        melee_dr,
        ranged_dr,
        magic_dr,
        accuracy,
        melee_evasion,
        ranged_evasion,
        magic_evasion,
        dr_percent,
        critical,
        back_attack,
        down_attack,
        air_attack,
        skill_damage_percent,
        skill_pvp_reduction_percent,
        critical_hit_rate,
        hp,
        skill_spec,
        attacker_state,
      };
      const isAdmin = req.user.role === "admin";

      for (const item in stats_list) {
        if (stats_list[item] === undefined) {
          delete stats_list[item];
        }
      }

      let query = db("calculator_presets").where({ id: req.params.id });

      if (!isAdmin) {
        query.where({ discord_id: req.user.discord_id });
      }

      const updatedRows = await query.update(stats_list);

      if (updatedRows) {
        return res.status(200).json({
          success: true,
          message: "Preset updated successfully",
          presetId: req.params.id,
          updatedRows: updatedRows,
        });
      }

      return res.status(404).json({
        success: false,
        error: "Preset updated unsuccessfully",
      });
    } catch (error) {
      console.error("Error updating PvP preset:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update preset" + error.message,
      });
    }
  },
);

PvpCalculatorRoutes.post(
  "/presets",
  [
    ensureAuthenticated,
    validateClassSpecMiddleware,
    validateSkillSpecMiddleware,
    validateAttackStateMiddleware,
    validateStatusMiddleware,
  ],
  async (req, res) => {
    try {
      const {
        name,
        class_name,
        class_spec,
        total_ap_pvp,
        total_aap_pvp,
        sheet_ap,
        sheet_aap,
        melee_dr,
        ranged_dr,
        magic_dr,
        accuracy,
        melee_evasion,
        ranged_evasion,
        magic_evasion,
        dr_percent,
        critical,
        back_attack,
        down_attack,
        air_attack,
        skill_damage_percent,
        skill_pvp_reduction_percent,
        critical_hit_rate,
        hp,
        skill_spec,
        attacker_state,
        admin,
      } = req.body;

      let authorId = req.user.discord_id;

      if (admin === true && req.user.role === "admin") {
        authorId = "0";
      }

      const author = req.user.username;

      const [presetId] = await db("calculator_presets").insert({
        name,
        author,
        discord_id: authorId,
        class_name,
        class_spec,
        total_ap_pvp,
        total_aap_pvp,
        sheet_ap,
        sheet_aap,
        melee_dr,
        ranged_dr,
        magic_dr,
        accuracy,
        melee_evasion,
        ranged_evasion,
        magic_evasion,
        dr_percent,
        critical,
        back_attack,
        down_attack,
        air_attack,
        skill_damage_percent,
        skill_pvp_reduction_percent,
        critical_hit_rate,
        hp,
        skill_spec,
        attacker_state,
      });
      const [newPreset] = await db("calculator_presets").where({
        id: presetId,
      });

      res.status(201).json({
        success: true,
        presetId: presetId,
        preset: newPreset,
      });
    } catch (error) {
      console.error("Error saving PvP preset:", error);
      res.status(500).json({
        success: false,
        error: "Failed to save preset" + error.message,
      });
    }
  },
);

PvpCalculatorRoutes.get(
  "/import/:garmothId",
  garmothRateLimit,
  async (req, res) => {
    try {
      const { garmothId } = req.params;
      const garmothService = new GarmothService();
      const buildData = await garmothService.getCharacterBuilds(garmothId);
      const convertedData = garmothService.convertBuildToSuperArmorFormat(
        buildData.data[0],
      );
      if (!convertedData) {
        return res.status(404).json({
          success: false,
          error: "No builds found for this character on Garmoth API.",
        });
      }
      res.status(200).json({
        success: true,
        data: convertedData,
      });
    } catch (error) {
      console.error("Error importing build from Garmoth:", error);
      res.status(500).json({
        success: false,
        error: "Failed to import build from Garmoth API: " + error.message,
      });
    }
  },
);

export default PvpCalculatorRoutes;
