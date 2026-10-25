export default controller.handle({
  get: async (event) => {
    const query = getQuery(event);

    const overlayData = await solare.getOverlayData({
      nick: query.nick,
      region: query.region,
      token: query.token,
    });

    setHeader(
      event,
      "Cache-Control",
      "public, max-age=0, s-maxage=10, stale-while-revalidate=10",
    );

    return overlayData;
  },
});
