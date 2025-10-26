"use strict";
function getDataBase() {
    const ss = SpreadsheetApp.openById("1No7aGxIjDCKQa-QEdEPs2reeDXW1DRjpUk36u4Alp0U");
    return ss;
}
function getSheet(sheetName, database = getDataBase()) {
    return database.getSheetByName(sheetName);
}
function tableToObject(tableName, database = getDataBase()) {
    const sheet = getSheet(tableName, database);
    const dados = sheet.getDataRange().getValues();
    const colunas = dados[0];
    const lista = [];
    for (var i = 1; i < dados.length; i++) {
        let obj = {};
        for (var j = 0; j < colunas.length; j++) {
            obj[colunas[j]] = dados[i][j];
        }
        lista.push(obj);
    }
    return lista;
}
