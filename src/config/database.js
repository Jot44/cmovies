const env = require("./env.js");

console.log(`Iniciando o servidor na porta ${env.port}`);
console.log(
  `Conectando no banco: ${env.db.database} com o usuário ${env.db.user}`,
);
