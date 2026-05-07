const jsonFilePath = __dirname + '/data.temp.json';
// Define o caminho absoluto do arquivo JSON usado para armazenar os dados

const list: string[] = await loadFromFile();
// Inicializa a lista carregando os itens existentes do arquivo

async function loadFromFile() {
// Função assíncrona responsável por ler os dados do arquivo JSON

  try {
    // Tenta executar a leitura do arquivo

    const file = Bun.file(jsonFilePath);
    // Cria uma referência para o arquivo usando a API do Bun

    const content = await file.text();
    // Lê o conteúdo do arquivo como texto

    return JSON.parse(content) as string[];
    // Converte o texto JSON em array de strings e retorna os dados

  } catch (error: any) {
    // Captura erros que acontecerem durante a leitura

    if (error.code === 'ENOENT')
      // Verifica se o erro aconteceu porque o arquivo não existe

      return [];
      // Retorna uma lista vazia caso o arquivo ainda não exista

      throw error;
      // Relança outros erros encontrados
  }
}

async function saveToFile() {
// Função assíncrona responsável por salvar os dados no arquivo JSON

  try {
    // Tenta salvar os dados no arquivo

    await Bun.write(jsonFilePath, JSON.stringify(list));
    // Converte a lista em JSON e escreve no arquivo

  } catch (error: any) {
    // Captura erros que acontecerem durante a gravação

    throw new Error("Erro ao salvar os dados no arquivo: " + error.message);
    // Lança um erro personalizado caso aconteça algum problema
  }
}

async function addItem(item: string) {
// Função responsável por adicionar um novo item na lista

  list.push(item);
  // Adiciona o item recebido no final do array

  await saveToFile();
  // Salva a lista atualizada no arquivo
}

async function getItems() {
// Função responsável por retornar os itens da lista

  return list;
  // Retorna o array completo
}

async function updateItem(index: number, newItem: string) {
// Função responsável por atualizar um item existente da lista

  if (index < 0 || index >= list.length)
    // Verifica se o índice informado é inválido

    throw new Error("Index fora dos limites");
    // Lança um erro caso o índice seja inválido

  list[index] = newItem;
  // Substitui o item antigo pelo novo valor informado

  await saveToFile();
  // Salva as alterações feitas no arquivo
}

async function removeItem(index: number) {
// Função responsável por remover um item da lista

  if (index < 0 || index >= list.length)
    // Verifica se o índice informado é inválido

    throw new Error("Index fora dos limites");
    // Lança um erro caso o índice seja inválido

  list.splice(index, 1);
  // Remove um item do array na posição informada

  await saveToFile();
  // Salva a lista atualizada no arquivo
}

export default { addItem, getItems, updateItem, removeItem };
// Exporta as funções principais para serem usadas em outros arquivos