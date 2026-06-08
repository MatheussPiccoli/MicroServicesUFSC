import {
  badRequest,
  created,
  serverError,
  checkIfActionIsValid,
} from "../helpers/index.js";

export class CreateLogController {
  constructor(createLogUseCase) {
    this.createLogUseCase = createLogUseCase;
  }

  async execute(httpRequest) {
    try {
      const { delivery, email, locker_id, action } = httpRequest.body;

      if (!delivery) {
        return badRequest({
          message: "delivery is required",
        });
      }

      if (!email) {
        return badRequest({
          message: "email is required",
        });
      }

      if (!locker_id) {
        return badRequest({
          message: "locker_id is required",
        });
      }

      if (!checkIfActionIsValid(action)) {
        return badRequest({
          message: "Invalid action",
        });
      }

      const log = await this.createLogUseCase.execute({
        delivery,
        email,
        locker_id,
        action,
      });

      return created(log);
    } catch (error) {
      console.error(error);

      return serverError();
    }
  }
}
