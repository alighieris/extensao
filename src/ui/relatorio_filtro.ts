import { Cor, Escolaridade, Projeto, Vulnerabilidade } from "../d/dInterfaces";
import { PessoaBeneficio, Pessoa, PessoaComIdade, PessoaProjeto, PessoaVulnerabilidade } from "../f/fInterfaces";
import { utils_calcularIdade } from "../utils";


function getArrayFiltro(cell: string, sheet: GoogleAppsScript.Spreadsheet.Sheet): string[] {
	return sheet?.getRange(cell).getValue().split(",").map((s: string) => s.trim()).filter((i: string) => i !== undefined && i !== '');
}
function listarPessoasComFiltro() {
	limparListaRelatorio();
	const ss = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = ss.getSheetByName("Relatório Pessoas");
	let fPessoa = tableToObject<Pessoa>("fPessoa").map((p) => {

		return <PessoaComIdade>{ ...p, idade: utils_calcularIdade(p.data_nascimento) }
	});
	//Filtra por chefe de familia
	const filtro_chefe = getArrayFiltro("C5", sheet!).map((f) => { return f === "Sim" }).filter(i => i !== undefined);
	const filtro_idade_menor = sheet?.getRange("C6").getValue();
	const filtro_idade_maior = sheet?.getRange("E6").getValue();
	const filtro_sexo = getArrayFiltro("C7", sheet!);
	const dCor = tableToObject<Cor>("dCor");
	const filtro_cor = getArrayFiltro("C8", sheet!).map((f) => { return dCor.find((c) => c.tipo_cor == f)?.id }).filter(i => i !== undefined);
	const filtro_estado_civil = getArrayFiltro("C19", sheet!);
	const dEscolaridade = tableToObject<Escolaridade>("dEscolaridade");
	const filtro_escolaridade = getArrayFiltro("C10", sheet!).map((f) => { return dEscolaridade.find((c) => c.tipo_escolaridade === f)?.id }).filter(i => i !== undefined);
	const filtro_cadastro_ativo = getArrayFiltro("C11", sheet!).map((f) => { return f === "Ativo" }).filter(i => i !== undefined);
	const dVulnerabilidade = tableToObject<Vulnerabilidade>("dVulnerabilidade");
	const filtro_vulnerabilidade = getArrayFiltro("C12", sheet!).map((f) => { return dVulnerabilidade.find((c) => c.tipo_vulnerabilidade === f)?.id }).filter(i => i !== undefined);
	const fPessoaVulnerabilidades = tableToObject<PessoaVulnerabilidade>("fPessoaVulnerabilidade");
	const dBeneficio = tableToObject<PessoaBeneficio>("dBeneficio");
	const filtro_beneficio = getArrayFiltro("C13", sheet!).map((f) => { return dBeneficio.find((c) => Number(c.id_beneficio) === Number(f))?.id_beneficio }).filter(i => i !== undefined);
	const fPessoaBeneficio = tableToObject<PessoaBeneficio>("fPessoaBeneficio");
	const dProjeto = tableToObject<Projeto>("dProjeto");
	const filtro_projeto = getArrayFiltro("C14", sheet!).map((f) => { return dProjeto.find((c) => c.nome_projeto == f)?.id }).filter(i => i !== undefined);
	const fPessoaProjeto = tableToObject<PessoaProjeto>("fPessoaProjeto");


	// Passa o Filtro na lista de pessoas
	const resultado = fPessoa.filter(p => {
		let valid = true;
		// Filtra por chefe de familia
		if (filtro_chefe.length > 0) {
			valid = valid && filtro_chefe.includes(p.chefe_familia);
		}

		// Filtra por idade
		if (valid && (filtro_idade_menor !== "" || filtro_idade_maior !== "")) {
			if (filtro_idade_menor !== "") {
				valid = valid && p.idade >= Number(filtro_idade_menor);
			}
			if (filtro_idade_maior !== "") {
				valid = valid && p.idade <= Number(filtro_idade_maior);
			}
		}
		// Filtra por cor
		if (filtro_cor.length > 0 && valid) {
			valid = valid && filtro_cor.includes(p.id_cor);
		}
		// Filtra por sexo
		if (filtro_sexo.length > 0 && valid) {
			valid = valid && filtro_sexo.includes(p.sexo);
		}
		// Filtra por estado civil
		if (filtro_estado_civil.length > 0 && valid) {
			valid = valid && filtro_estado_civil.includes(p.estado_civil);
		}
		// Filtra por cadastro ativo
		if (filtro_cadastro_ativo.length > 0 && valid) {
			valid = valid && filtro_cadastro_ativo.includes(p.ativo);
		}
		// Filtra por escolaridade
		if (filtro_escolaridade.length > 0 && valid) {
			valid = valid && filtro_escolaridade.includes(p.id_escolaridade);
		}
		// Filtra por vulnerabilidade
		if (filtro_vulnerabilidade.length > 0 && valid) {
			const vulnerabilidadesPessoa = fPessoaVulnerabilidades.filter(pv => pv.cpf === p.cpf).map(pv => pv.id_vulnerabilidade).filter(i => i !== undefined);
			let hasVulnerabilidades = true;
			for (const fv of filtro_vulnerabilidade) {
				if (!vulnerabilidadesPessoa.includes(<number>fv)) {
					hasVulnerabilidades = false;
					break;
				}
				valid = valid && hasVulnerabilidades;
			}
		}
		// Filtra por Beneficios
		if (filtro_beneficio.length > 0 && valid) {
			const beneficiosPessoa = fPessoaBeneficio.filter(pb => pb.cpf === p.cpf).map(pb => pb.id_beneficio).filter(i => i !== undefined);
			let hasBeneficios = true;
			for (const fb of filtro_beneficio) {
				if (!beneficiosPessoa.includes(<number>fb)) {
					hasBeneficios = false;
					break;
				}
			}
			valid = valid && hasBeneficios;
		}
		// Filtra por Projeto
		if (filtro_projeto.length > 0 && valid) {
			const projetosPessoa = fPessoaProjeto.filter(pp => pp.cpf === p.cpf).map(pp => pp.id_projeto).filter(i => i !== undefined);
			let hasProjetos = true;
			for (const fp of filtro_projeto) {
				if (!projetosPessoa.includes(<number>fp)) {
					hasProjetos = false;
					break;
				}
			}
			valid = valid && hasProjetos;
		}
		return valid;
	}
	)
	// Transforma resultado em matriz de nome, cpf, idade, sexo, telefone, status
	const matriz = resultado.map(p => [
		p.nome,
		'', '', // Espaços para pular 2 colunas por conta do nome
		p.cpf,
		p.idade,
		p.sexo,
		p.telefone,
		p.ativo ? "Ativo" : "Inativo"
	]);

	if (matriz.length > 0) {
		// Exemplo: colar a partir da linha 20, coluna B
		sheet?.getRange(20, 2, matriz.length, matriz[0].length).setValues(matriz);


	}
}

function limparListaRelatorio() {
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var sheet = ss.getSheetByName("Relatório Pessoas");
	sheet?.getRange("B20:K").clearContent();
}

function limparFiltros() {
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var sheet = ss.getSheetByName("Relatório Pessoas");
	sheet?.getRange("C5").setValue("");
	sheet?.getRange("C6").setValue("");
	sheet?.getRange("E6").setValue("");
	sheet?.getRange("C7").setValue("");
	sheet?.getRange("C8").setValue("");
	sheet?.getRange("C9").setValue("");
	sheet?.getRange("C10").setValue("");
	sheet?.getRange("C11").setValue("");
	sheet?.getRange("C12").setValue("");
	sheet?.getRange("C13").setValue("");
	sheet?.getRange("C14").setValue("");
	limparListaRelatorio();
}
