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
  
  requestFlowService();
});

cron.schedule("0 10 * * *", () => {
  requestFlowService();
});

cron.schedule("0 12 * * *", () => {
  requestFlowService();
});

cron.schedule("34 12 * * *", () => {
  requestFlowService();
});

cron.schedule("0 14 * * *", () => {
  requestFlowService();
});

cron.schedule("0 16 * * *", () => {
  requestFlowService();

});


app.listen(port, () => console.log(`Servidor na porta: ${port}!`));
