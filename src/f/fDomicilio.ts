import { Domicilio, Retorno } from "./fInterfaces";

export function createDomicilio(domicilio: Domicilio, database = getDataBase()) {
	try {
		database.getSheetByName("fDomicilio")?.appendRow(domicilioAsList(domicilio));
	} catch (e) {
		console.error("Erro ao adicionar domicílio: " + e);
	}
}

function domicilioAsList(domicilio: Domicilio): (string | number)[] {
	return [
		domicilio.cpf_chefe_familia,
		domicilio.condicao_domicilio,
		domicilio.condicao_domicilio_outro,
		domicilio.tipo_construcao,
		domicilio.tipo_construcao_outro,
		domicilio.numero_comodos,
		domicilio.numero_casas_lote,
		domicilio.valor_aluguel
	];
}

export function recoverDomicilio(cpf_chefe_familia: string, database = getDataBase()): Domicilio | null {
	const domicilios = tableToObject<Domicilio>("fDomicilio", database);
	const domicilio = domicilios.find((d) => d.cpf_chefe_familia === cpf_chefe_familia);
	return domicilio || null;
}

export function updateDomicilio(cpf_chefe_familia: string, updatedDomicilio: Partial<Domicilio>, database = getDataBase()): Retorno {
	const sheet = getSheet("fDomicilio", database);
	const domicilios = tableToObject<Domicilio>("fDomicilio", database);
	const rowIndex = domicilios.findIndex((d) => d.cpf_chefe_familia === cpf_chefe_familia);
	if (rowIndex === -1) {
		return { status: 3, msg: 'Domicílio não encontrado' };
	}
	const headers = sheet.getDataRange().getValues()[0] as (keyof Domicilio)[];
	try {
		sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([domicilioAsList({ ...domicilios[rowIndex], ...updatedDomicilio })]);
		return { status: 0, msg: 'Domicílio atualizado com sucesso' };
	} catch (e) {
		console.error("Erro ao atualizar domicílio: " + e);
		return { status: 1, msg: 'Erro ao atualizar domicílio' };
	}
}

export function deleteDomicilio(cpf_chefe_familia: string, database = getDataBase()): Retorno {
	const sheet = getSheet("fDomicilio", database);
	const domicilios = tableToObject<Domicilio>("fDomicilio", database);
	const rowIndex = domicilios.findIndex((d) => d.cpf_chefe_familia === cpf_chefe_familia);
	if (rowIndex === -1) {
		return { status: 3, msg: 'Domicílio não encontrado' };
	}
	try {
		sheet.deleteRow(rowIndex + 2); // +2 para ajustar ao índice da planilha (1-based e cabeçalho)
		return { status: 0, msg: 'Domicílio deletado com sucesso' };
	} catch (e) {
		console.error("Erro ao deletar domicílio: " + e);
		return { status: 1, msg: 'Erro ao deletar domicílio' };
	}
}