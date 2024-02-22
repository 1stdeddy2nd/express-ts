import express from "express";
import userRoute from "./routes/user";
import locationRoute from "./routes/location";

const app = express();

app.use(express.json());

app.use("/users", userRoute);
app.use("/locations", locationRoute);

export default app;
