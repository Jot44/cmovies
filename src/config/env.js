require("dotenv").config();

function checkEnv(nome) {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável de ambiente ${nome} não foi definida`);
  }
  return valor;
}

const env = {
  port: checkEnv("PORT"),
  db: {
    host: checkEnv("DB_HOST"),
    port: checkEnv("DB_PORT"),
    user: checkEnv("DB_USER"),
    password: checkEnv("DB_PASSWORD"),
    database: checkEnv("DB_NAME"),
  },
};

module.exports = env;
