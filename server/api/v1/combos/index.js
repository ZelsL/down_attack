export default controller.handle({
  post: [
    controller.canRequest("create:combo"),
    async (event) => {
      const comboObject = await readBody(event);

      const createdCombo = await combo.create(comboObject, event.context.user);

      setResponseStatus(event, 201);
      return createdCombo;
    },
  ],
  get: [
    controller.canRequest("read:combo"),
    async (event) => {
      const userTryingToGet = event.context.user;
      const query = getQuery(event);
      const className = query.class_name || query.className;
      const spec = query.spec;
      const presetId = query.preset_id || query.presetId;

      const combosFound = await combo.findAll({
        className,
        spec,
        presetId,
        user: userTryingToGet,
      });

      return combosFound;
    },
  ],
});
