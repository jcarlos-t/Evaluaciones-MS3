import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { requestId } from "./middlewares/requestId";
import { errorHandler } from "./middlewares/error";

const app = express();

app.use(requestId);
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(":method :url :status - rid=:req[x-request-id] - :response-time ms"));

app.use("/", routes);
app.use(errorHandler);

export default app;

