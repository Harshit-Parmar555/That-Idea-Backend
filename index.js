import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./src/utils/logger.js";

import { connectDb } from "./src/db/connect.js";

// Express app
const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Logger for api's ( Currently commented due to storage issue )
// const morganFormat = ":method :url :status :response-time ms";
// app.use(
//   morgan(morganFormat, {
//     stream: {
//       write: (message) => {
//         const logObject = {
//           method: message.split(" ")[0],
//           url: message.split(" ")[1],
//           status: message.split(" ")[2],
//           responseTime: message.split(" ")[3],
//         };
//         logger.info(JSON.stringify(logObject));
//       },
//     },
//   })
// );

// PORT
const PORT = process.env.PORT || 4000;

// App routes
import { userRouter } from "./src/routes/user.route.js";
import { ideaRouter } from "./src/routes/idea.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/ideas", ideaRouter);

// App started
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
