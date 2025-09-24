import app from "./app";
import { env } from "./config/env";
import { connectMongo } from "./db/mongo";

async function main() {
  await connectMongo();
  const server = app.listen(env.PORT, () => {
    console.log(`[ms3] listening on :${env.PORT}`);
  });

  const shutdown = () => {
    console.log("Shutting down...");
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

