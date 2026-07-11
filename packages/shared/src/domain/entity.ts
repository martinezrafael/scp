// export: Torna essa classe visível e utilizável em outros arquivos do projeto.

/** 
  abstract: Significa que esta é uma classe abstrata. Você não pode criar uma entidade genérica 
  diretamente usando new Entity(...). Ela serve estritamente como um "molde" ou "casca" para outras 
  classes reais herdarem (como User, Product, Order).
**/

// class Entity: Define o nome da classe

/*
  <Props>: É um Generics (tipo genérico). Funciona como um parâmetro de tipo. 
  Isso significa que quem herdar de Entity vai poder definir exatamente qual é o formato 
  dos dados/propriedades daquela entidade específica (por exemplo: um User terá props 
  como { name: string, email: string }).
*/

export abstract class Entity<Props> {
  // Todo mundo que herdar de Entity PRECISA de um ID único e de propriedades (props)

  /*
    protected (no construtor): Restringe quem pode instanciar essa classe. Apenas a própria classe ou as classes filhas 
    (que herdarem dela) podem chamar esse construtor através do comando super(). Isso reforça que ela só serve para ser herdada.
  */

  /*
    public readonly id: string:

    Ao colocar o modificador de acesso (public) direto nos parâmetros do construtor, o TypeScript cria automaticamente uma 
    propriedade na classe com esse nome e já atribui o valor recebido a ela (atalho de sintaxe).

    public: Qualquer parte do código do sistema pode ler o ID dessa entidade.

    readonly: O ID é imutável. Uma vez que a entidade é criada, ninguém pode alterar o seu ID (entidade.id = "novo-id" vai 
    gerar um erro de compilação). No DDD, a identidade de um objeto nunca muda.
  */

  /*
    protected readonly props: Props:

    protected: Diferente do ID, os dados internos (props) só podem ser acessados ou lidos por classes que herdam de Entity. 
    O mundo exterior (uma rota da API, por exemplo) não pode acessar entidade.props diretamente. Isso protege o encapsulamento.

    readonly: Garante que o objeto inteiro de propriedades não seja substituído de uma vez, forçando modificações controladas 
    por métodos específicos se necessário.

    Props: Aplica o tipo genérico que foi passado na Linha 1.
  */

  protected constructor(
    public readonly id: string,
    protected readonly props: Props,
  ) {}

  // Se o ID for igual, a entidade é a mesma. Ponto final.

  /*
    equals(...): É o nome do método usado para comparar se duas entidades são a mesma.

    entity?: O ponto de interrogação indica que este parâmetro é opcional. Você pode passar uma entidade válida, ou pode passar undefined/null.

    : Entity<Props>: O parâmetro recebido para comparação deve ser outra entidade que utilize o mesmo tipo de propriedades.

    : boolean: Indica que o método obrigatoriamente devolve true (verdadeiro) ou false (falso).
  */

  equals(entity?: Entity<Props>): boolean {
    /*
    
    !!entity (Dupla negação/Conversão para Booleano):

    Se o método receber algo nulo ou indefinido (undefined), o JavaScript avaliaria isso como um valor "falso" (falsy). 
    A dupla negação transforma isso estritamente no valor booleano false.

    Raciocínio: Se a entidade que eu passei para comparar não existe (é nula), o código para aqui, não avalia o resto, e já retorna false. 
    Isso evita o famoso erro de tentar ler propriedades de algo nulo (Cannot read properties of undefined).

    entity.id === this.id:

    Se a outra entidade existir (passou na primeira checagem), o código compara o ID dela (entity.id) com o ID da entidade atual que 
    está executando o método (this.id).

    O operador &&:

    Retornará true apenas se a entidade existir E os IDs forem exatamente iguais.
    
    */

    return !!entity && entity.id === this.id;
  }
}
