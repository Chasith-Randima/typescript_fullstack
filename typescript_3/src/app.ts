import express,{Request,Response} from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { NextFunction } from "express-serve-static-core";



const app = express();


app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

app.use(cors());
app.options("*", cors());

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
}
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import orderRouter from "./routes/orderRoute";
import reviewRouter from "./routes/reviewRoute";


app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);



// module.exports = app;
export default app;