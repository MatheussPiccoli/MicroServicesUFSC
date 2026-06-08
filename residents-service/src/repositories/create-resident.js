import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresCreateResidentRepository {
  async execute(createResidentParams) {
    const createdResident = await PostgresHelper.query(
      "INSERT INTO residents (id, name, email, locker_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        createResidentParams.id,
        createResidentParams.name,
        createResidentParams.email,
        createResidentParams.locker_id,
        createResidentParams.password,
      ],
    );

    return createdResident[0];
  }
}
