import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post('/usuarios', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o usuário' });
  }
});

// Endpoint para buscar múltiplos usuários com ou sem filtros
app.get('/usuarios', async (req, res) => {
  try {
    const filters = req.query; // Obtém os parâmetros de consulta da URL
    let users;

    if (Object.keys(filters).length > 0) {
      // Aplica filtros com base nos parâmetros fornecidos
      users = await prisma.user.findMany({
        where: {
          ...(filters.email && { email: filters.email }),
          ...(filters.name && { name: filters.name }),
          ...(filters.address && { address: filters.address }),
        },
      });
    } else {
      // Busca todos os usuários se nenhum filtro for fornecido
      users = await prisma.user.findMany();
    }

    res.status(200).json(users); // Retorna os usuários encontrados
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Endpoint PUT para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id, // Usando o ID da URL para localizar o usuário
      },
      data: {
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
      },
    });

    res.status(200).json(user); // Resposta de sucesso com o usuário atualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o usuário' });
  }
});

// Endpoint DELETE para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id, // Usando o ID da URL para localizar o usuário
      },
    });

    res.status(200).json({ message: 'Usuário deletado com sucesso' }); // Resposta de sucesso após a exclusão
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o usuário' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
