import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export class CreateResidentUseCase {
  constructor(createResidentRepository, getResidentByEmailRepository) {
    this.createResidentRepository = createResidentRepository;
    this.getResidentByEmailRepository = getResidentByEmailRepository;
  }

  async execute(createResidentParams) {
    const userWithProvidedEmail =
      await this.getResidentByEmailRepository.execute(
        createResidentParams.email,
      );

    if (userWithProvidedEmail) {
      throw new Error("Email Already in use");
    }

    const residentId = randomUUID();

    const hashedPassword = await bcrypt.hash(createResidentParams.password, 10);

    const resident = {
      ...createResidentParams,
      id: residentId,
      password: hashedPassword,
    };

    const createdResident =
      await this.createResidentRepository.execute(resident);

    return createdResident;
  }
}
