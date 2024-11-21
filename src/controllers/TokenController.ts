import { Request, Response } from "express";
import { isEmail } from "validator";
import { prisma } from "../client";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface TokenRequestBody {
    email: string,
    password: string,
}

class TokenController {
    create = async (req: Request<{}, {}, TokenRequestBody>, res: Response) => {
        try {
            const { email, password } = req.body; // Pega os dados enviados na requisição do body

            // Validar email e password
            const formErrorMsg = [];

            if (!isEmail(email)) formErrorMsg.push('Email inválido');
            if (password.length < 6 || password.length > 20) formErrorMsg.push('Campo SENHA precisa ter entre 6 e 20 caracteres');

            if (formErrorMsg.length > 0) {
                res.status(400).json({
                    error: formErrorMsg,
                });

                return;
            }

            // Verificar se existe algum usuário com o email enviado
            const user = await prisma.user.findUnique({ where: { email: email } }) // Pega o usuário que tenha o email com o mesmo valor de email

            if (!user) {
                res.status(400).json({
                    error: ['Email ou senha incorreto'], // Por segurança, é importante não especificarmos se é o email que está errado ou o password                                       
                });

                return;
            }

            // Verificar se o password está correto
            const validPassword = await bcryptjs.compare(password, user.password) // Compara o password enviado na requisição do body com o password do usuário salvo na base de dados

            if (!validPassword) {
                res.status(400).json({
                    error: ['Email ou senha incorreta'], // Por segurança, é importante não especificarmos se é o email que está errado ou o password
                });

                return;
            }

            // Gerar o token
            // Enviamos o user.id para que possamos identificar de qual usuário pertence o token através do id presente no token
            const token = jwt.sign({ id: user.id}, process.env.TOKEN_SECRET as string, {
                expiresIn: process.env.TOKEN_EXPIRATION,
            })

            res.json({
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            });

            return
        } catch (error) {
            res.status(500).json({
                error: error
            });

            return
        }
    }
}

export const tokenController = new TokenController();