import { isEmail } from 'validator'
import { prisma } from '../client';
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express';

interface UserRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


interface UpdateUserRequestBody {
    userId: string;
    // firstName: string;
    // lastName: string;
    // email: string;
    password: string;
}

interface DeleteUserRequestBody {
    userId: string;
}

class UserController {
    store = async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
        try {
            const { firstName, lastName, email, password } = req.body // Pega os dados enviados no body da requisição

            // Validar firstName, lastName, email e password
            const formErrorMsg: string[] = [];

            if (firstName.length < 2 || firstName.length > 15) formErrorMsg.push('Campo NOME precisa ter entre 2 e 15 caracteres')
            if (lastName.length < 2 || lastName.length > 15) formErrorMsg.push('Campo SOBRENOME precisa ter entre 2 e 15 caracteres')
            if (!isEmail(email)) formErrorMsg.push('Email inválido')
            if (password.length < 6 || password.length > 20) formErrorMsg.push('Campo Senha precisa ter entre 6 e 20 caracteres')

            if (formErrorMsg.length > 0) {
                res.status(400).json({
                    errors: formErrorMsg
                })

                return;
            }

            // Verificar se o email já existe na base de dados
            const emailExists = await prisma.user.findUnique({ where: { email: email } }) // Prisma vai acessar o model(tabela) "user" e vai procurar se existe nessa tabela algum usuário com o mesmo email enviado na requisição

            if (emailExists) formErrorMsg.push('Esse EMAIL já está em uso');

            if (formErrorMsg.length > 0) { // Se houver algum erro, esse IF será TRUE
                res.status(400).json({ // return terminará aqui a function mostrando a msg de erro
                    errors: formErrorMsg,
                });

                return
            }

            // Criptografar password
            const passwordHash = await bcrypt.hash(password, 8); // passwordHash ira receber o password  no formato "decodificado". Não utilize um valor de salt tão alto pra n gastar muito poder de processamento do servidor, prefira entre 8 e 10

            // Criar o usuário
            const user = await prisma.user.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: passwordHash
                }
            });

            res.json(user);
            return
        } catch (error) {
            res.status(500).json({
                error: error
            });

            return
        }
    };

    showAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await prisma.user.findMany({ select: { id: true, firstName: true, lastName: true, email: true } })

            if (users.length === 0) {
                res.json({
                    Aviso: ['Não existe nenhum usuário salvo na base de dados'],
                });

                return;
            }

            res.json(users);
            return;
        } catch (error) {
            res.status(500).json({
                error: error,
            });

            return
        }
    };

    showOne = async (req: Request, res: Response): Promise<void> => {
        try {
            const id: string = req.params.id; // Pega o id enviado no parâmetro da requisição

            // Verificar se o usuário existe
            const user = await prisma.user.findUnique({
                where: { id: id },
                select: {
                    id: true, firstName: true, lastName: true, email: true,
                },
            });

            if (!user) {
                res.status(400).json({
                    error: ['Usuário não existe'],
                });

                return
            }

            res.json(user);
            return;
        } catch (error) {
            res.status(500).json({
                error: error,
            });

            return
        }
    };

    update = async (req: Request<{}, {}, UpdateUserRequestBody>, res: Response): Promise<void> => {
        try {
            const { userId,  password } = req.body; // Pega os dados que vieram no body da requisição  


            // Validar password
            const formErrorMsg: string[] = [];
        
            if (password.length < 6 || password.length > 20) formErrorMsg.push('Campo Senha precisa ter entre 6 e 20 caracteres')

            if (formErrorMsg.length > 0) {
                res.status(400).json({
                    errors: formErrorMsg
                })

                return;
            }

            // Verificar se o usuário existe
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true, firstName: true, lastName: true, email: true,
                },
            });

            if (!user) {
                res.status(400).json({
                    error: ['Usuário não existe'],
                });

                return
            }           

            // Criptografar password
            const passwordHash = await bcrypt.hash(password, 8); // passwordHash ira receber o password  no formato "decodificado". Não utilize um valor de salt tão alto pra n gastar muito poder de processamento do servidor, prefira entre 8 e 10

            // Atualizar usuario
            const updatedUser = await prisma.user.update({
                where: { id: userId }, data: {                   
                    password: passwordHash
                }
            })

            res.json(updatedUser);
            return;
        } catch (error) {
            res.status(500).json({
                error: error,
            });

            return
        }
    };

    delete = async (req: Request<{}, {}, DeleteUserRequestBody>, res: Response) => {
        try {
            const { userId } = req.body // Pega o userId enviado do middleware loginRequired

            // Verificar se o usuário existe
            const user = await prisma.user.findUnique({ where: { id: userId } })

            if (!user) {
                res.status(400).json({ error: 'Usuário não existe' })
                return
            }

            // Deletar usuário
            await prisma.user.delete({ where: { id: userId } })

            res.json(`Usuário de nome ${user.firstName} deletado`);
            return;
        } catch (error) {
            res.status(500).json({
                error: error,
            });

            return;
        }
    }
}

export const userController = new UserController();

