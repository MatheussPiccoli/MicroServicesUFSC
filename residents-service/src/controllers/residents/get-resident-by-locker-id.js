import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from "../helpers/index.js";

export class GetResidentsByLockerIdController {
  constructor(getResidentsByLockerIdUseCase) {
    this.getResidentsByLockerIdUseCase = getResidentsByLockerIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const lockerId = httpRequest.params.lockerId;

      const lockerIdIsValid = checkIfIdIsValid(lockerId);

      if (!lockerIdIsValid) {
        return invalidIdResponse();
      }

      const residents =
        await this.getResidentsByLockerIdUseCase.execute(lockerId);

      return ok(residents);
    } catch (error) {
      console.error(error);

      return serverError();
    }
  }
}
