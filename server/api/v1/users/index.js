import controller from "~~/infra/controller.js";

export default controller.handle({
  async post(event) {
    return user.discordRedirect(event);
  },
});
