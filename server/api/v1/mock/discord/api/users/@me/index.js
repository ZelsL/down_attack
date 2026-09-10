import controller from "~~/infra/controller.js";
import { faker } from "@faker-js/faker";

export default controller.handle({
  async get(event) {
    // Example Authorization Information

    // {
    //     "application": {
    //         "id": "159799960412356608",
    //         "name": "AIRHORN SOLUTIONS",
    //         "icon": "f03590d3eb764081d154a66340ea7d6d",
    //         "description": "",
    //         "hook": true,
    //         "bot_public": true,
    //         "bot_require_code_grant": false,
    //         "verify_key": "c8cde6a3c8c6e49d86af3191287b3ce255872be1fff6dc285bdb420c06a2c3c8"
    //     },
    //     "scopes": [
    //         "guilds.join",
    //         "identify"
    //     ],
    //     "expires": "2021-01-23T02:33:17.017000+00:00",
    //     "user": {
    //         "id": "268473310986240001",
    //         "username": "discord",
    //         "avatar": "f749bb0cbeeb26ef21eca719337d20f1",
    //         "discriminator": "0",
    //         "global_name": "Discord",
    //         "public_flags": 131072
    //     }
    // }

    const fakeUsername = faker.internet.username();
    const fakeUserId = faker.string.numeric(18);
    const fakeAvatar = faker.string.alphanumeric(32);

    const fakeUserObject = {
      application: {
        id: "159799960412356608",
        name: "Down Attack",
        icon: "300ae0e41577b4ceb9cd41d2ee91f96a",
        description: "",
        hook: true,
        bot_public: true,
        bot_require_code_grant: false,
        verify_key:
          "c8cde6a3c8c6e49d86af3191287b3ce255872be1fff6dc285bdb420c06a2c3c8",
      },
      scopes: ["guilds.join", "identify"],
      expires: new Date(Date.now() + 604800000).toISOString(),
      user: {
        id: fakeUserId,
        username: fakeUsername,
        avatar: fakeAvatar,
        discriminator: "0",
        global_name: "Discord",
        public_flags: 131072,
      },
    };

    return fakeUserObject;
  },
});
