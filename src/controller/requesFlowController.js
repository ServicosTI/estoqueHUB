const { requestFlowService } = require("../service/requestFlowService");

const requestFlowController = async (req, res) => {
  try {
    const response = await requestFlowService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { requestFlowController };
