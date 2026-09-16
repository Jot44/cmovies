const repo = require("./title.repository.js");
const AppError = require("../../shared/errors/AppError");

function validar(dados) {
  if (!dados.name || typeof dados.name !== "string") {
    throw new AppError("Título é obrigatório", 400);
  }

  if (!["movie", "series"].includes(dados.type)) {
    throw new AppError("Tipo inválido", 400);
  }

  if (dados.genre !== undefined && typeof dados.genre !== "string") {
    throw new AppError("Gênero deve ser uma string", 400);
  }

  const anoAtual = new Date().getFullYear();
  if (
    dados.release_year !== undefined &&
    (dados.release_year < 1888 || dados.release_year > anoAtual + 1)
  ) {
    throw new AppError("Ano de lançamento fora do intervalo permitido", 400);
  }

  if (dados.rating !== undefined && (dados.rating < 0 || dados.rating > 10)) {
    throw new AppError("Nota fora do intervalo permitido", 400);
  }
  if (
    dados.status !== undefined &&
    !["want_to_watch", "watched"].includes(dados.status)
  ) {
    throw new AppError("Status inválido", 400);
  }
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
  await findById(id);
  validar(dados);
  return repo.update(id, dados);
}

async function remove(id) {
  await findById(id);
  return repo.remove(id);
}

module.exports = { create, findAll, findById, update, remove };
