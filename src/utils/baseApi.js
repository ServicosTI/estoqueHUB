require("dotenv").config();
const axios = require("axios");
const TOKEN_FLOW = process.env.TOKEN_FLOW;
const TOKEN_HUBSPOT = process.env.TOKEN_HUBSPOT;

// console.log("TOKEN", TOKEN_FLOW)
const baseApi = axios.create({
  baseURL: "https://api.hubapi.com/",
  headers: {
    Authorization: `Bearer ${TOKEN_HUBSPOT}`,
    "Content-Type": "application/json",
  },
});

const baseApiFlow = axios.create({
  baseURL: "https://api.flow2.com.br/v1",
  headers: {
    Authorization: `Bearer ${TOKEN_FLOW}`,
    "Content-Type": "application/json",
  },
});

module.exports = { baseApi, baseApiFlow };
