import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  const WS_PORT = process.env.WS_PORT || 8000;
  app.listen(PORT, () => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `⚙️  Server is running on port http://localhost:${PORT} ...`,
    );
    console.log(
      "\x1b[32m%s\x1b[0m",
      `🔌  WebSocket Server is running on port http://localhost:${WS_PORT} ...`,
    );
  });
});
