export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`The email ${email} is already in use`);
    this.name = "EmailAlreadyInUseError";
  }
}

export class ResidentNotFoundError extends Error {
  constructor() {
    super(`Resident with provided id not found`);
    this.name = "ResidentNotFoundError";
  }
}
