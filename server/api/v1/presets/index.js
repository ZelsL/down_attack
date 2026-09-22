export default controller.handle({
  get: [
    async (event) => {
      const userTryingToGet = event.context.user;
      const query = getQuery(event);

      const className = query.class_name || query.className;
      const spec = query.spec;
      const scope = query.scope;

      const presetsFound = await preset.findAll({
        className,
        spec,
        scope,
        user: userTryingToGet,
      });

      return presetsFound;
    },
  ],
  post: [
    controller.canRequest("create:preset"),
    async (event) => {
      const presetObject = await readBody(event);

      const createdPreset = await preset.create(
        presetObject,
        event.context.user,
      );

      setResponseStatus(event, 201);

      return createdPreset;
    },
  ],
});
