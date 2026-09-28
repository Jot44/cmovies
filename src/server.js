const app = require("./app.js");
const env = require("./config/env.js");

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});
