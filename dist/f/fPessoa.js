 function createPessoa(pessoa) {
    const database = getDataBase();
    if (utils_validarCPF(pessoa.cpf)) {
        if (!validaCPFExistente(pessoa.cpf, database)) {
            try {
                getSheet("fPessoa", database).appendRow(pessoaAsList(pessoa));
                return { status: 0, msg: 'Pessoa cadastrada com sucesso' };
            }
            catch (e) {
                console.error("Erro ao adicionar pessoa: " + e);
                return { status: 1, msg: 'Erro ao adicionar pessoa' };
            }
        }
        else {
            return { status: 2, msg: 'CPF já cadastrado' };
        }
    }
    else {
        return { status: 2, msg: 'CPF inválido' };
    }
}
function pessoaAsList(pessoa) {
    return [
        pessoa.cpf,
        pessoa.chefe_familia,
        pessoa.cpf_chefe_familia,
        pessoa.id_parentesco,
        pessoa.rg,
        pessoa.nome,
        pessoa.nome_social,
        pessoa.data_nascimento,
        pessoa.sexo,
        pessoa.telefone,
        pessoa.nome_mae,
        pessoa.naturalidade,
        pessoa.id_cor,
        pessoa.id_escolaridade,
        pessoa.profissao,
        pessoa.renda,
        pessoa.estado_civil,
        pessoa.observacao,
        pessoa.ativo
    ];
}
 function recoverPessoa(cpf, database = getDataBase()) {
    const pessoas = tableToObject("fPessoa", database);
    const pessoa = pessoas.find((p) => p.cpf === cpf);
    return pessoa || null;
}
 function recoverPessoasFamilia(cpf, database = getDataBase()) {
    const pessoas = tableToObject("fPessoa", database);
    const pessoa = pessoas.find((p) => p.cpf === cpf);
    let chefe;
    if (pessoa && pessoa.chefe_familia) {
        chefe = pessoa;
    }
    else if (pessoa) {
        chefe = pessoas.find((p) => p.cpf === pessoa.cpf_chefe_familia);
    }
    else {
        return [];
    }
    return pessoas.filter((p) => p.cpf_chefe_familia === chefe.cpf);
}
 function updatePessoa(cpf, updatedPessoa, database = getDataBase()) {
    const sheet = getSheet("fPessoa", database);
    const pessoas = tableToObject("fPessoa", database);
    const rowIndex = pessoas.findIndex((p) => p.cpf === cpf);
    if (rowIndex === -1) {
        return { status: 3, msg: 'Pessoa não encontrada' };
    }
    const headers = sheet.getDataRange().getValues()[0];
    try {
        sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([pessoaAsList({ ...pessoas[rowIndex], ...updatedPessoa })]);
        return { status: 0, msg: 'Pessoa atualizada com sucesso' };
    }
    catch (e) {
        console.error("Erro ao atualizar pessoa: " + e);
        return {
            status: 1, msg: 'Erro ao atualizar pessoa'
        };
    }
}
 function deletePessoa(cpf) {
    const database = getDataBase();
    const sheet = getSheet("fPessoa", database);
    const pessoas = tableToObject("fPessoa", database);
    const rowIndex = pessoas.findIndex((p) => p.cpf === cpf);
    if (rowIndex === -1) {
        return { status: 3, msg: 'Pessoa não encontrada' };
    }
    try {
        sheet.deleteRow(rowIndex + 2); // +2 para ajustar ao índice da planilha (1-based e cabeçalho)
        return { status: 0, msg: 'Pessoa deletada com sucesso' };
    }
    catch (e) {
        console.error("Erro ao deletar Pessoa: " + e);
        return { status: 1, msg: 'Erro ao deletar Pessoa' };
    }
}
