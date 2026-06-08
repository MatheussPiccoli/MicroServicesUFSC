import {
  serverError,
  ok,
  checkIfIdIsValid,
  invalidIdResponse,
  residentNotFoundResponse,
} from "../helpers/index.js";

export class DeleteResidentController {
  constructor(deleteResidentUseCase) {
    this.deleteResidentUseCase = deleteResidentUseCase;
  }
  async execute(httpRequest) {
    try {
      const residentId = httpRequest.params.id;

      const idIsValid = checkIfIdIsValid(residentId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const deletedResident =
        await this.deleteResidentUseCase.execute(residentId);

      if (!deletedResident) {
        return residentNotFoundResponse();
      }

      return ok(deletedResident);
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
