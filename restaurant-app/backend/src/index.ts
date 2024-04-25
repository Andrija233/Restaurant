import express, { Request, Response} from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import UserRouter from "./routes/UserRouter";

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING as string)
.then(() =>
    console.log("DB Connected")
);


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/my/user", UserRouter);

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
