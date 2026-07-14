/*
  O que faz: Importa o módulo nativo de criptografia do Node.js (crypto).

  Raciocínio lógico: Para criar um fluxo de recuperação de senha seguro, não podemos usar números sequenciais (como 1, 2, 3) ou textos 
  previsíveis para o link de recuperação, pois um hacker poderia adivinhá-los. Precisamos de um gerador de códigos aleatórios 
  de nível criptográfico (imprevisível), e esse módulo nos fornece isso.

*/

import crypto from "crypto";

/*
  O que faz: Declara e exporta uma classe chamada "Caso de Uso de Solicitação de Redefinição de Senha".

  Raciocínio lógico: Segue o padrão de arquitetura limpa (Clean Architecture). Em vez de misturar a lógica de esqueci minha senha 
  dentro de uma rota web ou de um controlador, nós a isolamos em uma classe que faz apenas uma coisa: orquestrar a lógica de 
  negócio de solicitar a nova senha. O export permite que esse bloco seja reutilizado em qualquer parte do sistema.

*/

export class RequestPasswordResetUseCase {
  /*
    O que faz: Define o método principal da classe, chamado execute, que recebe um objeto contendo o email do usuário. Ele é async (assíncrono).

    Raciocínio lógico: Todo "Caso de Uso" possui uma ação principal, geralmente chamada de execute ou run. O raciocínio aqui é 
    blindar a entrada: a única informação que o sistema precisa para iniciar uma recuperação de senha é o e-mail que o usuário 
    digitou na tela. Ele é assíncrono (async) porque, na vida real, esse método precisará consultar o banco de dados 
    e enviar e-mails (operações que demandam tempo de espera).
  
  */

  async execute(input: { email: string }) {
    /*
      O que faz: Inicia o retorno de um objeto com os dados gerados.

      Raciocínio lógico: O caso de uso processa a entrada (email) e gera um "recibo" ou "passaporte de dados" que a aplicação
      vai usar para os próximos passos (como salvar no banco e disparar o e-mail).
    */

    return {
      /*
        O que faz: Gera uma string única e aleatória no formato UUID v4 (ex: f81d4fae-7dec-11d0-a765-00a0c91e6bf6).

        Raciocínio lógico: Este é o "segredo" que identifica essa solicitação específica. Quando o e-mail for enviado para o usuário, 
        esse token estará no link (ex: site.com/recuperar?token=f81d4fae...). Como ele é gerado de forma totalmente aleatória pelo 
        módulo crypto, é matematicamente impossível um invasor adivinhar o token de outro usuário para roubar a conta.
      */
      token: crypto.randomUUID(),
      /*
        O que faz: Repassa o e-mail recebido no input de volta para o objeto de retorno.

        Raciocínio lógico: Precisamos manter o vínculo de quem solicitou aquele token. No futuro, quando o usuário clicar no link, 
        o sistema precisará saber qual conta de e-mail está associada àquele token específico para alterar a senha da pessoa certa.
      */
      email: input.email,
      /*
        O que faz: Calcula uma data e hora exatas no futuro que equivalem ao momento atual mais 30 minutos.

        Raciocínio lógico: Um token de recuperação de senha não pode durar para sempre por motivos estritos de 
        segurança (se alguém invadir o e-mail do usuário dias depois, o link antigo não deve funcionar). 
        A lógica matemática aqui funciona em milissegundos:

        Date.now() pega o carimbo de data/hora atual em milissegundos.

        1000 (1 segundo) * 60 (1 minuto) * 30 (30 minutos) = 1.800.000 milissegundos.

        O código soma o agora com esses 30 minutos e cria um novo objeto Date (new Date(...)) salvando a hora exata da expiração.
      */
      expiresAt: new Date(Date.now() + 1000 * 60 * 30), // Válido por 30 minutos
    };
  }
}
