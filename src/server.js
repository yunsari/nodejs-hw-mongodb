import express from "express";
import pino from "pino-http";
import cors from "cors";

import env from "./utils/env.js";
import contactsRouter from "./routers/contacts.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import initMongoConnection from "./db/initMongoConnection.js";
import router from './routers/index.js';
import cookieParser from 'cookie-parser';

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const PORT = Number(process.env.PORT || 3000);
const swaggerDocument = YAML.load("./docs/openapi.yaml");

export const setupServer = async () => {
  await initMongoConnection();

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(router);

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
  );

  app.use("/contacts", contactsRouter);


  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;