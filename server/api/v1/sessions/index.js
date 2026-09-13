import controller from "~~/infra/controller.js";

export default controller.handle({
  async delete(event) {
    const sessionToken = getCookie(event, "session_id");

    const sessionObject = await session.findOneValidByToken(sessionToken);

    const expiredSession = await session.expireById(sessionObject.id);

    controller.clearSessionToken(event);

    return expiredSession;
  },
});
