import todo from "./core.ts";
// Importa as funções do arquivo core.ts

const server = Bun.serve({
// Cria o servidor usando Bun

  port: 3000,
  // Define a porta do servidor

  routes: {
  // Define as rotas da aplicação

    "/": new Response(Bun.file("./public/index.html")),
    // Retorna o arquivo index.html na rota principal

    "/api/todo": {
    // Rota principal da lista de tarefas

      GET: async () => {
      // Método GET usado para buscar os itens

        const items = await todo.getItems()
        // Busca os itens salvos

        return Response.json(items)
        // Retorna os itens em JSON
      },

      POST: async (req) => {
      // Método POST usado para adicionar itens

        const data = await req.json() as any;
        // Lê os dados enviados na requisição

        const item = data.item || null;
        // Pega o item enviado

        if (!item)
          // Verifica se o item existe

          return Response.json('Por favor, forneça um item para adicionar.', { status: 400 });
          // Retorna erro caso não tenha item

        await todo.addItem(item);
        // Adiciona o item na lista

        return Response.json(data);
        // Retorna os dados enviados
      },
    },

    "/api/todo/:index": {
    // Rota usada para acessar um item específico pelo índice

      PUT: async (req) => {
      // Método PUT usado para atualizar itens

        const index = parseInt(req.params.index);
        // Converte o índice da URL para número

        if (isNaN(index))
          // Verifica se o índice é inválido

          return Response.json('Índice inválido. um número inteiro é esperado.', { status: 400 });
          // Retorna erro caso o índice seja inválido

        const data = await req.json() as any;
        // Lê os dados enviados

        const newItem = data.newItem || null;
        // Pega o novo item enviado

        if (!newItem)
          // Verifica se o novo item existe

          return Response.json('Por favor, forneça um novo item para atualizar.', { status: 400 });
          // Retorna erro caso não tenha novo item

        try {
          // Tenta atualizar o item

          await todo.updateItem(index, newItem);
          // Atualiza o item da lista

          return Response.json(`Item no índice ${index} atualizado para "${newItem}".`);
          // Retorna mensagem de sucesso

        } catch (error: any) {
          // Captura possíveis erros

          return Response.json(error.message, { status: 400 });
          // Retorna a mensagem do erro
        }
      },

      DELETE: async (req) => {
      // Método DELETE usado para remover itens

        const index = parseInt(req.params.index);
        // Converte o índice da URL para número

        if (isNaN(index))
          // Verifica se o índice é inválido

          return Response.json('Índice inválido.', { status: 400 });
          // Retorna erro caso o índice seja inválido

        try {
          // Tenta remover o item

          await todo.removeItem(index);
          // Remove o item da lista

          return Response.json(`Item no índice ${index} removido com sucesso.`);
          // Retorna mensagem de sucesso

        } catch (error: any) {
          // Captura possíveis erros

          return Response.json(error.message, { status: 400 });
          // Retorna a mensagem do erro
        }
      },
    },

    // EXEMPLO BÁSICO

    "/api/exemplo": {
    // Rota de exemplo

      GET: () => {
      // Método GET da rota exemplo

        return new Response(`Esse é o exemplo: ${Date.now()}`)
        // Retorna uma resposta com a data atual
      },

      POST: async (req) => {
      // Método POST da rota exemplo

        const data = await req.json() as any;
        // Lê os dados enviados

        data.recebidoEm = new Date().toLocaleDateString("pt-BR");
        // Adiciona a data atual aos dados

        return Response.json(data);
        // Retorna os dados atualizados
      },
    },

    "/api/exemplo/:id": {
    // Rota exemplo usando id

      PUT: async (req, params) => {
      // Método PUT da rota exemplo

        const { id } = req.params;
        // Pega o id da URL

        const data = await req.json() as any;
        // Lê os dados enviados

        data.id = id;
        // Adiciona o id nos dados

        data.recebidoEm = new Date().toLocaleDateString("pt-BR");
        // Adiciona a data atual

        return Response.json(data);
        // Retorna os dados atualizados
      },

      PATCH: async (req, params) => {
      // Método PATCH usado para atualização parcial

        const { id } = req.params;
        // Pega o id da URL

        const data = await req.json() as any;
        // Lê os dados enviados

        data.chavesAtualizadas = Object.keys(data);
        // Pega as chaves atualizadas do objeto

        data.id = id;
        // Adiciona o id aos dados

        data.atualizadoEm = new Date().toLocaleDateString("pt-BR");
        // Adiciona a data atual

        return Response.json(data);
        // Retorna os dados atualizados
      },

      DELETE: (req, params) => {
      // Método DELETE da rota exemplo

        const { id } = req.params;
        // Pega o id da URL

        return new Response(`Recurso com id ${id} deletado`, { status: 200 });
        // Retorna mensagem confirmando exclusão
      }
    }
    // FIM DO EXEMPLO BÁSICO
  },

  async fetch(req) {
  // Executa quando nenhuma rota é encontrada

    return new Response(`Not Found`, { status: 404 });
    // Retorna erro 404
  },
});

console.log(`Server running at http://localhost:${server.port}`);
// Mostra no console a URL do servidor