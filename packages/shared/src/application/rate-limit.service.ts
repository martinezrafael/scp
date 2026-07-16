/*
  Raciocínio: O interface define um contrato para a camada de dados (banco de dados ou memória). Ele não executa código, apenas dita a regra: 
  "Quem quiser ser um repositório de Rate Limit para este sistema, precisa obrigatoriamente ter os métodos listados aqui". 
  Geralmente, na prática, isso é implementado usando o Redis por conta da velocidade e suporte nativo a expiração de chaves.
*/

export interface RateLimitRepository {

  /*
    Raciocínio: Esta é a assinatura do método do repositório.

    key: A chave única que identifica quem está fazendo a requisição (pode ser o IP do usuário ou o ID dele).

    ttlSeconds: Significa Time To Live (Tempo de Vida) em segundos. É o tempo que essa contagem vai valer antes de zerar (ex: 60 segundos).

    Promise<number>: Como operações de banco de dados são assíncronas, ele promete devolver um número (o valor atual do contador após o incremento).
  */

  increment(key: string, ttlSeconds: number): Promise<number>;
}

/*
  Raciocínio: Cria a classe de serviço que conterá a regra de negócio do limite de requisições. O export permite 
  que este serviço seja usado em outras partes do sistema (como nos Controllers/Middlewares da API).
*/

export class RateLimitService {

  /* 
    Raciocínio: Aqui é aplicada a técnica de Injeção de Dependência.

    O serviço não cria o repositório lá dentro; ele recebe um repositório pronto que siga o contrato da RateLimitRepository através do construtor.

    O private readonly faz com que o TypeScript automaticamente crie uma propriedade interna na classe chamada this.repo, que não 
    pode ser modificada depois de criada.
  */

  constructor(private readonly repo: RateLimitRepository) {}

  /*
    Raciocínio: Define o método principal do serviço. O nome assertAllowed significa "garanta que é permitido".

    Ele é async (assíncrono) porque vai esperar uma resposta do banco de dados/Redis.

    Recebe a key (quem), o limit (quantas requisições são permitidas) e o ttlSeconds (em quanto tempo a janela de tempo fecha).

    Retorna Promise<void> (nada), porque a função só serve para validar. Se estiver tudo bem, ela termina em silêncio.  
  */

  async assertAllowed(key: string, limit: number, ttlSeconds: number): Promise<void> {

    /*
      Raciocínio: Esta linha faz duas coisas de forma atômica no banco/Redis:

      Se a key não existia, ela é criada com o valor 1 e o tempo de expiração (ttlSeconds). Se já existia, o valor atual aumenta em +1.

      O await espera essa operação terminar e guarda o número atualizado na constante count.

      Exemplo: Se o limite é 5 e é a terceira vez que o usuário acessa, count passa a valer 3.
    */

    const count = await this.repo.increment(key, ttlSeconds);

    /*
      Raciocínio: Faz a verificação lógica de segurança. Ela compara o número atual de requisições que o usuário fez 
      (count) com o limite máximo permitido pelo sistema (limit).
    */
    if (count > limit) {
      /*
        Raciocínio: Se o count for maior que o limit (por exemplo, 6 de 5 permitidas), o bloco do if é executado. O throw new Error 
        interrompe o fluxo da aplicação na hora, impedindo que a requisição do usuário prossiga para o resto do sistema.
      */
      throw new Error('Rate limit exceeded');
    }
  }
}