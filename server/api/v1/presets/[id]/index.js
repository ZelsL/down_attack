export default controller.handle({
  get: [
    async (event) => {
      const id = getRouterParam(event, "id");
      const user = event.context.user;

      const presetFound = await preset.findOneById(id, user);

      return presetFound;
    },
  ],
  patch: [
    controller.canRequest("create:preset"),
    async (event) => {
      const id = getRouterParam(event, "id");
      const skillObject = await readBody(event);
      const user = event.context.user;

      const updatedPreset = await preset.update(id, skillObject, user);

      return updatedPreset;
    },
  ],
  delete: [
    controller.canRequest("delete:preset"),
    async (event) => {
      const id = getRouterParam(event, "id");

      const user = event.context.user;

      const deletedPreset = await preset.delete(id, user);

      return deletedPreset;
    },
  ],
});
