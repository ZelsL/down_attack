export default controller.handle({
  get: [
    async (event) => {
      const userTryingToGet = event.context.user;

      const username = getRouterParam(event, "username");

      const userFound = await user.findOneByUsername(username);

      const secureOutputValues = authorization.filterOutput(
        userTryingToGet,
        "read:user",
        userFound,
      );

      return secureOutputValues;
    },
  ],
});
