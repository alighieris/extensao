import { Cor, Escolaridade, Vulnerabilidade } from "../d/dInterfaces";
import { Pessoa, PessoaVulnerabilidade } from "../f/fInterfaces";
import { formatarCPF } from "../utils";

export function consultaPessoa() {
	const ss = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = ss.getSheetByName("Pessoa");
	const cpf = formatarCPF(sheet?.getRange("C3").getValue());

	limparConsultaPessoa(sheet!);
	sheet?.getRange("E3").clearContent();
	const database = getDataBase();
	const fPessoa = tableToObject<Pessoa>("fPessoa", database);
	const pessoa = fPessoa.find((p) => p.cpf === cpf);

	if (!pessoa) {
		sheet?.getRange("E3").setValue("CPF não encontrado");
		return;
	}

	const dCor = tableToObject<Cor>("dCor", database);
	const cor = pessoa ? dCor.find((c) => c.id == pessoa.id_cor)?.tipo_cor : "";
	const dEscolaridade = tableToObject<Escolaridade>("dEscolaridade", database);
	const escolaridade = pessoa ? dEscolaridade.find((e) => e.id == pessoa.id_escolaridade)?.tipo_escolaridade : "";
	const dVulnerabilidade = tableToObject<Vulnerabilidade>("dVulnerabilidade", database);
	const fPessoaVulnerabilidades = tableToObject<PessoaVulnerabilidade>("fPessoaVulnerabilidade", database);

	const vulnerabilidades = fPessoaVulnerabilidades.filter((pv) => pv.cpf === pessoa.cpf).map((pv) => {
		const nome_vulnerabilidade = dVulnerabilidade.find((d) => d.id === pv.id_vulnerabilidade)?.tipo_vulnerabilidade;
		return { tipo: nome_vulnerabilidade, observacao: pv.observacao_vulnerabilidade };
	}).map(v => [v.tipo, v.observacao]);


	sheet?.getRange("C7").setValue(pessoa.chefe_familia ? "Sim" : "Não");
	sheet?.getRange("C8").setValue(pessoa.nome);
	sheet?.getRange("C9").setValue(pessoa.nome_social);
	sheet?.getRange("C10").setValue(pessoa.cpf);
	sheet?.getRange("C11").setValue(pessoa.rg);
	sheet?.getRange("C12").setValue(pessoa.data_nascimento);
	sheet?.getRange("C14").setValue(cor);
	sheet?.getRange("C15").setValue(escolaridade);
	sheet?.getRange("C16").setValue(pessoa.profissao);
	sheet?.getRange("C17").setValue(pessoa.nome_mae);
	sheet?.getRange("C18").setValue(pessoa.estado_civil);
	sheet?.getRange("C19").setValue(pessoa.naturalidade);
	sheet?.getRange("C20").setValue(pessoa.telefone);
	sheet?.getRange("F15").setValue(pessoa.observacao);

	if (vulnerabilidades.length > 0) {
		sheet?.getRange(24, 2, vulnerabilidades.length, vulnerabilidades[0].length).setValues(vulnerabilidades);
	}
}


function limparConsultaPessoa(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
	sheet.getRange("C7:C20").clearContent();
	sheet.getRange("C23").clearContent();
	sheet.getRange("F15").clearContent();
	sheet.getRange("F24:G31").clearContent();
	sheet.getRange("B24:C31").clearContent();
}