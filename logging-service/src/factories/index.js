import {
  CreateLogController,
  GetLogByDeliveryIdController,
} from "../controllers/index.js";
import {
  CreateLogUseCase,
  GetAllLogsUseCase,
  GetLogByDeliveryIdUseCase,
} from "../use-cases/index.js";
import {
  PostgresCreateLogRepository,
  PostgresGetAllLogsRepository,
  PostgresGetLogByDeliveryIdRepository,
} from "../repositories/index.js";
import { GetAllLogsController } from "../controllers/get-all-logs.js";

export const makeCreateLogController = () => {
  const createLogRepository = new PostgresCreateLogRepository();

  const createLogUseCase = new CreateLogUseCase(createLogRepository);

  return new CreateLogController(createLogUseCase);
};

export const makeGetLogByDeliveryIdController = () => {
  const getLogByDeliveryIdRepository =
    new PostgresGetLogByDeliveryIdRepository();

  const getLogByDeliveryIdUseCase = new GetLogByDeliveryIdUseCase(
    getLogByDeliveryIdRepository,
  );

  return new GetLogByDeliveryIdController(getLogByDeliveryIdUseCase);
};

export const makeGetAllLogsController = () => {
  const getAllLogsRepository = new PostgresGetAllLogsRepository();

  const getAllLogsUseCase = new GetAllLogsUseCase(getAllLogsRepository);

  return new GetAllLogsController(getAllLogsUseCase);
};
