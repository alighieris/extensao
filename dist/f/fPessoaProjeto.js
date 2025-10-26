 function createPessoaProjeto(pessoaProjeto, database = getDataBase()) {
    try {
        database.getSheetByName("fPessoaProjeto")?.appendRow(pessoaProjetoAsList(pessoaProjeto));
    }
    catch (e) {
        console.error("Erro ao criar pessoaProjeto: " + e);
    }
}
function pessoaProjetoAsList(pessoaProjeto) {
    return [
        pessoaProjeto.cpf,
        pessoaProjeto.id_projeto,
        pessoaProjeto.data_inicio,
        pessoaProjeto.data_fim,
        pessoaProjeto.ativo
    ];
}
 function recoverPessoaProjeto(cpf_pessoa, database = getDataBase()) {
    const pessoasProjetos = tableToObject("fPessoaProjeto", database);
    const pessoaProjeto = pessoasProjetos.find((pp) => pp.cpf === cpf_pessoa);
    return pessoaProjeto || null;
}
 function updatePessoaProjeto(cpf_pessoa, updatedPessoaProjeto, database = getDataBase()) {
    const sheet = getSheet("fPessoaProjeto", database);
    const pessoasProjetos = tableToObject("fPessoaProjeto", database);
    const rowIndex = pessoasProjetos.findIndex((pp) => pp.cpf === cpf_pessoa && pp.id_projeto === updatedPessoaProjeto.id_projeto);
    if (rowIndex === -1) {
        return { status: 3, msg: 'Registro não encontrado' };
    }
    const headers = sheet.getDataRange().getValues()[0];
    try {
        sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([pessoaProjetoAsList({ ...pessoasProjetos[rowIndex], ...updatedPessoaProjeto })]);
        return { status: 0, msg: 'Registro atualizado com sucesso' };
    }
    catch (e) {
        console.error("Erro ao atualizar pessoaProjeto: " + e);
        return { status: 1, msg: 'Erro ao atualizar pessoaProjeto' };
    }
}
