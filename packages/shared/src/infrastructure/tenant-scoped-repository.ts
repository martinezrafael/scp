/*
  Raciocínio: * O export torna essa classe visível para outros arquivos do projeto.

  O abstract (classe abstrata) significa que ela não pode ser instanciada diretamente (você não pode fazer new TenantScopedRepository()). 
  Ela serve estritamente como um "molde" ou "contrato de herança".

  A lógica aqui é: Repositórios específicos (ex: ProductRepository, UserRepository) vão herdar desta classe para ganhar o 
  superpoder da validação de segurança automaticamente.
*/

export abstract class TenantScopedRepository {

  /*
    Raciocínio:

    O modificador protected define que este método só pode ser acessado por membros da própria classe ou por 
    classes que herdarem dela (as classes filhas). O mundo externo (como os Controllers) não tem acesso direto a ele.

    O nome assertTenantId carrega uma semântica forte: "assert" significa afirmar com certeza absoluta. 
    O método não está apenas checando, ele está garantindo que a condição seja verdadeira.

    Ele recebe o tenantId (o identificador do cliente) como uma string e retorna void (nada), porque o objetivo dele não é transformar o dado, 
    mas sim validar sua existência.
  */

  protected assertTenantId(tenantId: string): void {
    
    /*
      Raciocínio: Aqui está o coração da validação, que usa um curto-circuito lógico (|| que significa "OU") para capturar duas falhas graves:

      !tenantId: Verifica se a variável é falsa/inexistente (se vier como null, undefined ou uma string vazia "").

      tenantId.trim() === '': Caso a variável exista, o .trim() remove todos os espaços em branco das extremidades. 
      Isso impede que um valor malicioso ou mal formatado composto apenas por espaços (ex: "   ") passe como válido.

      A lógica aqui é: Se a string for nula, indefinida ou puramente cheia de espaços, a condição do if é disparada como verdadeira (true).
    */
    
    if (!tenantId || tenantId.trim() === '') {

      /*
        Raciocínio: Se a validação do if acima for verdadeira, o código executa um throw (lançar).

        Lançar um erro interrompe imediatamente o fluxo normal do software. A aplicação não avança para a linha do banco de dados.

        A mensagem é extremamente explícita (Security Violation) para que, nos logs do sistema, os desenvolvedores e ferramentas 
        de monitoramento identifiquem na hora que houve uma tentativa de violação de escopo de dados.
      */

      throw new Error('Security Violation: tenantId is required for tenant-scoped operations.');
    }
  }
}