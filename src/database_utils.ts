function getDataBase() {
  const ss = SpreadsheetApp.openById(
    "1No7aGxIjDCKQa-QEdEPs2reeDXW1DRjpUk36u4Alp0U"
  );
  return ss
}

type TableName = "fPessoa"
  | "fEndereco"
  | "fDomicilio"
  | "fPessoaBeneficio"
  | "fAtendimento"
  | "fPessoaVulnerabilidade"
  | "fPessoaProjeto"
  | "dEscolaridade"
  | "dCor"
  | "dBeneficio"
  | "dVulnerabilidade"
  | "dParentesco"
  | "dProjeto"

function getSheet(sheetName: string, database = getDataBase()) {
  return database.getSheetByName(sheetName) as GoogleAppsScript.Spreadsheet.Sheet;
}
function tableToObject<T>(tableName: TableName, database = getDataBase()) {
  const sheet = getSheet(tableName, database);
  const dados = sheet.getDataRange().getValues();
  const colunas: (keyof T)[] = dados[0];
  const lista: T[] = [];

  for (var i = 1; i < dados.length; i++) {
    let obj = {} as Record<string, any>;
    for (var j = 0; j < colunas.length; j++) {
      obj[colunas[j] as string] = dados[i][j];
    }
    lista.push(obj as T);
  }
  return lista;
}


