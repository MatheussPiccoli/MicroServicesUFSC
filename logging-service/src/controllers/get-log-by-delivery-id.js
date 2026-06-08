import {
  requiredFieldIsMissingResponse,
  ok,
  serverError,
  checkIfIdIsValid,
  invalidIdResponse,
} from "../helpers/index.js";

export class GetLogByDeliveryIdController {
  constructor(getLogByDeliveryIdUseCase) {
    this.getLogByDeliveryIdUseCase = getLogByDeliveryIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const { logId } = httpRequest.params;

      const isLogIdValid = checkIfIdIsValid(logId);

      if (!isLogIdValid) {
        return invalidIdResponse();
      }

      const logs = await this.getLogByDeliveryIdUseCase.execute(logId);

      return ok(logs);
    } catch (error) {
      console.error(error);

      return serverError();
    }
  }
}
