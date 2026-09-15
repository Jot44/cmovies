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
