export class GetLogByDeliveryIdUseCase {
  constructor(getLogByDeliveryIdRepository) {
    this.getLogByDeliveryIdRepository = getLogByDeliveryIdRepository;
  }

  async execute(logId) {
    const logs = await this.getLogByDeliveryIdRepository.execute(logId);

    return logs;
  }
}
