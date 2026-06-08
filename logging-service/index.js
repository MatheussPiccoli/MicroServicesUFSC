import "dotenv/config.js";
import express, { response } from "express";
import {
  makeCreateLogController,
  makeGetAllLogsController,
  makeGetLogByDeliveryIdController,
} from "./src/factories/index.js";

const app = express();

app.use(express.json());

app.get("/api/logs/:logId", async (request, response) => {
  const getLogByDeliveryIdController = makeGetLogByDeliveryIdController();

  const { statusCode, body } =
    await getLogByDeliveryIdController.execute(request);

  response.status(statusCode).send(body);
});

app.get("/api/logs", async (request, response) => {
  const controller = makeGetAllLogsController();

  const { statusCode, body } = await controller.execute();

  response.status(statusCode).send(body);
});

app.post("/api/logs", async (request, response) => {
  const createLogController = makeCreateLogController();

  const { statusCode, body } = await createLogController.execute(request);

  response.status(statusCode).send(body);
});

app.listen(process.env.PORT || 3004, () =>
  console.log(`listening on port ${process.env.PORT}`),
);
