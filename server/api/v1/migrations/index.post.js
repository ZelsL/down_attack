export default defineEventHandler(async (event) => {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    setResponseStatus(event, 201);
    return migratedMigrations;
  }

  return migratedMigrations;
});
