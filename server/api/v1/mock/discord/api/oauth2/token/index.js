import controller from "~~/infra/controller.js";
import { faker } from "@faker-js/faker";
import { setResponseStatus, readBody } from "h3";

export default controller.handle({
  async post(event) {
    const body = await readBody(event);
    const code = body?.code;

    if (code.startsWith("mocked_user_")) {
      return fakeAcessToken(code);
    }
    if (!code || code.length !== 30) {
      setResponseStatus(event, 400);
      return {
        error: "Invalid_grant:",
        error_description: 'Invalid "Code" in request.',
      };
    }

    return fakeAcessToken();

    function fakeAcessToken(acessToken) {
      const fakeAcessToken = acessToken
        ? acessToken
        : faker.string.alphanumeric(30);
      const fakeRefreshToken = faker.string.alphanumeric(30);

      const fakeJson = {
        access_token: fakeAcessToken,
        token_type: "Bearer",
        expires_in: 604800,
        refresh_token: fakeRefreshToken,
        scope: "identify",
      };
      return fakeJson;
    }
  },
});
