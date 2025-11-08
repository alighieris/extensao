export interface Retorno {
	status: 0 | 1 | 2 | 3; // 0 - sucesso, 1 - erro de execução, 2 - erro de validação, 3 - não encontrado
	msg: string;
}

export interface Vulnerabilidade {
	id: number;
	tipo_vulnerabilidade: string;
}

export interface Cor {
	id: number;
	tipo_cor: string;
}

export interface Escolaridade {
	id: number;
	tipo_escolaridade: string;
}

export interface Parentesco {
	id: number;
	tipo_parentesco: string;
}

export interface Projeto {
	id: number;
	nome_projeto: string;
	ativo: string;
	contato: string;
}

export interface Beneficio {
	id: number;
	tipo_beneficio: string;
}