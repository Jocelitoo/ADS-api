import { Router } from "express";
import { orderController } from "../controllers/OrderController";
import { loginRequired } from "../middlewares/loginRequired";

export const orderRoutes = Router();

orderRoutes.post('/', loginRequired, orderController.store);
orderRoutes.get('/', loginRequired, orderController.showAll);