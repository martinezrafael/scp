/*
  export: Torna essa classe visível e utilizável em outros arquivos do projeto, permitindo que qualquer camada da aplicação 
  (aplicação, domínios, casos de uso) possa disparar esse erro.

  class DomainError: Define o nome da classe que representará os erros do nosso domínio de negócio.

  extends Error: Significa que DomainError é uma classe filha que herda da classe nativa Error do JavaScript. 
  Isso é crucial porque garante que o ecossistema do Node.js, do TypeScript e de frameworks como o NestJS reconheçam este 
  objeto como um erro legítimo (permitindo o uso do comando throw, captura em blocos try/catch e preenchimento automático 
  do rastro de pilha de execução, o stack trace).
*/

export class DomainError extends Error {
  /*
    constructor(...): É o método especial executado automaticamente no momento em que alguém cria o erro no sistema utilizando o comando new DomainError(...).

    public readonly code: string:

    Ao colocar o modificador de acesso (public) direto nos parâmetros do construtor, o TypeScript cria automaticamente uma 
    propriedade na classe com esse nome e já atribui o valor recebido a ela (atalho de sintaxe).

    public: Qualquer parte do código (incluindo o nosso Filtro Global HTTP) pode ler esse código de erro.

    readonly: O código é imutável. Uma vez definido (ex: 'INSUFFICIENT_FUNDS'), ele não pode ser alterado.

    string: Define que o código identificador deve ser um texto estável, ideal para o frontend mapear respostas sem depender 
    de mensagens textuais mutáveis.

    message: string: É a mensagem descritiva do erro (ex: "Saldo insuficiente para completar a transação"). Note que ela não tem 
    o modificador public ou private aqui porque ela será repassada diretamente para a classe base Error na linha seguinte.

    public readonly details?: Record<string, unknown>:

    ? (Opcional): Indica que nem todo erro precisa de detalhes adicionais. Ele pode ser omitido na criação.

    Record<string, unknown>: É um objeto chave-valor dinâmico do TypeScript (um objeto JavaScript padrão { ... }). 
    A chave é sempre uma string e o valor é unknown (desconhecido), o que dá flexibilidade total para injetar metadados 
    específicos de cada erro (como quais campos falharam ou valores numéricos contextuais).
  
  */

  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    /*
      super(message): Invoca o construtor da classe pai (Error). Como a classe nativa do JavaScript precisa receber 
      a mensagem de texto para configurar a propriedade interna .message, nós usamos o super para empurrar esse parâmetro 
      para cima. Sem isso, o comportamento padrão de um erro do JavaScript não funcionaria corretamente.
    */

    super(message);

    /*    
    this.name: Por padrão, quando você herda de Error, o JavaScript preenche a propriedade .name do objeto como "Error".

    this.constructor.name: Captura dinamicamente o nome da classe atual que está sendo instanciada (neste caso, "DomainError" ou qualquer 
    outra subclasse que herde dela no futuro).

    Raciocínio: Essa linha substitui o nome genérico pelo nome exato da classe. Se o sistema disparar esse erro, o console 
    ou os sistemas de log vão imprimir DomainError: mensagem em vez de apenas Error: mensagem, facilitando o rastreamento técnico.
    */

    this.name = this.constructor.name;

    /*
      Error.captureStackTrace(...): É um método nativo do motor V8 (utilizado no Node.js). Ele cria a propriedade .stack no objeto de erro, 
      que contém o histórico de linhas de código por onde a execução passou até o erro estourar.

      Os parâmetros (this, this.constructor): O primeiro argumento indica onde o stack trace deve ser salvo. O segundo argumento 
      diz ao motor para esconder a chamada do próprio construtor do DomainError de dentro do relatório do rastro.

      Raciocínio: Isso limpa o rastro do erro. Quando você olhar o log da aplicação, o rastro de pilha vai apontar exatamente para 
      a linha do seu caso de uso que disparou o throw new DomainError(), e não para a linha interna deste arquivo de infraestrutura, 
      tornando o debug muito mais produtivo.
    */

    Error.captureStackTrace(this, this.constructor);
  }
}
