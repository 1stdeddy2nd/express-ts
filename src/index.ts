import express from "express";
import userRoute from "./routes/user";
import locationRoute from "./routes/location";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoute);
app.use("/locations", locationRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
