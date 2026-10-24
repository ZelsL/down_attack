export default controller.handle({
  get: async (event) => {
    const query = getQuery(event);

    const overlayData = await solare.getOverlayData({
      nick: query.nick,
      region: query.region,
      token: query.token,
    });

    return overlayData;
  },
});
