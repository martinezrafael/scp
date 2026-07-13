/*
  Raciocínio: Importa o "contrato" (a tomada) que definimos no arquivo anterior. O uso do type avisa ao 
  TypeScript que essa importação serve apenas para checagem de tipos e sumirá quando o código for convertido para JavaScript puro.
*/

import type { UserRepository } from "../ports/user.repository.js";

/*
  Raciocínio: Importa a regra de domínio do Usuário. É dela que vamos herdar a capacidade de criar um usuário válido.
*/

import { User } from "../domain/user.aggregate.js";

/*
  Raciocínio: Cria um "molde" (DTO - Data Transfer Object) para os dados que este caso de uso precisa receber para funcionar.
   Ele diz: "Para me executar, você é obrigado a me passar um email (texto) e opcionalmente um name (que pode ser texto, inexistente ou indefinido)".
*/

type Input = {
  email: string;
  name?: string | undefined;
};

/*
  Raciocínio: Cria e exporta a classe que conterá a lógica do caso de uso. Usar classes aqui facilita a injeção de dependências no construtor.
*/

export class RegisterUserUseCase {
  /*
    Raciocínio (O mais importante da arquitetura): Aqui acontece a Inversão de Dependência. Em vez do caso de uso dar um 
    new PrismaRepository() lá dentro dele (o que o prenderia a um banco de dados), ele diz: "Quem me instanciar vai ter que 
    me dar um repositório pronto que siga o contrato UserRepository".

    private: Transforma users em uma propriedade interna da classe.

    readonly: Garante que, uma vez recebido esse repositório, ninguém possa trocá-lo por outro no meio da execução.
  */

  // Inversão de dependência: recebemos a porta no construtor
  constructor(private readonly users: UserRepository) {}

  /*
    Raciocínio: Define a função principal que executa a ação de cadastro. Ela é async (assíncrona) porque vai precisar 
    esperar respostas que vêm de fora (banco de dados). Ela recebe o input seguindo o molde que definimos lá em cima.
  */

  async execute(input: Input) {
    /*
      Raciocínio: O gerente aciona a tomada (this.users) e diz: "Busque no banco se já existe alguém com o email que o usuário enviou".
      O await trava o código ali até o banco responder.
    */

    // 1. Regra de Negócio: Email deve ser único
    const existing = await this.users.findByEmail(input.email);

    /*
      Raciocínio: Se o banco trouxe um usuário (ou seja, existing não é nulo), significa que o e-mail já está em uso. 
      O sistema imediatamente joga um erro na tela (throw new Error) e a execução para por aqui.
    */

    if (existing) {
      throw new Error("User already exists");
    }

    /*
      Raciocínio: Se passou no teste do e-mail, agora criamos o usuário. Repare que não fazemos new User(). Chamamos um método de fábrica (User.register).

      crypto.randomUUID(): Gera um ID universal único (ex: f81d4fae-7dec-11d0-a765-00a0c91e6bf6) nativamente no Node.js/JavaScript, 
      garantindo que o ID seja gerado pela aplicação, e não pelo banco de dados.
    */

    // 2. Criação da entidade através do Aggregate do Domínio
    const user = User.register({
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
    });

    /*
      Raciocínio: Com a entidade user criada com sucesso na memória, o gerente chama a porta novamente: "Toma esse usuário pronto e salva ele 
      onde quer que você salve as coisas". Novamente, usamos await para garantir que o código só continue após a confirmação de que foi salvo.
    */

    // 3. Persistência abstrata
    await this.users.save(user);

    /*
      Raciocínio: Por fim, devolvemos uma resposta limpa para quem chamou o caso de uso. Não devolvemos o objeto User inteiro 
      (que pode ter dados sensíveis como senhas criptografadas), devolvemos apenas um resumo com o id e o email confirmando o sucesso do cadastro.
    */

    // 4. Retorno limpo (DTO de saída)
    return {
      id: user.id,
      email: user.email,
    };
  }
}
