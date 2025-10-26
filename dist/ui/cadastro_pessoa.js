function abrirModalCadastro() {
    var html = HtmlService.createHtmlOutputFromFile("modal_cadastro")
        .setWidth(850)
        .setHeight(800);
    SpreadsheetApp.getUi().showModalDialog(html, "Cadastro de Pessoa");
}
function utils_formatDate(arg0) {
    throw new Error("Function not implemented.");
}
function getVulnerabilidades() {
    return tableToObject("dVulnerabilidade");
}
function getBeneficios() {
    return tableToObject("dBeneficio");
}
function salvarCadastroPessoa(dados) {
    // Aqui você pode chamar funções para salvar cada entidade no banco de dados
    // Exemplo:
    try {
        createPessoa(dados.pessoa);
        if (dados.endereco)
            createEndereco(dados.endereco);
        if (dados.domicilio)
            createDomicilio(dados.domicilio);
        if (dados.vulnerabilidades && dados.vulnerabilidades.length > 0) {
            createPessoaVulnerabilidade(dados.vulnerabilidades);
        }
        if (dados.beneficios && dados.beneficios.length > 0) {
            createPessoaBeneficio(dados.beneficios);
        }
        return { status: 0, msg: "Cadastro salvo com sucesso!" };
    }
    catch (e) {
        deletePessoa(dados.pessoa.cpf);
        if (dados.endereco)
            deleteEndereco(dados.pessoa.cpf);
        if (dados.domicilio)
            deleteDomicilio(dados.pessoa.cpf);
        if (dados.vulnerabilidades && dados.vulnerabilidades.length > 0) {
            deletePessoaVulnerabilidade(dados.pessoa.cpf);
        }
        if (dados.beneficios && dados.beneficios.length > 0) {
            deletePessoaBeneficio(dados.pessoa.cpf);
        }
        console.error("Erro ao salvar cadastro: " + e);
        return { status: 1, msg: "Erro ao salvar cadastro." };
    }
}
function editarPessoa() {
    const cpf = formatarCPF(SpreadsheetApp.getActiveSpreadsheet().getRange("C3").getValue());
    const pessoa = recoverPessoa(cpf);
    if (!pessoa) {
        SpreadsheetApp.getUi().alert("Pessoa não encontrada.");
        return;
    }
    const endereco = pessoa.chefe_familia ? recoverEndereco(cpf) : null;
    const domicilio = pessoa.chefe_familia ? recoverDomicilio(cpf) : null;
    const vulnerabilidades = recoverPessoaVulnerabilidade(cpf);
    const beneficios = recoverPessoaBeneficio(cpf);
    const template = HtmlService.createTemplateFromFile("modal_edicao_cadastro");
    template.dadosEdicao = {
        pessoa,
        endereco,
        domicilio,
        vulnerabilidades,
        beneficios,
        editar: true
    };
    const html = template.evaluate()
        .setWidth(850)
        .setHeight(800);
    SpreadsheetApp.getUi().showModalDialog(html, "Editar Pessoa");
}
function updateCadastroPessoa(dados) {
    try {
        // Atualiza Pessoa
        updatePessoa(dados.pessoa.cpf, dados.pessoa);
        // Atualiza Endereço
        if (dados.endereco) {
            updateEndereco(dados.pessoa.cpf, dados.endereco);
        }
        // Atualiza Domicílio
        if (dados.domicilio) {
            updateDomicilio(dados.pessoa.cpf, dados.domicilio);
        }
        // Atualiza Vulnerabilidades
        deletePessoaVulnerabilidade(dados.pessoa.cpf);
        if (dados.vulnerabilidades && dados.vulnerabilidades.length > 0) {
            createPessoaVulnerabilidade(dados.vulnerabilidades);
        }
        // Atualiza Benefícios
        deletePessoaBeneficio(dados.pessoa.cpf);
        if (dados.beneficios && dados.beneficios.length > 0) {
            createPessoaBeneficio(dados.beneficios);
        }
        return { status: 0, msg: "Cadastro atualizado com sucesso!" };
    }
    catch (e) {
        console.error("Erro ao atualizar cadastro: " + e);
        return { status: 1, msg: "Erro ao atualizar cadastro." };
    }
}
