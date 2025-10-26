function listarPessoasComFiltro() {
  this.limparListaRelatorio();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Relatório Pessoas");
  var fpessoa = utils_tableToObject("fpessoa");
  var filtro_sexo = sheet.getRange("B2").getValue();
  var filtro_chefe = sheet.getRange("B3").getValue();
  var filtro_idade_menor = sheet.getRange("B4").getValue();
  var filtro_idade_maior = sheet.getRange("D4").getValue();
  for (p of fpessoa) {
    p["idade"] = utils_calcularIdade(p.data_nascimento);
  }
  var lista_resultado = fpessoa.filter((p) => {
    var valid = true;
    if (filtro_sexo !== "") {
      valid = valid && p.sexo === filtro_sexo;
    }
    if (filtro_chefe !== "") {
      valid = valid && p.chefe_familia === (filtro_chefe === "Sim");
    }
    if (valid && (filtro_idade_menor !== "" || filtro_idade_maior !== "")) {
      if (filtro_idade_menor !== "") {
        valid = valid && p.idade >= Number(filtro_idade_menor);
      }
      if (filtro_idade_maior !== "") {
        valid = valid && p.idade <= Number(filtro_idade_maior);
      }
    }
    return valid;
  });
  for (var i = 0; i < lista_resultado.length; i++) {
    var linha = 10 + i;
    sheet.getRange("A" + linha).setValue(lista_resultado[i].nome);
    sheet.getRange("D" + linha).setValue(lista_resultado[i].cpf);
  }
}
function limparListaRelatorio() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Relatório Pessoas");
  sheet.getRange("A10:J").clear();
}
