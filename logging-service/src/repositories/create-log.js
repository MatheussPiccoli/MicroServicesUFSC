import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresCreateLogRepository {
  async execute(logData) {
    const result = await PostgresHelper.query(
      `
      INSERT INTO logs (
        id,
        delivery,
        email,
        locker_id,
        action
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        logData.id,
        logData.delivery,
        logData.email,
        logData.locker_id,
        logData.action,
      ],
    );

    return result[0];
  }
}
