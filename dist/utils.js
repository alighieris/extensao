function utils_formatDate(date) {
    return Utilities.formatDate(date, "GMT-3", "dd-MM-yyyy");
}
 function utils_calcularIdade(dataNascimento) {
    var hoje = new Date();
    var partes = dataNascimento.split("-");
    // dd-MM-yyyy
    var nascimento = new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
    var idade = hoje.getFullYear() - nascimento.getFullYear();
    var m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}
 function utils_validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
        return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11)
        resto = 0;
    if (resto !== parseInt(cpf.charAt(9)))
        return false;
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11)
        resto = 0;
    if (resto !== parseInt(cpf.charAt(10)))
        return false;
    return true;
}
 function validaCPFExistente(cpf, database = getDataBase()) {
    const pessoas = tableToObject("fPessoa", database);
    cpf = formatarCPF(cpf);
    return pessoas.some((p) => p.cpf === cpf);
}
 function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
 function createAlert(message) {
    SpreadsheetApp.getUi().alert(message);
}
 function formatarCPF(cpf) {
    let str = String(cpf).replace(/\D/g, "");
    str = str.padStart(11, "0");
    return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
 function validaProjetoJaCadastratado(nomeProjeto, database = getDataBase()) {
    const projetos = tableToObject("dProjeto", database);
    return projetos.some((p) => p.nome_projeto === nomeProjeto);
}
 function geraIdNovoProjeto(database = getDataBase()) {
    const projetos = tableToObject("dProjeto", database);
    if (projetos.length === 0) {
        return 1;
    }
    const ids = projetos.map((p) => p.id);
    return Math.max(...ids) + 1;
}
