export default controller.handle({
  get: [
    async (event) => {
      const className = getRouterParam(event, "className");

      const skillsFound = skills.findAllByClassName(className);

      return skillsFound;
    },
  ],
});
