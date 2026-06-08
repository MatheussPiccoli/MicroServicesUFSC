import { randomUUID } from "crypto";

export class CreateLogUseCase {
  constructor(createLogRepository) {
    this.createLogRepository = createLogRepository;
  }

  async execute(params) {
    const log = {
      id: randomUUID(),
      delivery: params.delivery,
      email: params.email,
      locker_id: params.locker_id,
      action: params.action,
    };

    return await this.createLogRepository.execute(log);
  }
}
