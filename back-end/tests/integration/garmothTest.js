import GarmothService from "../../services/garmothService.js";
import dotenv from "dotenv";
dotenv.config();

const characterId = "zels";
const garmothService = new GarmothService();
const buildData = await garmothService.getCharacterBuilds(characterId);
console.log("Original Build Data:", buildData);
