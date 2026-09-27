import app from "./app/app.js";
import config from "./config/config.js";
import connectDB from "./config/db.js";

await connectDB();

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running successfully on port ${PORT} 🌐`);
});
