import express from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import { Database } from "./config/Database.js";
import UserRoutes from "./routes/user_routes.js";
import DistanceRoutes from "./routes/distance_route.js";
import LeadRoutes from "./routes/lead_route.js";
import OrderRoutes from "./routes/order_routes.js";
import DriverRoutes from "./routes/driver_routes.js";
import RideRoutes from "./routes/rides_route.js";
import RatingRoutes from "./routes/rating_route.js";
import TokenRoutes from "./routes/token_route.js"
import AdminRoutes from "./routes/admin_routes.js";
import VicheleRoutes from "./routes/vichele_routes.js"
import SyrexRoutes from "./routes/syrex.js"

config({path:"./config/.env"});
const app  = express();


app.use(cors("*"));
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

Database();


app.use("/api/v1",UserRoutes);
app.use("/api/v1",DistanceRoutes);
app.use("/api/v1",OrderRoutes);
app.use("/api/v1",LeadRoutes);
app.use("/api/v1",DriverRoutes);
app.use("/api/v1",RideRoutes);
app.use("/api/v1",RatingRoutes);
app.use("/api/v1",TokenRoutes);
app.use("/api/v1",AdminRoutes);
app.use("/api/v1",VicheleRoutes);
app.use("/api/v1",SyrexRoutes);


app.get("/",(req,res)=>{
   res.status(200).json({msg:"ok"})
})



app.listen(process.env.PORT,()=>{
    console.log(`Server is runnin on PORT no ${process.env.PORT}`)
})