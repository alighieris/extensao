import { Pessoa, Retorno } from "./fInterfaces";
import { utils_validarCPF, validaCPFExistente } from "../utils";

export function createPessoa(pessoa: Pessoa): Retorno {

	const database = getDataBase();
	if (utils_validarCPF(pessoa.cpf)) {
		if (!validaCPFExistente(pessoa.cpf, database)) {
			try {
				getSheet("fPessoa", database).appendRow(pessoaAsList(pessoa));
				return { status: 0, msg: 'Pessoa cadastrada com sucesso' };
			} catch (e) {
				console.error("Erro ao adicionar pessoa: " + e);
				return { status: 1, msg: 'Erro ao adicionar pessoa' };
			}
		} else {
			return { status: 2, msg: 'CPF já cadastrado' };
		}
	}
	else {
		return { status: 2, msg: 'CPF inválido' };
	}
}

function pessoaAsList(pessoa: Pessoa): (string | number | boolean)[] {
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

export function recoverPessoa(cpf: string, database = getDataBase()): Pessoa | null {
	const pessoas = tableToObject<Pessoa>("fPessoa", database);
	const pessoa = pessoas.find((p) => p.cpf === cpf);
	return pessoa || null;
}

export function recoverPessoasFamilia(cpf: string, database = getDataBase()): Pessoa[] {
	const pessoas = tableToObject<Pessoa>("fPessoa", database);
	const pessoa = pessoas.find((p) => p.cpf === cpf);
	let chefe!: Pessoa;
	if (pessoa && pessoa.chefe_familia) {
		chefe = pessoa;
	} else if (pessoa) {
		chefe = pessoas.find((p) => p.cpf === pessoa.cpf_chefe_familia) as Pessoa;
	} else {
		return [];
	}
	return pessoas.filter((p) => p.cpf_chefe_familia === chefe.cpf);
}

export function updatePessoa(cpf: string, updatedPessoa: Partial<Pessoa>, database = getDataBase()): Retorno {
	const sheet = getSheet("fPessoa", database);
	const pessoas = tableToObject<Pessoa>("fPessoa", database);
	const rowIndex = pessoas.findIndex((p) => p.cpf === cpf);
	if (rowIndex === -1) {
		return { status: 3, msg: 'Pessoa não encontrada' };
	}
	const headers = sheet.getDataRange().getValues()[0] as (keyof Pessoa)[];
	try {
		sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([pessoaAsList({ ...pessoas[rowIndex], ...updatedPessoa })]);
		return { status: 0, msg: 'Pessoa atualizada com sucesso' };
	} catch (e) {
		console.error("Erro ao atualizar pessoa: " + e);
		return {
			status: 1, msg: 'Erro ao atualizar pessoa'
		}
	}
}
export function deletePessoa(cpf: string) {
	const database = getDataBase();
	const sheet = getSheet("fPessoa", database);
	const pessoas = tableToObject<Pessoa>("fPessoa", database);

	const rowIndex = pessoas.findIndex((p) => p.cpf === cpf);
	if (rowIndex === -1) {
		return { status: 3, msg: 'Pessoa não encontrada' };
	}
	try {
		sheet.deleteRow(rowIndex + 2); // +2 para ajustar ao índice da planilha (1-based e cabeçalho)
		return { status: 0, msg: 'Pessoa deletada com sucesso' };
	} catch (e) {
		console.error("Erro ao deletar Pessoa: " + e);
		return { status: 1, msg: 'Erro ao deletar Pessoa' };
	}
}