import express, {Request, Response} from "express";
import cors from 'cors';
import "dotenv/config";
import { routes } from "./routes/indexRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes)

app.listen(3000, () => {
    console.log("Server started on localhost:3000")
})