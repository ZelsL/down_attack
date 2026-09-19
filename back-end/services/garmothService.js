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
      spec: specMap[buildData.spec] || "Awakening",

      hp: Number(stats.hp?.toFixed(0)) || 0,

      // AP
      ap: Number(stats.ap?.toFixed(1)) || 0,
      aap: Number(stats.aap?.toFixed(1)) || 0,
      adventureap: Number(stats.adventureap?.toFixed(2)) || 0,
      adventureaap: Number(stats.adventureaap?.toFixed(2)) || 0,

      // DR
      mldr: Number(stats.mldr?.toFixed(0)) || 0,
      radr: Number(stats.radr?.toFixed(0)) || 0,
      madr: Number(stats.madr?.toFixed(0)) || 0,

      // Accuracy & Evasion
      acc: Number(stats.acc?.toFixed(0)) || 0,
      meev: Number(stats.meev?.toFixed(0)) || 0,
      raev: Number(stats.raev?.toFixed(0)) || 0,
      maev: Number(stats.maev?.toFixed(0)) || 0,

      // Reductions & Modifiers
      bdrp: Number(stats.bdrp?.toFixed(0)) || 0,
      chrp: Number(stats.chrp?.toFixed(0)) || 0,
      chc: Number(stats.chc?.toFixed(2)) || 0,

      abad: Number(stats.abad?.toFixed(0)) || 0,
      adad: Number(stats.adad?.toFixed(0)) || 0,
      aaad: Number(stats.aaad?.toFixed(0)) || 0,
    };

    return convertedData;
  }
}
