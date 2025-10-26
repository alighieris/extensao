import { PessoaVulnerabilidade, Retorno } from "./fInterfaces";

// Adiciona um ou mais registros de PessoaVulnerabilidade
export function createPessoaVulnerabilidade(
	pessoaVulnerabilidades: PessoaVulnerabilidade[] | PessoaVulnerabilidade,
	database = getDataBase()
): Retorno {
	const sheet = database.getSheetByName("fPessoaVulnerabilidade");
	if (!sheet) return { status: 1, msg: "Sheet não encontrada" };

	try {
		const arr = Array.isArray(pessoaVulnerabilidades)
			? pessoaVulnerabilidades
			: [pessoaVulnerabilidades];
		arr.forEach((pv) => {
			sheet.appendRow(pessoaVulnerabilidadeAsList(pv));
		});
		return { status: 0, msg: "PessoaVulnerabilidade(s) cadastrada(s) com sucesso" };
	} catch (e) {
		console.error("Erro ao adicionar PessoaVulnerabilidade: " + e);
		return { status: 1, msg: "Erro ao adicionar PessoaVulnerabilidade" };
	}
}

function pessoaVulnerabilidadeAsList(pv: PessoaVulnerabilidade): (string | number)[] {
	return [
		pv.cpf,
		pv.id_vulnerabilidade,
		pv.observacao_vulnerabilidade
	];
}

// Recupera todos os registros de PessoaVulnerabilidade para um cpf_pessoa
export function recoverPessoaVulnerabilidade(
	cpf_pessoa: string,
	database = getDataBase()
): PessoaVulnerabilidade[] {
	const lista = tableToObject<PessoaVulnerabilidade>("fPessoaVulnerabilidade", database);
	return lista.filter((pv) => pv.cpf === cpf_pessoa);
}

// Atualiza todos os registros de PessoaVulnerabilidade para um cpf_pessoa
export function updatePessoaVulnerabilidade(
	cpf_pessoa: string,
	novos: PessoaVulnerabilidade[],
	database = getDataBase()
): Retorno {
	const sheet = getSheet("fPessoaVulnerabilidade", database);
	const lista = tableToObject<PessoaVulnerabilidade>("fPessoaVulnerabilidade", database);

	// Remove todos os registros antigos desse cpf_pessoa
	let linhasRemover: number[] = [];
	lista.forEach((pv, idx) => {
		if (pv.cpf === cpf_pessoa) {
			linhasRemover.push(idx + 2); // +2 por causa do cabeçalho e 1-based
		}
	});

	try {
		// Remover de baixo para cima para não alterar os índices
		linhasRemover.sort((a, b) => b - a).forEach((linha) => sheet.deleteRow(linha));
		// Adiciona os novos
		novos.forEach((pv) => {
			sheet.appendRow(pessoaVulnerabilidadeAsList(pv));
		});
		return { status: 0, msg: "PessoaVulnerabilidade(s) atualizada(s) com sucesso" };
	} catch (e) {
		console.error("Erro ao atualizar PessoaVulnerabilidade: " + e);
		return { status: 1, msg: "Erro ao atualizar PessoaVulnerabilidade" };
	}
}

// Remove todos os registros de PessoaVulnerabilidade para um cpf_pessoa
export function deletePessoaVulnerabilidade(
	cpf_pessoa: string,
	database = getDataBase()
): Retorno {
	const sheet = getSheet("fPessoaVulnerabilidade", database);
	const lista = tableToObject<PessoaVulnerabilidade>("fPessoaVulnerabilidade", database);

	let linhasRemover: number[] = [];
	lista.forEach((pv, idx) => {
		if (pv.cpf === cpf_pessoa) {
			linhasRemover.push(idx + 2); // +2 por causa do cabeçalho e 1-based
		}
	});

	if (linhasRemover.length === 0) {
		return { status: 3, msg: "Nenhum registro encontrado para o CPF informado" };
	}

	try {
		linhasRemover.sort((a, b) => b - a).forEach((linha) => sheet.deleteRow(linha));
		return { status: 0, msg: "PessoaVulnerabilidade(s) deletada(s) com sucesso" };
	} catch (e) {
		console.error("Erro ao deletar PessoaVulnerabilidade: " + e);
		return { status: 1, msg: "Erro ao deletar PessoaVulnerabilidade" };
	}
}