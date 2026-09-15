export default controller.handle({
  get: [
    controller.canRequest("read:session"),
    async (event) => {
      const userTryingToGet = event.context.user;

      const sessionToken = getCookie(event, "session_id");

      const sessionObject = await session.findOneValidByToken(sessionToken);

      const renewedSessionObject = await session.renew(sessionObject.id);

      controller.setSessionCookie(renewedSessionObject.token, event);

      const userFound = await user.findOneById(sessionObject.user_id);

      const secureOutputValues = authorization.filterOutput(
        userTryingToGet,
        "read:user:self",
        userFound,
      );

      setHeader(
        event,
        "Cache-Control",
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      return secureOutputValues;
    },
  ],
});
