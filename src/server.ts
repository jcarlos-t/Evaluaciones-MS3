import app from "./app";
import { connectMongo } from "./db/mongo";
import { env } from "./config/env";

async function main() {
  try {
    await connectMongo();
    app.listen(env.PORT, () => {
      console.log(`[server] running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("[server] failed to start:", err);
    process.exit(1);
  }
}

main();

