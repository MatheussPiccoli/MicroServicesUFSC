export class GetResidentsByLockerIdUseCase {
  constructor(getResidentsByLockerIdRepository) {
    this.getResidentsByLockerIdRepository = getResidentsByLockerIdRepository;
  }

  async execute(lockerId) {
    const residents =
      await this.getResidentsByLockerIdRepository.execute(lockerId);

    return residents;
  }
}
