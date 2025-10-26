import { Parentesco } from "../d/dInterfaces";
import { recoverDomicilio } from "../f/fDomicilio";
import { recoverEndereco } from "../f/fEndereco";
import { Domicilio, Endereco, Pessoa } from "../f/fInterfaces";
import { formatarCPF, utils_calcularIdade } from "../utils";

function consultarFamiliaPorCPF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Familia");
  const cpf = formatarCPF(sheet?.getRange("C3").getValue());

  limparConsultaFamilia(sheet!);

  sheet?.getRange("F3").clearContent();
  const database = getDataBase();
  const fPessoa = tableToObject<Pessoa>("fPessoa", database);
  const pessoa = fPessoa.find((p) => p.cpf === cpf);
  const dParentesco = tableToObject<Parentesco>("dParentesco", database);

  if (!pessoa) {
    sheet?.getRange("F3").setValue("CPF não encontrado");
    return;
  }

  let chefe!: Pessoa;

  if (pessoa.chefe_familia) {
    chefe = pessoa;
  } else {
    chefe = <Pessoa>fPessoa.find((p) => p.cpf === pessoa.cpf_chefe_familia);
  }
  const membros = fPessoa.filter((p) => p.cpf_chefe_familia === chefe.cpf);
  const endereco = <Endereco>recoverEndereco(chefe.cpf, database);
  const domicilio = <Domicilio>recoverDomicilio(chefe.cpf, database);
  // Seta  informações do chefe da família
  sheet?.getRange("C7").setValue(chefe.nome);
  sheet?.getRange("C8").setValue(chefe.data_nascimento);
  sheet?.getRange("C9").setValue(chefe.cpf);
  sheet?.getRange("C10").setValue(chefe.rg);
  sheet?.getRange("C12").setValue(chefe.telefone);
  // Seta informações do endereço
  sheet?.getRange("C15").setValue(endereco.cidade);
  sheet?.getRange("E15").setValue(endereco.bairro);
  sheet?.getRange("G15").setValue(endereco.cep);
  sheet?.getRange("C16").setValue(endereco.logradouro);
  sheet?.getRange("C17").setValue(endereco.referencia);
  // Seta informações do domicílio
  sheet?.getRange("C18").setValue(domicilio.condicao_domicilio);
  sheet?.getRange("E18").setValue(domicilio.condicao_domicilio_outro);
  sheet?.getRange("C19").setValue(domicilio.tipo_construcao);
  sheet?.getRange("E19").setValue(domicilio.tipo_construcao_outro);
  sheet?.getRange("C20").setValue(domicilio.valor_aluguel);
  sheet?.getRange("E20").setValue(domicilio.numero_comodos);
  sheet?.getRange("G20").setValue(domicilio.numero_casas_lote);


  const matriz = membros.map(m => {
    const parentesco = dParentesco.find(d => d.id === m.id_parentesco)?.tipo_parentesco || "Chefe";
    const idade = utils_calcularIdade(m.data_nascimento);
    return [m.nome, '', m.cpf, parentesco, m.data_nascimento, idade, m.telefone]
  })
  if (matriz.length > 0) {
    // Exemplo: colar a partir da linha 20, coluna B
    sheet?.getRange(24, 2, matriz.length, matriz[0].length).setValues(matriz);
  }

}

function limparConsultaFamilia(sheet: GoogleAppsScript.Spreadsheet.Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Familia")!) {
  sheet.getRange("C7:C12").clearContent();
  sheet.getRange("C15:C20").clearContent();
  sheet.getRange("E15").clearContent();
  sheet.getRange("G15").clearContent();
  sheet.getRange("E18:E20").clearContent();
  sheet.getRange("G20").clearContent();
  sheet.getRange("B24:H").clearContent();
}

