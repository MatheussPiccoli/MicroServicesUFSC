import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresGetLogByDeliveryIdRepository {
  async execute(logId) {
    const logs = await PostgresHelper.query(
      `
      SELECT *
      FROM logs
      WHERE id = $1
      `,
      [logId],
    );

    return logs;
  }
}
