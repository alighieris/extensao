import { Pessoa } from "./f/fInterfaces";


function utils_formatDate(date: Date): string {
  return Utilities.formatDate(date, "GMT-3", "dd-MM-yyyy");
}

export function utils_calcularIdade(dataNascimento: string): number {
  var hoje = new Date();
  var partes = dataNascimento.split("-");
  // dd-MM-yyyy
  var nascimento = new Date(
    parseInt(partes[2], 10),
    parseInt(partes[1], 10) - 1,
    parseInt(partes[0], 10)
  );
  var idade = hoje.getFullYear() - nascimento.getFullYear();
  var m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}


export function utils_validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export function validaCPFExistente(cpf: string, database = getDataBase()): boolean {
  const pessoas = tableToObject<Pessoa>("fPessoa", database);
  cpf = formatarCPF(cpf);
  return pessoas.some((p) => p.cpf === cpf);
}

export function include(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

export function createAlert(message: string) {
  SpreadsheetApp.getUi().alert(message);
}

export function formatarCPF(cpf: string | number): string {
  let str = String(cpf).replace(/\D/g, "");
  str = str.padStart(11, "0");
  return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
