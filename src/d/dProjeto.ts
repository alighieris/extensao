import { geraIdNovoProjeto, validaProjetoJaCadastratado } from "../utils";
import { Projeto, Retorno } from "./dInterfaces";

export function createProjeto(nome_projeto: string): Retorno {
    const database = getDataBase();

    if (nome_projeto === "" || nome_projeto == undefined || nome_projeto == null) {
        return {status: 2, msg: 'Nome do projeto inválido'}
    }
    
    if (validaProjetoJaCadastratado(nome_projeto, database)) {
        return {status: 2, msg: 'Projeto já cadastrado'}
    }

    const projeto: Projeto = {
        id: geraIdNovoProjeto(database),
        nome_projeto: nome_projeto,
        ativo: 'TRUE',
        contato: ''
    }

    try {
        getSheet("dProjeto").appendRow(projetoAsList(projeto));
        return {status: 0, msg: 'Projeto cadastrado com sucesso'}
    } catch (e) {
        console.error("Erro ao adicionar projeto: " + e);
        return {status: 1, msg: 'Erro ao adicionar projeto, tente novamente mais tarde'}
    }
}

function projetoAsList(projeto: Projeto): (string | number)[] {
    return [
        projeto.id,
        projeto.nome_projeto,
        projeto.ativo,
        projeto.contato
    ];
}