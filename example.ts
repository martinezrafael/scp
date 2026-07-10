let precoProduto: number = 199.99;
let quantidadeEstoque: number = 20;

console.log(
  `Eu tenho no estoque ${quantidadeEstoque} produtos que custam R$${precoProduto}, cada um.`,
);

let nomeUsuario: string = "Rafael Molina Martinez";

interface Pessoa {
  cpf: string;
}

// Union Types
let cpf: number | string | boolean | null | Pessoa;

cpf = 33470512892;
cpf = "334.705.128-92";
cpf = true;
cpf = null;
cpf = { cpf: "334.705.128-92" };

// Enum = Union Types
let cargoDoFuncionario: "Gerente" | "Supervisor" | "Estagiário";

cargoDoFuncionario = "Gerente";

// Void: utilizado principalmente para funções que não retornam nenhum valor
function logarMensagem(msg: string): void {
  console.log(msg);
}

function somar(a: number, b: number): number {
  return a + b;
}
