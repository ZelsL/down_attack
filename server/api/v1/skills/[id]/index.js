export default controller.handle({
  get: [
    async (event) => {
      const skillId = getRouterParam(event, "id");
      const skillFound = await skills.findOneById(skillId);
      return skillFound;
    },
  ],
  patch: [
    controller.canRequest("update:skill"),
    async (event) => {
      const skillId = getRouterParam(event, "id");
      const updateData = await readBody(event);

      const updatedSkill = await skills.update(skillId, updateData);

      return updatedSkill;
    },
  ],
  delete: [
    controller.canRequest("delete:skill"),
    async (event) => {
      const skillId = getRouterParam(event, "id");

      const deletedSkill = await skills.delete(skillId);
      return deletedSkill;
    },
  ],
});
