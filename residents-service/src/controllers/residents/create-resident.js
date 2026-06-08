import validator from "validator";
import axios from "axios";

const LOCKERS_URL = process.env.LOCKERS_SERVICE_URL || "http://localhost:3005";

export class CreateResidentController {
  constructor(createResidentUseCase) {
    this.createResidentUseCase = createResidentUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body || {};

      const { name, email, password, locker_id } = httpRequest.body;

      const requiredFields = ["name", "email", "locker_id", "password"];

      for (const field of requiredFields) {
        const fieldIsMissing = !params[field];
        const fieldIsEmpty =
          typeof checkIfIsString !== "undefined" &&
          checkIfIsString(params[field]) &&
          validator.isEmpty(params[field], { ignore_whitespace: true });

        if (fieldIsMissing || fieldIsEmpty) {
          return {
            statusCode: 400,
            body: { message: `The field ${field} is required` },
          };
        }
      }

      try {
        await axios.get(`${LOCKERS_URL}/lockers/${locker_id}`);
      } catch (err) {
        if (err.response?.status === 404) {
          return {
            statusCode: 404,
            body: {
              message: "Locker not found",
            },
          };
        }

        return {
          statusCode: 503,
          body: {
            message: "Lockers service unavailable",
          },
        };
      }

      const passwordIsValid = params.password && params.password.length >= 6;
      if (!passwordIsValid) {
        return {
          statusCode: 400,
          body: { message: "Password must be at least 6 characters" },
        };
      }

      const emailIsValid = validator.isEmail(params.email);
      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: {
            message:
              "The provided email is not valid, please provide a valid one",
          },
        };
      }

      const createdResident = await this.createResidentUseCase.execute(params);

      return {
        statusCode: 201,
        body: createdResident,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: error.message === "Email Already in use" ? 400 : 500,
        body: {
          message: error.message || "Internal server error",
        },
      };
    }
  }
}
