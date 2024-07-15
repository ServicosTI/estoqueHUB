const { baseApiFlow, baseApi } = require("../utils/baseApi");

const requestFlowService = async () => {
  console.log("Executou no horario correto");
  let allProducts = [];

  // Obtendo os grupos de produtos
  let productsGroups = await baseApiFlow
    .get("/produtos/obterGruposProduto/")
    .then((response) => response.data);
  // console.log(productsGroups.length, "Grupos");

  // Primeira página de produtos
  let initialResponse = await baseApiFlow.get(
    "/produtos?Ativo=true&pageSize=1000"
  );
  let { itens, totalPages } = initialResponse.data;
  allProducts.push(...itens);

  // Função para obter as páginas adicionais de produtos
  const fetchProductsPage = async (pageIndex) => {
    let response = await baseApiFlow.get(
      `/produtos?Ativo=true&pageSize=1000&PageIndex=${pageIndex}`
    );
    return response.data.itens;
  };

  // Obtendo todas as páginas adicionais em paralelo
  let additionalPagesPromises = [];
  for (let i = 2; i <= totalPages; i++) {
    additionalPagesPromises.push(fetchProductsPage(i));
  }
  let additionalPages = await Promise.all(additionalPagesPromises);
  additionalPages.forEach((pageItems) => {
    allProducts.push(...pageItems);
  });

  // Contagem de produtos por grupo
  productsGroups.forEach((group) => {
    group.quantity = 0;
    group.fabricante = "Não Informado";
    group.modelo = "Não Informado";
    allProducts.forEach((product) => {
      if (
        product.gruposProduto.length > 0 &&
        group.id === product.gruposProduto[0].id
      ) {
        group.quantity += product.saldoEstoquesFiscais[0].saldo;
        if (product.fabricante !== null) {
          group.fabricante = product.fabricante.nome;
        }
        if (product.modelo !== null) {
          group.modelo = product.modelo;
        }
      }
    });
  });

  // console.log(productsGroups.length)
  // return productsGroups;
  for (const {
    id,
    nome,
    tipoNome,
    idTipoGrupoProduto,
    quantity,
    fabricante,
    modelo,
  } of productsGroups) {
    const dataCreateProducts = {
      properties: {
        hs_price_brl: 0,
        hs_sku: nome,
        name: nome,
        description: tipoNome,
        fabricante,
        quantidade: quantity,
        tipo_de_produto: tipoNome,
        id_tipo_grupo_de_produto: id,
        modelo_texto: modelo,
      },
    };
    console.log(dataCreateProducts);

    const responseProducts = await baseApi
      .post("crm/v3/objects/products", dataCreateProducts)
      .then((response) => {
        console.log("Produto Criado com Sucesso!", response.data);
        return response.data;
      })
      .catch((erro) => erro.response.data.message);
    console.log("Log ", responseProducts);

    if (responseProducts.includes("already has that value.")) {
      const regex = /(\d+)\s+already has that value\./;
      const match = responseProducts.match(regex);
      const productId = match[1];
      await baseApi
        .patch(`crm/v3/objects/products/${productId}`, dataCreateProducts)
        .then((response) => {
          console.log("Produto Atualizado com Sucesso!", response.data);
          return response.data;
        })
        .catch((erro) => erro.response.message);
    }
  }

  return productsGroups;
};

module.exports = { requestFlowService };
