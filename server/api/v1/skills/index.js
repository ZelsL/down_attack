import { ValidationError } from "~~/infra/errors.js";

export default controller.handle({
  get: [
    async (event) => {
      const query = getQuery(event);
      const className = query.class_name || query.className;
      const spec = query.spec;

      if (className && spec) {
        return await skills.findAllBySpec(className, spec);
      }

      if (className) {
        return await skills.findAllByClassName(className);
      }

      throw new ValidationError({
        message: '"className" query parameter is required.',
        action:
          'Please provide a "className" query parameter, e.g. /api/v1/skills?className=Hashashin',
      });
    },
  ],
  post: [
    controller.canRequest("create:skill"),
    async (event) => {
      const skillObject = await readBody(event);

      const createdSkill = await skills.create(skillObject);

      setResponseStatus(event, 201);

      return createdSkill;
    },
  ],
});
