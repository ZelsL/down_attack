import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default class GarmothService {
  constructor() {
    this.apiKey = process.env.garmoth_api_key;
    this.apiUrl = process.env.garmoth_api_url;
  }

  async getCharacterBuilds(id) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          ids: id,
        },
        headers: {
          apiKey: this.apiKey,
        },
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }
      return response;
    } catch (error) {
      console.error("Error fetching character builds from Garmoth API:", error);
      throw error;
    }
  }

  convertBuildToSuperArmorFormat(buildData) {
    const classesMap = {
      19: "Hashashin",
    };
    const specMap = {
      awak: "Awakening",
      succ: "Succession",
    };

    if (!buildData.builds || buildData.builds.length === 0) {
      return null;
    }

    const stats = buildData.builds[0].stats;

    const convertedData = {
      class_name: classesMap[buildData.class] || "Unknown",

      class_spec: specMap[buildData.spec] || "Awakening",

      total_ap_pvp: stats.adventureap?.toFixed(2) || 0,
      total_aap_pvp: stats.adventureaap?.toFixed(2) || 0,
      sheet_ap: stats.ap?.toFixed(1) || 0,
      sheet_aap: stats.aap?.toFixed(1) || 0,

      melee_dr: stats.mldr?.toFixed(0) || 0,
      ranged_dr: stats.radr?.toFixed(0) || 0,
      magic_dr: stats.madr?.toFixed(0) || 0,

      accuracy: stats.acc?.toFixed(0) || 0,

      melee_evasion: stats.meev?.toFixed(0) || 0,
      ranged_evasion: stats.raev?.toFixed(0) || 0,
      magic_evasion: stats.maev?.toFixed(0) || 0,

      dr_percent: stats.bdrp?.toFixed(0) || 0,
      critical: stats.chrp?.toFixed(0) || 0,

      back_attack: stats.abad?.toFixed(0) || 0,
      down_attack: stats.adad?.toFixed(0) || 0,
      air_attack: stats.aaad?.toFixed(0) || 0,

      skill_damage_percent: 30000,
      skill_pvp_reduction_percent: 30,

      critical_hit_rate: stats.chc?.toFixed(2) || 0,
      hp: stats.hp?.toFixed(0) || 0,

      skill_spec: specMap[buildData.spec] || "Awakening",
      attacker_state: "normal",
    };

    return convertedData;
  }
}
