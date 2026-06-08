import "dotenv/config.js";
import express, { response } from "express";
import {
  makeCreateResidentController,
  makeDeleteResidentController,
  makeGetResidentByIdController,
  makeGetResidentsByLockerIdController,
  makeUpdateResidentController,
} from "./src/controllers/factories/index.js";

const app = express();

app.use(express.json());

app.post("/api/residents", async (request, response) => {
  const createResidentController = makeCreateResidentController();

  const { statusCode, body } = await createResidentController.execute(request);

  response.status(statusCode).send(body);
});

app.get("/api/residents/locker/:lockerId", async (request, response) => {
  const controller = makeGetResidentsByLockerIdController();

  const { statusCode, body } = await controller.execute(request);

  response.status(statusCode).send(body);
});

app.get("/api/residents/:id", async (request, response) => {
  const getResidentByIdcontroller = makeGetResidentByIdController();

  const { statusCode, body } = await getResidentByIdcontroller.execute(request);

  response.status(statusCode).send(body);
});

app.patch("/api/residents/:id", async (request, response) => {
  const updateResidentController = makeUpdateResidentController();

  const { statusCode, body } = await updateResidentController.execute(request);

  response.status(statusCode).send(body);
});

app.delete("/api/residents/:id", async (request, response) => {
  const deleteResidentController = makeDeleteResidentController();

  const { statusCode, body } = await deleteResidentController.execute(request);

  response.status(statusCode).send(body);
});

app.listen(process.env.PORT || 3002, () =>
  console.log(`listening on port ${process.env.PORT}`),
);
