export default controller.handle({
  delete: [
    controller.canRequest("read:session"),
    async (event) => {
      const userTryingToDelete = event.context.user;

      const sessionToken = getCookie(event, "session_id");

      const sessionObject = await session.findOneValidByToken(sessionToken);

      const expiredSession = await session.expireById(sessionObject.id);

      const secureOutputValues = authorization.filterOutput(
        userTryingToDelete,
        "read:session",
        expiredSession,
      );

      controller.clearSessionToken(event);

      return secureOutputValues;
    },
  ],
});
