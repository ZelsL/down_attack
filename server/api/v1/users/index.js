export default controller.handle({
  post: [
    controller.canRequest("create:user"),
    async (event) => {
      return user.discordRedirect(event);
    },
  ],
});
