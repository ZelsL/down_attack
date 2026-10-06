export default controller.handle({
  get: [
    controller.canRequest("read:combo"),
    async (event) => {
      const id = getRouterParam(event, "id");
      const userTryingToGet = event.context.user;

      const comboFound = await combo.findOneById({
        id,
        user: userTryingToGet,
      });

      return comboFound;
    },
  ],
  patch: [
    controller.canRequest("update:combo"),
    async (event) => {
      const id = getRouterParam(event, "id");
      const userTryingToPatch = event.context.user;
      const comboObject = await readBody(event);

      const updatedCombo = await combo.update({
        comboObject,
        id,
        user: userTryingToPatch,
      });

      return updatedCombo;
    },
  ],
  delete: [
    controller.canRequest("delete:combo"),
    async (event) => {
      const userTryingToDelete = event.context.user;
      const id = getRouterParam(event, "id");

      const deletedCombo = await combo.delete({
        id,
        user: userTryingToDelete,
      });

      return deletedCombo;
    },
  ],
});
