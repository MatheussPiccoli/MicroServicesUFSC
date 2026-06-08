import { ok, serverError } from "../helpers/index.js";

export class GetAllLogsController {
  constructor(getAllLogsUseCase) {
    this.getAllLogsUseCase = getAllLogsUseCase;
  }

  async execute() {
    try {
      const logs = await this.getAllLogsUseCase.execute();

      return ok(logs);
    } catch (error) {
      console.error(error);

      return serverError();
    }
  }
}
