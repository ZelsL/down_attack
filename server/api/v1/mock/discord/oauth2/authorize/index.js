import controller from "~~/infra/controller.js";
import { faker } from "@faker-js/faker";

export default controller.handle({
  async get(event) {
    const query = getQuery(event);
    const redirectUri = query.redirect_uri;
    const code = faker.string.alphanumeric(30);

    sendRedirect(event, `${redirectUri}?code=${code}`);
  },
});
