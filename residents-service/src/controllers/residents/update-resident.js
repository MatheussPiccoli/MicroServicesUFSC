import {
  EmailAlreadyInUseError,
  ResidentNotFoundError,
} from "../../errors/residents.js";
import {
  serverError,
  ok,
  invalidEmailResponse,
  invalidPasswordResponse,
  invalidIdResponse,
  checkIfPasswordIsValid,
  checkIfEmailIsValid,
  checkIfIdIsValid,
  badRequest,
  notFound,
} from "../helpers/index.js";

export class UpdateResidentController {
  constructor(updateResidentUseCase) {
    this.updateResidentUseCase = updateResidentUseCase;
  }
  async execute(httpRequest) {
    try {
      const residentId = httpRequest.params.id;

      const isIdValid = checkIfIdIsValid(residentId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      const lockerIdIsValid = checkIfIdIsValid(params.locker_id);

      if (!lockerIdIsValid) {
        return invalidIdResponse();
      }

      const allowedFields = ["name", "email", "locker_id", "password"];

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      );

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: "Some provided field is not allowed",
        });
      }

      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password);

        if (!passwordIsValid) {
          return invalidPasswordResponse();
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email);

        if (!emailIsValid) {
          return invalidEmailResponse();
        }
      }

      const updatedResident = await this.updateResidentUseCase.execute(
        residentId,
        params,
      );

      return ok(updatedResident);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      if (error instanceof ResidentNotFoundError) {
        return notFound({ message: error.message });
      }
      console.log(error);
      return serverError();
    }
  }
}
