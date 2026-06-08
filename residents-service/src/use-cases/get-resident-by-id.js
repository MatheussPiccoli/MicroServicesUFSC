import { ResidentNotFoundError } from "../errors/residents.js";

export class GetResidentByIdUseCase {
  constructor(getResidentByIdRepository) {
    this.getResidentByIdRepository = getResidentByIdRepository;
  }

  async execute(residentId) {
    const resident = await this.getResidentByIdRepository.execute(residentId);

    if (!resident) {
      throw new ResidentNotFoundError();
    }

    return resident;
  }
}
