export default controller.handle({
  async get(event) {
    const username = getRouterParam(event, "username");

    const userFound = await user.findOneByUsername(username);

    return userFound;
  },
});
