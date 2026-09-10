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

    const discordCode = query.code;

    const userObject = await user.fetchUserFromDiscord(discordCode);

    return userObject;
  },
});
