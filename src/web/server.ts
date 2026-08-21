import express, {
    type Express,
    type Request,
    type Response,
} from "express";
import path from "node:path";

const app: Express = express();

const publicDirectory = path.join(
    process.cwd(),
    "src",
    "web",
    "public",
);

app.use(express.json());

app.use(
    express.static(publicDirectory),
);

app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        ok: true,
        service: "myctra-control-platform",
    });
});

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(
        path.join(
            publicDirectory,
            "index.html",
        ),
    );
});

export function createWebServer() {
    return app;
}

export function startWebServer(port = 3000) {
    return app.listen(
        port,
        "0.0.0.0",
        () => {
            console.log(
                `MYCTRA WEB SERVER: http://localhost:${port}`,
            );
        },
    );
}
