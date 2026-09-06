import db from "../database/connection.js";

/**
 * Salva um novo preset de aprimoramento no banco de dados.
 * @param {object} presetInfo
 * @returns {Promise<number>}
 */
async function saveSimulatorState(stateInfo) {
  try {
    const {
      user_id,
      session_id,
      enhanceable_item_id,
      tier,
      base_failstack,
      valks_cry,
      perm_enh_chance,
    } = stateInfo;

    const searchCriteria = user_id ? { user_id } : { session_id };

    const stateData = {
      enhanceable_item_id,
      tier,
      base_failstack,
      valks_cry,
      perm_enh_chance,
    };

    const updatedRows = await db("user_simulator_state")
      .where(searchCriteria)
      .update(stateData);

    if (updatedRows === 0) {
      await db("user_simulator_state").insert({
        ...searchCriteria,
        ...stateData,
      });
    }
  } catch (error) {
    console.error("Database error in saveSimulatorState:", error);
    throw new Error("Error saving user state");
  }
}

async function accessSimulatorState(user_id = null, session_id = null) {
  try {
    const searchCriteria = user_id ? { user_id } : { session_id };
    console.log(searchCriteria);
    if (!searchCriteria) {
      return { error: "User not found" };
    }
    const state = await db("user_simulator_state")
      .where(searchCriteria)
      .first();
    return state;
  } catch (error) {
    console.error("Database error in accessSimulatorState:", error);
    throw new Error("Error accessing user state");
  }
}

export { saveSimulatorState, accessSimulatorState };
