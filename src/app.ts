import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import env, { envSchema } from "./config/env.config";
import { Logger } from "./services/logger.service";
import Container from "typedi";
import cors from "cors";
import { dbConnection } from "./config/db.config";
import ErrorHandlerMiddleware from "./middlewares/error-handler.middleware";
import { getRouters } from "./utils/getRouters";
import { applyGraphQLMiddleware } from "./graphql/graphQl.server";

class App {
  private app!: Application;
  private logger: Logger = Container.get(Logger);

  public corsOptions: cors.CorsOptions = {
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  };

  private constructor() {}

  public static async init(): Promise<App> {
    const appInstance = new App();
    appInstance.validateEnv();
    appInstance.app = express();
    await appInstance.initializeMiddlewares();
    await dbConnection();
    await appInstance.initializeRoutes();
    appInstance.errorHandler();
    return appInstance;
  }

  private validateEnv() {
    const { error } = envSchema.validate(env);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }

  private async initializeMiddlewares() {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Test route
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "Hello World!" });
    });


    await applyGraphQLMiddleware(this.app as any);
  }

  private async initializeRoutes() {
    const routers = await getRouters();
    for (const router of routers) {
      this.app.use("/api", router);
    }
  }

  private errorHandler() {
    this.app.use(ErrorHandlerMiddleware);
  }

  public getExpressInstance(): Application {
    return this.app;
  }
}

export default App;
