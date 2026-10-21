export default controller.handle({
  get: [
    controller.canRequest("update:skill"),
    async (event) => {
      const allSkills = await skills.findAll();
      const formattedSkills = allSkills.map(seed.formatSkillForSeed);

      setResponseHeader(
        event,
        "Content-Disposition",
        "attachment; filename=skills.json",
      );
      setResponseHeader(event, "Content-Type", "application/json");
      return formattedSkills;
    },
  ],
});
