import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { tokenRoutes } from "./tokenRoutes";
import { orderRoutes } from "./orderRoutes";

export const routes = Router();

routes.use('/users', userRoutes) // Se na URL da requisição houver '/users', será usado as rotas de userRoutes
routes.use('/tokens', tokenRoutes) // Se na URL da requisição houver '/tokens', será usado as rotas de tokenRoutes
routes.use('/orders', orderRoutes) // Se na URL da requisição houver '/order', será usado as rotas de orderRoutes