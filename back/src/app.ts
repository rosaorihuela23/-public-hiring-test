import * as express from "express";
import { json, urlencoded } from "express";

import { RegisterRoutes } from "../build/routes";
import { GreenlyDataSource } from "../config/dataSource";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

// Initialize database connection before registering routes
export const initializeApp = async () => {
  await GreenlyDataSource.getInstance();
  RegisterRoutes(app);
  return app;
};
