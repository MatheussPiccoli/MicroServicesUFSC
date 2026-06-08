import { ResidentNotFoundError } from "../../errors/residents.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  notFound,
  ok,
  serverError,
} from "../helpers/index.js";

export class GetResidentByIdController {
  constructor(getResidentByIdUseCase) {
    this.getResidentByIdUseCase = getResidentByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const { id } = httpRequest.params;

      const idIsValid = checkIfIdIsValid(id);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const resident = await this.getResidentByIdUseCase.execute(id);

      return ok(resident);
    } catch (error) {
      console.error(error);

      if (error instanceof ResidentNotFoundError) {
        return notFound({
          message: "Resident not found",
        });
      }

      return serverError();
    }
  }
}
