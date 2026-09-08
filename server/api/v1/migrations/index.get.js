export default defineEventHandler(async (event) => {
  const pendingMigrations = await migrator.listPendingMigrations();

  return pendingMigrations;
});
