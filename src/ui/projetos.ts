import { Projeto } from "../d/dInterfaces";
import { Pessoa, PessoaProjeto } from "../f/fInterfaces";
import { createPessoaProjeto, updatePessoaProjeto } from "../f/fPessoaProjeto";
import { formatarCPF } from "../utils";


interface TabelaVinculo {
	cpf: string;
	nome: string;
	status: string;
	retorno: string;
}

function vincularPessoaProjeto() {
	const sheet = getPessoaProjetoSheet();

	const nomeProjeto = sheet?.getRange("C4").getValue();
	const database = getDataBase()
	const dProjeto = tableToObject<Projeto>("dProjeto", database);
	const listaVinculos = buscarListaPessoas(sheet, database);

	const idProjeto = (<Projeto>dProjeto.find(p => p.nome_projeto === nomeProjeto)).id;
	listaVinculos.forEach(v => {
		if (v.status === "Ativo") {
			// Já está vinculado, não faz nada
			return;
		}
		else if (v.status === "Inativo") {
			updatePessoaProjeto(v.cpf, <Partial<PessoaProjeto>>{ id_projeto: idProjeto, ativo: true }, database);
			v.retorno = "Vínculo reativado.";
			v.status = "Ativo";

		}
		else if (v.status === "Não Vinculado") {
			const novoVinculo: PessoaProjeto = {
				cpf: v.cpf,
				id_projeto: idProjeto,
				data_inicio: <string>utils_formatDate(new Date()),
				data_fim: "",
				ativo: true
			};
			createPessoaProjeto(novoVinculo, database);
			v.retorno = "Vínculo criado.";
			v.status = "Ativo";
		}
	}
	)
	const matriz = listaVinculos.map(v => [v.cpf, "", v.nome, "", v.status, "", v.retorno]);
	sheet?.getRange(10, 2, matriz.length, 7).setValues(matriz);

}


function desvincularPessoaProjeto() {
	const sheet = getPessoaProjetoSheet();

	const nomeProjeto = sheet?.getRange("C4").getValue();
	const database = getDataBase()
	const dProjeto = tableToObject<Projeto>("dProjeto", database);
	const listaVinculos = buscarListaPessoas(sheet, database);

	const idProjeto = (<Projeto>dProjeto.find(p => p.nome_projeto === nomeProjeto)).id;
	listaVinculos.forEach(v => {
		if (v.status === "Inativo" || v.status === "Não Vinculado") {
			// Já está desvinculado, não faz nada
			return;
		}
		else if (v.status === "Ativo") {
			updatePessoaProjeto(v.cpf, <Partial<PessoaProjeto>>{ id_projeto: idProjeto, ativo: false, data_fim: utils_formatDate(new Date()), }, database);
			v.retorno = "Vínculo desativado.";
			v.status = "Inativo";

		}
	}
	)
	const matriz = listaVinculos.map(v => [v.cpf, "", v.nome, "", v.status, "", v.retorno]);
	sheet?.getRange(10, 2, matriz.length, 7).setValues(matriz);

}


function buscarListaPessoas(sheet = getPessoaProjetoSheet(), database = getDataBase()): TabelaVinculo[] {
	const fPessoa = tableToObject<Pessoa>("fPessoa", database);
	const fPessoaProjeto = tableToObject<PessoaProjeto>("fPessoaProjeto", database);
	const nomeProjeto = sheet?.getRange("C4").getValue();
	const dProjeto = tableToObject<Projeto>("dProjeto", database);
	const projetoId = dProjeto.find(p => p.nome_projeto === nomeProjeto)?.id;
	const listaCpfs = <string[]>sheet?.getRange("B10:B").getValues().flat().filter(cpf => cpf !== "").map(cpf => formatarCPF(cpf)) || [];

	sheet?.getRange("C10:H").clearContent();

	const resultadoBusca = listaCpfs.map((cpf) => {
		const pessoaEncontrada = fPessoa.find(p => p.cpf === cpf);
		const nome = pessoaEncontrada ? pessoaEncontrada.nome : "";
		let status = "";
		let retorno = "";
		if (pessoaEncontrada) {
			const registro = fPessoaProjeto.find(pp => pp.cpf === cpf && pp.id_projeto === projetoId);
			status = registro ? (registro.ativo ? "Ativo" : "Inativo") : "Não Vinculado";
			retorno = "";
		}
		else {
			status = "";
			retorno = "CPF não cadastrado.";
		}
		return { cpf, nome, status, retorno };
	});

	const matriz = resultadoBusca.map(r => [r.cpf, "", r.nome, "", r.status, "", r.retorno]);
	sheet?.getRange(10, 2, matriz.length, 7).setValues(matriz);

	return resultadoBusca
}

function getPessoaProjetoSheet() {
	const ss = SpreadsheetApp.getActiveSpreadsheet();
	return ss.getSheetByName("Pessoa/Projetos");
}

function limparLista() {
	const sheet = getPessoaProjetoSheet();
	sheet?.getRange("B10:H").clearContent();
}

function utils_formatDate(arg0: Date): string | undefined {
	throw new Error("Function not implemented.");
}

