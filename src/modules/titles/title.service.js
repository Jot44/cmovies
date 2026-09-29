const repo = require("./title.repository.js");
const AppError = require("../../shared/errors/AppError");

function validar(dados) {
  if (!dados.name || typeof dados.name !== "string") {
    throw new AppError("Título é obrigatório", 400);
  }

  if (dados.name.length > 100) {
    throw new AppError("O limite de caracteres é 100", 400);
  }

  if (!["movie", "series"].includes(dados.type)) {
    throw new AppError("Tipo inválido", 400);
  }

  if (dados.genre !== undefined && typeof dados.genre !== "string") {
    throw new AppError("Gênero deve ser uma string", 400);
  }

  if (dados.genre !== undefined && dados.genre.length > 50) {
    throw new AppError("O limite de caracteres é 50", 400);
  }

  const anoAtual = new Date().getFullYear();
  if (
    dados.release_year !== undefined &&
    (typeof dados.release_year !== "number" ||
      dados.release_year < 1888 ||
      dados.release_year > anoAtual + 1)
  ) {
    throw new AppError("Ano de lançamento fora do intervalo permitido", 400);
  }

  if (
    dados.rating !== undefined &&
    (typeof dados.rating !== "number" || dados.rating < 0 || dados.rating > 10)
  ) {
    throw new AppError("Nota fora do intervalo permitido", 400);
  }
  if (
    dados.status !== undefined &&
    !["want_to_watch", "watched"].includes(dados.status)
  ) {
    throw new AppError("Status inválido", 400);
  }
}

function limparNulos(objeto) {
  const entradas = Object.entries(objeto);

  const entradasLimpas = entradas.map(([chave, valor]) => {
    if (valor === null) {
      return [chave, undefined];
    }
    return [chave, valor];
  });

  return Object.fromEntries(entradasLimpas);
}

async function create(dados) {
  validar(dados);
  return repo.create(dados);
}

async function findAll() {
  return repo.findAll();
}

async function findById(id) {
  const item = await repo.findById(id);
  if (!item) {
    throw new AppError("Registro não encontrado", 404);
  }
  return item;
}

async function update(id, dados) {
  const item = await findById(id);
  const itemLimpo = limparNulos(item);
  const itensMesclados = { ...itemLimpo, ...dados };

  validar(itensMesclados);
  return repo.update(id, itensMesclados);
}

async function remove(id) {
  await findById(id);
  return repo.remove(id);
}

module.exports = { create, findAll, findById, update, remove };
