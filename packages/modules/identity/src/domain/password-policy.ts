
/*
  export: Torna essa classe visível e utilizável em outros arquivos do projeto (ex: na tela de cadastro ou de alteração de senha).

  class PasswordPolicy: Cria uma classe chamada "Política de Senha". Ela funciona como uma caixa organizacional para 
  guardar regras de negócio relacionadas a senhas.
*/

export class PasswordPolicy {

  /*
    static: Significa que o método é estático. Você não precisa criar uma instância da classe (ex: const policy = new PasswordPolicy()) para usá-lo. 
    Você pode chamá-lo diretamente usando PasswordPolicy.validate('suaSenha').

    validate(password: string): Define o método validate, que recebe um parâmetro chamado password, obrigatoriamente do tipo texto (string).

    : void: Indica que este método não retorna nenhum valor (como um número ou texto) se tudo der certo. 
    Ele apenas executa uma ação ou lança um erro.
  
  */


  /**
   * Valida se uma senha cumpre os requisitos mínimos de segurança da plataforma.
   * @param password - A senha em texto puro a ser validada.
   * @throws {Error} Se a senha falhar em qualquer critério de validação.
   */
  
  static validate(password: string): void {

    /*
      if (...): Inicia a primeira validação.

      password.length: Conta quantos caracteres a senha possui.

      < 10: Verifica se essa quantidade é menor que 10.
    */

    if (password.length < 10) {

      /*
        throw new Error(...): Se a senha tiver menos de 10 caracteres, o código entra aqui. O throw interrompe o fluxo do sistema na hora 
        e lança uma exceção com a mensagem de erro configurada. Nada abaixo disso é executado se essa condição for verdadeira.
      */

      throw new Error('Password must contain at least 10 characters');
    }

    /*
      /[A-Z]/: Isso é uma Expressão Regular (RegEx). Ela funciona como um "scanner" configurado para procurar qualquer letra maiúscula de A até Z.

      .test(password): Executa o scanner dentro da string password. Se encontrar uma letra maiúscula, o resultado é verdadeiro (true). 
      Se não encontrar, o resultado é falso (false).

      ! (Operador de Negação): Ele inverte o resultado do teste. Ou seja: se o teste der false (não achou maiúscula), 
      o ! transforma em true (verdadeiro), fazendo o código entrar no if. Em português simples, leia como: "Se NÃO 
      houver letra maiúscula na senha...".
    */

    if (!/[A-Z]/.test(password)) {

      /*
        Se a senha não contiver nenhuma letra maiúscula, o sistema barra o processo aqui e exibe essa mensagem.
      */

      throw new Error('Password must contain uppercase letter');
    }

    /*
      /[0-9]/: Outro scanner de RegEx, mas este procura por qualquer número de 0 a 9.

      !.test(password): Mesma lógica de negação. Leia como: "Se NÃO houver nenhum número na senha...".
    */

    if (!/[0-9]/.test(password)) {

      /*
        Se a senha chegou até aqui, significa que ela passou no teste do tamanho e no da maiúscula. Mas se não tiver números,
         ela é barrada aqui com essa terceira mensagem.
      */

      throw new Error('Password must contain number');
    }
  }
}