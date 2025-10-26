export interface Retorno {
	status: 0 | 1 | 2 | 3; // 0 - sucesso, 1 - erro de execução, 2 - erro de validação, 3 - não encontrado
	msg: string;
}

export interface Pessoa {
	cpf: string;
	chefe_familia: boolean;
	cpf_chefe_familia: string;
	id_parentesco: number;
	rg: string;
	nome: string;
	nome_social: string;
	data_nascimento: string;
	sexo: string;
	telefone: string;
	nome_mae: string;
	naturalidade: string;
	id_cor: number;
	id_escolaridade: number;
	profissao: string;
	renda: string;
	estado_civil: string;
	observacao: string;
	ativo: boolean;
}
export interface PessoaComIdade extends Pessoa {
	idade: number;
}

export interface Endereco {
	cpf_chefe_familia: string;
	cidade: string;
	bairro: string;
	logradouro: string;
	referencia: string;
	cep: string;
}

export interface Domicilio {
	cpf_chefe_familia: string;
	condicao_domicilio: string;
	condicao_domicilio_outro: string;
	tipo_construcao: string;
	tipo_construcao_outro: string;
	numero_comodos: number;
	numero_casas_lote: number;
	valor_aluguel: number;
}

export interface PessoaProjeto {
	cpf: string;
	id_projeto: number;
	data_inicio: string;
	data_fim: string;
	ativo: boolean;
}

export interface Atendimento {
	cpf: string;
	id_atendimento: number;
	observacao_atendimento: string;
}

export interface PessoaVulnerabilidade {
	cpf: string;
	id_vulnerabilidade: number;
	observacao_vulnerabilidade: string;
}
export interface PessoaBeneficio {
	cpf: string;
	id_beneficio: number;
	observacao_beneficio: string;
}

// const mockPessoa: Pessoa = {
// 	cpf: "120.046.254-81",
// 	chefe_familia: true,
// 	cpf_chefe_familia: "120.046.254-81",
// 	rg: "",
// 	nome: "",
// 	nome_social: "",
// 	data_nascimento: "",
// 	sexo: "",
// 	telefone: "",
// 	nome_mae: "",
// 	naturalidade: "",
// 	id_cor: 0,
// 	id_escolaridade: 0,
// 	profissao: "",
// 	renda: "",
// 	estado_civil: "",
// 	observacao: ""
// }