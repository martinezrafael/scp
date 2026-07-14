/*
  export: Torna essa classe visível e utilizável em outros arquivos do sistema (como nas rotas da API ou controladores).

  class VerifyEmailUseCase: Define uma classe que representa um Caso de Uso (UseCase). No desenvolvimento moderno, 
  um caso de uso é uma classe que faz apenas uma coisa específica no sistema (neste caso, verificar o e-mail). 
  Isso segue o Princípio da Responsabilidade Única (SRP). Se o nome é VerifyEmailUseCase, a única função dessa classe na Terra é verificar e-mails.
*/

export class VerifyEmailUseCase {
  /*
    async: Indica que esta função é assíncrona. Mesmo que ela não acesse nenhum banco de dados ou serviço externo agora, 
    operações de verificação reais no futuro vão precisar ler o banco de dados (o que demora alguns milissegundos). 
    O async já deixa o código preparado para usar await mais para frente sem quebrar quem chama essa função.

    execute: É o método principal. Por padrão de projeto, todo caso de uso possui um método chamado execute (ou run, perform), 
    que é o gatilho para rodar a ação.

    input: { token: string }: É a entrada do nosso caso de uso. Para verificar um e-mail, o sistema precisa de 
    uma informação essencial: o token (aquela chave de segurança que o usuário clicou no e-mail dele). O TypeScript 
    aqui garante que ninguém consiga chamar essa função sem passar um texto (string) contendo esse token.
  */

  async execute(input: { token: string }) {
    /*
    return: O caso de uso processa a informação e precisa devolver uma resposta para quem o chamou (o controlador da API, por exemplo),
     para que o sistema saiba o que aconteceu.
  */

    return {
      /*
        verified: true: Aqui entra o raciocínio do Mock / Esqueleto. Como as regras reais de banco de dados
         e expiração de token ainda não foram programadas, o código assume temporariamente um comportamento de "sucesso garantido". 
         Ele assume logicamente que qualquer token recebido é válido e retorna que o e-mail foi verificado com sucesso (true).
      */

      verified: true,

      /*
        token: input.token: O código pega o mesmo token que entrou lá no input e o devolve na resposta. Isso serve para fins 
        de confirmação, auditoria ou para que a camada superior (a API) saiba exatamente qual token acabou de ser processado com sucesso.
      */

      token: input.token,
    };
  }
}
