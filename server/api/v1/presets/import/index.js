import { TooManyRequestsError, ValidationError } from "~~/infra/errors.js";

const ipCooldowns = new Map();
const COOLDOWN_IN_MS = 5000;

export default controller.handle({
  post: [
    async (event) => {
      const body = await readBody(event);

      const provider = body.provider;

      const characterId = body.character_id;

      const buildPosition = body.position;

      switch (provider) {
        case "garmoth": {
          const clientIp =
            getHeader(event, "x-forwarded-for") ||
            getRequestIP(event, { xForwardedFor: true }) ||
            "127.0.0.1";

          const lastRequestTime = ipCooldowns.get(clientIp);
          const now = Date.now();

          if (
            lastRequestTime !== undefined &&
            now - lastRequestTime < COOLDOWN_IN_MS
          ) {
            throw new TooManyRequestsError({
              message:
                "Please wait 5 seconds before making another request to Garmoth.",
              action: "Wait a few seconds and try again.",
            });
          }

          ipCooldowns.set(clientIp, now);

          let characterObject;
          if (buildPosition !== undefined) {
            characterObject = await garmoth.findOneById(
              characterId,
              buildPosition,
            );

            return characterObject;
          }
          characterObject = await garmoth.findAllById(characterId);
          return characterObject;
        }
        default:
          throw new ValidationError({
            message: "Invalid provider, valid options are: 'garmoth",
            action: "Verify if you typed provider correctly.",
          });
      }
    },
  ],
});
