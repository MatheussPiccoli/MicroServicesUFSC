import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresGetResidentByIdRepository {
  async execute(residentId) {
    const resident = await PostgresHelper.query(
      "SELECT * FROM residents WHERE id = $1",
      [residentId],
    );

    return resident[0];
  }
}
