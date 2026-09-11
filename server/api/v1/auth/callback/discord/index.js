import controller from "~~/infra/controller.js";
import { ValidationError } from "~~/infra/errors.js";

export default controller.handle({
  async get(event) {
    const query = getQuery(event);

    if (!query.code) {
      throw new ValidationError({
        message: "Missing 'code' query parameter",
        action: "Send a valid 'code' query parameter in the request.",
      });
    }

    const code = query.code;

    const discordUser = await user.fetchUserFromDiscord(code);

    const newUser = await user.create(discordUser);

    const newSession = await session.create(newUser.id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
      path: "/",
    };

    setCookie(event, "session_id", newSession.token, cookieOptions);

    return sendRedirect(event, "/");
  },
});
