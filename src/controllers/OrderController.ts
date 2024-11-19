import { Request, Response } from "express";
import { prisma } from "../client";
import { connect } from "http2";

interface StoreOrderRequestBody {
  userId: string,
  productName: string,
  price: number,
  address: AddressProps,
  paymentMethod: string,
}

interface ShowAllOrderRequestBody {
  userId: string,
}

interface AddressProps {
  address: string,
  city: string,
  state: string,
}

class OrderController {
  store = async (req: Request<{}, {}, StoreOrderRequestBody>, res: Response) => {
    try {
      const { userId, productName, price, address, paymentMethod } = req.body; // Pegar os dados enviados no body da requisição

      // Verificar se o usuário logado existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.json('Usuário não existe').status(404);
        return;
      }

      // Criar o pedido na base de dados
      await prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          productName: productName,
          price: price,
          address: {
            address: address.address,
            city: address.city,
            state: address.state
          },
          paymentMethod: paymentMethod
        }
      })

      // Retornar uma resposta
      res.json('Pedido criado com sucesso');
      return
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return
    }
  }

  showAll = async (req: Request<{}, {}, ShowAllOrderRequestBody>, res: Response) => {
    try {
      const { userId } = req.body; // Pegar os dados enviados no body da requisição

      // Verificar se o usuário logado existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.json('Usuário não existe').status(404);
        return;
      }

      // Retornar todos os pedidos do usuário logado em ordem decrescente da data de criação
      const orders = await prisma.order.findMany({ where: { userId: userId }, orderBy: { createdAt: 'desc' } });

      if (orders.length === 0) {
        res.json('O usuário não possui nenhum pedido feito')
        return;
      }

      // Retornar uma resposta
      res.json(orders)

      return
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return
    }
  }
}

export const orderController = new OrderController();