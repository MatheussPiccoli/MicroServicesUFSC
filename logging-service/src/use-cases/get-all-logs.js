export class GetAllLogsUseCase {
  constructor(getAllLogsRepository) {
    this.getAllLogsRepository = getAllLogsRepository;
  }

  async execute() {
    const logs = await this.getAllLogsRepository.execute();

    return logs;
  }
}
