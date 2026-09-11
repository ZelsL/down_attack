import controller from "~~/infra/controller.js";

export default controller.handle({
  async get(event) {
    const pendingMigrations = await migrator.listPendingMigrations();
    return pendingMigrations;
  },

  async post(event) {
    const migratedMigrations = await migrator.runPendingMigrations();

    if (migratedMigrations.length > 0) {
      setResponseStatus(event, 201);
      return migratedMigrations;
    }

    return migratedMigrations;
  },
});
