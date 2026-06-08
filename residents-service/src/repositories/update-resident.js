import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresUpdateResidentRepository {
  async execute(residentId, updateResidentParams) {
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateResidentParams).forEach((key) => {
      updateFields.push(`${key} = $${updateValues.length + 1}`);
      updateValues.push(updateResidentParams[key]);
    });

    updateValues.push(residentId);

    const updateQuery = `
            UPDATE residents
            SET ${updateFields.join(", ")}
            WHERE id = $${updateValues.length}
            RETURNING *
          `;

    const updatedResident = await PostgresHelper.query(
      updateQuery,
      updateValues,
    );
    return updatedResident[0];
  }
}
