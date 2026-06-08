import bcrypt from "bcrypt";
import {
  ResidentNotFoundError,
  EmailAlreadyInUseError,
} from "../errors/residents.js";

export class UpdateResidentUseCase {
  constructor(
    updateResidentRepository,
    getResidentByIdRepository,
    getResidentByEmailRepository,
  ) {
    this.updateResidentRepository = updateResidentRepository;
    this.getResidentByIdRepository = getResidentByIdRepository;
    this.getResidentByEmailRepository = getResidentByEmailRepository;
  }

  async execute(residentId, updateResidentParams) {
    const residentWithProvidedId =
      await this.getResidentByIdRepository.execute(residentId);
    if (!residentWithProvidedId) {
      throw new ResidentNotFoundError();
    }

    if (updateResidentParams.email) {
      const residentWithProvidedEmail =
        await this.getResidentByEmailRepository.execute(
          updateResidentParams.email,
        );

      if (
        residentWithProvidedEmail &&
        residentWithProvidedEmail.id !== residentId
      ) {
        throw new EmailAlreadyInUseError(updateResidentParams.email);
      }
    }

    const resident = {
      ...updateResidentParams,
    };

    if (updateResidentParams.password) {
      const hashedPassword = await bcrypt.hash(
        updateResidentParams.password,
        10,
      );

      resident.password = hashedPassword;
    }

    const updatedResident = await this.updateResidentRepository.execute(
      residentId,
      resident,
    );

    return updatedResident;
  }
}
