import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db";
import appConfig from "./config/app-config";
import userRouter from "./users/user.router";
import { errorHandler, wrongPathHandler } from "./middleware/error-handler";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeAppLevelMiddlewares();
    this.initializeRoutes();
    this.initializeAppDependables();
  }

  private async initializeAppDependables() {
    await connectDB(appConfig.DATABASE_URL);
  }

  private initializeAppLevelMiddlewares() {
    this.app.use(morgan("dev"));
    this.app.use(cors({ origin: "*" }));
  }

  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.status(200).json("App is live!");
    });
    this.app.use("/users", userRouter);

    // last middlewares
    this.app.use(wrongPathHandler);
    this.app.use(errorHandler);
  }
}

const app = new App().app;

export default app;
