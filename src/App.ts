import express, { Router } from "express";
import { Express } from "express-serve-static-core";
import dotEnv from "dotenv";
import session from "express-session";

const AppRouter: Router = require("./AppRouter")

export class App {
    public static INSTANCE: App;
    

    public client: Express = express();

    constructor() {
        dotEnv.config();
        this.setupExpress();
    }

    public start() {
        this.client.listen(this.getPort(), () => console.log(`[StationScreen] App has started on port: ${this.getPort()}`));
    }

    private setupExpress() {
        this.client.set("port", process.env.PORT || 3000);
        this.client.set("view engine", "ejs");

        this.client.use(express.static("public"));
        this.client.use(express.urlencoded({ extended: true }));  
        this.client.use(session({
            secret: "test",
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
        }));
        this.client.use(AppRouter);
        // reload app every 30 seconds
        setInterval(() => {
            process.exit(0);
        }, 30000);
    }

    public getPort(): number {
        return this.client.get("port");
    }

    public static createInstance(): App {
        if (!App.INSTANCE) App.INSTANCE = new App();
        return App.INSTANCE;
    }
}