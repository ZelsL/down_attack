export default controller.handle({
  get: [
    controller.canRequest("read:migrations"),
    async (event) => {
      const userTryingToGet = event.context.user;

      const pendingMigrations = await migrator.listPendingMigrations();

      const secureOutputValues = authorization.filterOutput(
        userTryingToGet,
        "read:migrations",
        pendingMigrations,
      );

      return secureOutputValues;
    },
  ],
  post: [
    controller.canRequest("run:migrations"),
    async (event) => {
      const userTryingToPost = event.context.user;

      const migratedMigrations = await migrator.runPendingMigrations();

      const secureOutputValues = authorization.filterOutput(
        userTryingToPost,
        "read:migrations",
        migratedMigrations,
      );

      if (migratedMigrations.length > 0) {
        setResponseStatus(event, 201);
        return secureOutputValues;
      }

      return secureOutputValues;
    },
  ],
});
