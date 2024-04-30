import express, { Request, Response} from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import UserRouter from "./routes/UserRouter";
import { v2 as cloudinary} from "cloudinary";
import RestaurantRoute from "./routes/RestaurantRoute";
import RestaurantsRoutes from "./routes/RestaurantsRoutes";
import orderRoute from "./routes/OrderRoute";

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING as string)
.then(() =>
    console.log("DB Connected")
);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async(req: Request, res: Response) => {
    res.send({message: "health OK!"});
})

app.use("/api/my/user", UserRouter);
app.use("/api/my/restaurant", RestaurantRoute);
app.use("/api/restaurant", RestaurantsRoutes);
app.use("/api/order", orderRoute);

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
