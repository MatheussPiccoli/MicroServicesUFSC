import { PostgresHelper } from "../db/postgres/helper.js";

export class PostGresGetUserByEmailRepository {
  async execute(email) {
    const user = await PostgresHelper.query(
      "SELECT * FROM residents WHERE email = $1",
      [email],
    );

    return user[0];
  }
}
