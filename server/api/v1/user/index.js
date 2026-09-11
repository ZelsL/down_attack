import controller from "~~/infra/controller.js";

export default controller.handle({
  async get(event) {
    const sessionToken = getCookie(event, "session_id");

    const sessionObject = await session.findOneValidByToken(sessionToken);

    const renewedSessionObject = await session.renew(sessionObject.id);

    controller.setSessionCookie(renewedSessionObject.token, event);

    const userFound = await user.findOneById(sessionObject.user_id);

    setHeader(
      event,
      "Cache-Control",
      "no-store, no-cache, max-age=0, must-revalidate",
    );

    return userFound;
  },
});
