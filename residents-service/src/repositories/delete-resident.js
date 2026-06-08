import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresDeleteResidentRepository {
  async execute(residentId) {
    const deletedResident = await PostgresHelper.query(
      "DELETE FROM residents WHERE id = $1 RETURNING *",
      [residentId],
    );

    return deletedResident[0];
  }
}
