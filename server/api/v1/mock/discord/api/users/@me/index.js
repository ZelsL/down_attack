import { faker } from "@faker-js/faker";

export default controller.handle({
  async get(event) {
    const accessToken = getHeader(event, "authorization");

    if (accessToken?.startsWith("Bearer mocked_user_")) {
      const parts = accessToken.split("_");
      const discordId = parts[2];
      const customUsername = parts[3];

      return UserObject(discordId, customUsername);
    }

    return UserObject();

    // Example Discord Return

    //     {
    //         "id": "268473310986240001",
    //         "username": "discord",
    //         "avatar": "f749bb0cbeeb26ef21eca719337d20f1",
    //         "discriminator": "0",
    //         "global_name": "Discord",
    //         "public_flags": 131072
    //     }

    async function UserObject(discord_id, username) {
      const fakeUsername = username ? username : faker.internet.username();
      const fakeUserId = discord_id ? discord_id : faker.string.numeric(18);
      const fakeAvatar = faker.string.alphanumeric(32);

      const fakeUserObject = {
        id: fakeUserId,
        username: fakeUsername,
        avatar: fakeAvatar,
        discriminator: "0",
        global_name: "Discord",
        public_flags: 131072,
      };

      return fakeUserObject;
    }
  },
});
