export default controller.handle({
  post: async (event) => {
    const body = await readBody(event);

    const isReset = Boolean(body && body.token);
    const sessionObject = await solare.createOrResetSession(body);

    setResponseStatus(event, isReset ? 200 : 201);
    return sessionObject;
  },
});
