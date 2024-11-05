import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { prisma } from "../client";

export const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers // Pega o authorization enviado no headers da requisição que é 'Bearer token'

    if (!authorization) {
        res.status(400).json({
            error: ['Login required'],
        });

        return
    }

    const [text, token] = authorization.split(' '); // Separa o 'Bearer' do 'token'

    try {
        // Decodificar o token
        const data = jwt.verify(token, process.env.TOKEN_SECRET as string) as jwt.JwtPayload; // Usa o TOKEN_SECRET para pegar uma versão decodificada do token, permitindo assim acessar o id e email do usuário passados pro token na hora da sua criação

        // Pegar os dados do usuário contidos no token      
        const id: string = data.id;

        // Verificar se existe algum usuário com o mesmo id contido no token
        const user = await prisma.user.findUnique({ where: { id: id} })

        if (!user) {
            res.status(400).json({
                error: ['Token inválido'],
            });

            return
        }

        // Enviar os dados para a função que vai ser executada dps do middleware        
        req.body.userId = id

        next(); // Responsável por permitir que a função que vem dps da middleware seja executada
        return
    } catch (error) {
        res.status(500).json({
            error: error,
        });

        return
    }

}