const express = require("express");
const cron = require("node-cron");
const app = express();
const cors = require("cors");
const { router } = require("./router/routes");
const { requestFlowService } = require("./service/requestFlowService");
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(router);

cron.schedule("0 8 * * *", () => {
  console.log("Executando tarefa às 8:00");
  requestFlowService();
});

cron.schedule("0 12 * * *", () => {
  console.log("Executando tarefa às 12:00");
  requestFlowService();
});

cron.schedule("0 20 * * *", () => {
  console.log("Executando tarefa às 20:00");
});

app.listen(port, () => console.log(`Servidor na porta: ${port}!`));
