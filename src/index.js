import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: './.env' });

connectDB()
  .then(() => {
    try {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`✅ Listening on port ${PORT}`);
      });
    } catch (err) {
      console.error("❌ Error in app.listen:", err);
    }
  })
  .catch((err) => {
    console.error("❌ MONGO DB CONNECTION FAILED:", err);
  });