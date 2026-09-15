export default controller.handle({
  delete: [
    async (event) => {
      const sessionToken = getCookie(event, "session_id");

      const sessionObject = await session.findOneValidByToken(sessionToken);

      const expiredSession = await session.expireById(sessionObject.id);

      controller.clearSessionToken(event);

      return expiredSession;
    },
  ],
});
