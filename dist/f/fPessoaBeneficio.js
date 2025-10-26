// Adiciona um ou mais registros de PessoaBeneficio
 function createPessoaBeneficio(pessoaBeneficios, database = getDataBase()) {
    const sheet = database.getSheetByName("fPessoaBeneficio");
    if (!sheet)
        return { status: 1, msg: "Sheet não encontrada" };
    try {
        const arr = Array.isArray(pessoaBeneficios)
            ? pessoaBeneficios
            : [pessoaBeneficios];
        arr.forEach((pb) => {
            sheet.appendRow(pessoaBeneficioAsList(pb));
        });
        return { status: 0, msg: "PessoaBeneficio(s) cadastrada(s) com sucesso" };
    }
    catch (e) {
        console.error("Erro ao adicionar PessoaBeneficio: " + e);
        return { status: 1, msg: "Erro ao adicionar PessoaBeneficio" };
    }
}
function pessoaBeneficioAsList(pb) {
    return [
        pb.cpf,
        pb.id_beneficio,
        pb.observacao_beneficio
    ];
}
// Recupera todos os registros de PessoaBeneficio para um cpf_pessoa
 function recoverPessoaBeneficio(cpf_pessoa, database = getDataBase()) {
    const lista = tableToObject("fPessoaBeneficio", database);
    return lista.filter((pb) => pb.cpf === cpf_pessoa);
}
// Atualiza todos os registros de PessoaBeneficio para um cpf_pessoa
 function updatePessoaBeneficio(cpf_pessoa, novos, database = getDataBase()) {
    const sheet = getSheet("fPessoaBeneficio", database);
    const lista = tableToObject("fPessoaBeneficio", database);
    // Remove todos os registros antigos desse cpf_pessoa
    let linhasRemover = [];
    lista.forEach((pb, idx) => {
        if (pb.cpf === cpf_pessoa) {
            linhasRemover.push(idx + 2); // +2 por causa do cabeçalho e 1-based
        }
    });
    try {
        // Remover de baixo para cima para não alterar os índices
        linhasRemover.sort((a, b) => b - a).forEach((linha) => sheet.deleteRow(linha));
        // Adiciona os novos
        novos.forEach((pb) => {
            sheet.appendRow(pessoaBeneficioAsList(pb));
        });
        return { status: 0, msg: "PessoaBeneficio(s) atualizada(s) com sucesso" };
    }
    catch (e) {
        console.error("Erro ao atualizar PessoaBeneficio: " + e);
        return { status: 1, msg: "Erro ao atualizar PessoaBeneficio" };
    }
}
// Remove todos os registros de PessoaBeneficio para um cpf_pessoa
 function deletePessoaBeneficio(cpf_pessoa, database = getDataBase()) {
    const sheet = getSheet("fPessoaBeneficio", database);
    const lista = tableToObject("fPessoaBeneficio", database);
    let linhasRemover = [];
    lista.forEach((pb, idx) => {
        if (pb.cpf === cpf_pessoa) {
            linhasRemover.push(idx + 2); // +2 por causa do cabeçalho e 1-based
        }
    });
    if (linhasRemover.length === 0) {
        return { status: 3, msg: "Nenhum registro encontrado para o CPF informado" };
    }
    try {
        linhasRemover.sort((a, b) => b - a).forEach((linha) => sheet.deleteRow(linha));
        return { status: 0, msg: "PessoaBeneficio(s) deletada(s) com sucesso" };
    }
    catch (e) {
        console.error("Erro ao deletar PessoaBeneficio: " + e);
        return { status: 1, msg: "Erro ao deletar PessoaBeneficio" };
    }
}
