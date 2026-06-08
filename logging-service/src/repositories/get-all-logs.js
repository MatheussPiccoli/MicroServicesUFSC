import { PostgresHelper } from "../db/postgres/helper.js";

export class PostgresGetAllLogsRepository {
  async execute() {
    const logs = await PostgresHelper.query(
      `
      SELECT *
      FROM logs
      ORDER BY id
      `,
    );

    return logs;
  }
}
