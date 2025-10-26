 function createEndereco(endereco, database = getDataBase()) {
    try {
        database.getSheetByName("fEndereco")?.appendRow(enderecoAsList(endereco));
    }
    catch (e) {
        console.error("Erro ao adicionar endereço: " + e);
    }
}
function enderecoAsList(endereco) {
    return [
        endereco.cpf_chefe_familia,
        endereco.cidade,
        endereco.bairro,
        endereco.logradouro,
        endereco.referencia,
        endereco.cep
    ];
}
 function recoverEndereco(cpf_chefe_familia, database = getDataBase()) {
    const enderecos = tableToObject("fEndereco", database);
    const endereco = enderecos.find((e) => e.cpf_chefe_familia === cpf_chefe_familia);
    return endereco || null;
}
 function updateEndereco(cpf_chefe_familia, updatedEndereco, database = getDataBase()) {
    const sheet = getSheet("fEndereco", database);
    const enderecos = tableToObject("fEndereco", database);
    const rowIndex = enderecos.findIndex((e) => e.cpf_chefe_familia === cpf_chefe_familia);
    if (rowIndex === -1) {
        return { status: 3, msg: 'Endereço não encontrado' };
    }
    const headers = sheet.getDataRange().getValues()[0];
    try {
        sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([enderecoAsList({ ...enderecos[rowIndex], ...updatedEndereco })]);
        return { status: 0, msg: 'Endereço atualizado com sucesso' };
    }
    catch (e) {
        console.error("Erro ao atualizar endereço: " + e);
        return { status: 1, msg: 'Erro ao atualizar endereço' };
    }
}
 function deleteEndereco(cpf_chefe_familia, database = getDataBase()) {
    const sheet = getSheet("fEndereco", database);
    const enderecos = tableToObject("fEndereco", database);
    const rowIndex = enderecos.findIndex((e) => e.cpf_chefe_familia === cpf_chefe_familia);
    if (rowIndex === -1) {
        return 'Endereço não encontrado';
    }
    try {
        sheet.deleteRow(rowIndex + 2); // +2 para ajustar ao índice da planilha (1-based e cabeçalho)
        return 'Endereço deletado com sucesso';
    }
    catch (e) {
        console.error("Erro ao deletar endereço: " + e);
        return 'Erro ao deletar endereço';
    }
}
