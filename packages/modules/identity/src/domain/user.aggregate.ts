/*
  O que faz: Importa a classe base de arquitetura (AggregateRoot) que está na pasta shared e o 
  Value Object Email que criamos antes.

  O raciocínio: O User precisa herdar comportamentos genéricos de um agregado (como a capacidade 
  de guardar eventos) e precisa do validador de e-mail para proteger suas propriedades.
*/

import { AggregateRoot } from "../../../../shared/src/domain/aggregate-root.js";
import { Email } from "./email.vo.js";

/*
  O que faz: Define um tipo TypeScript que lista todas as propriedades internas que um Usuário possui: um e-mail 
  (que obrigatoriamente é do tipo Email e não string), um nome opcional (name?), e um booleano dizendo se o e-mail foi verificado.

  O raciocínio: No DDD, propriedades de um agregado ficam "escondidas" dentro de um objeto de propriedades (props). Isso impede que 
  códigos de fora alterem o nome ou o e-mail do usuário diretamente sem passar pelas regras da classe.
*/

type UserProps = {
  email: Email;
  name?: string | undefined;
  emailVerified: boolean;
};

/*
  O que faz: Declara a classe User herdando as capacidades de AggregateRoot e passando as propriedades que definimos acima (UserProps).

  O raciocínio: Ao estender AggregateRoot, a classe User ganha superpoderes automáticos da sua infraestrutura, 
  como um campo id único e métodos para gerenciar eventos de domínio (como o addDomainEvent).
*/

export class User extends AggregateRoot<UserProps> {
  /*
    O que faz: Cria um método estático de fábrica (Factory Method) chamado register. Ele recebe um ID, uma string de e-mail e um nome opcional.

    O raciocínio: Design Direcionado à Linguagem Ubíqua. Em vez de usar um genérico new User(), usamos User.register(). Isso deixa 
    claro para qualquer desenvolvedor (e até para o pessoal de negócios) que este método executa a ação de Registrar um Usuário 
    com todas as suas regras iniciais.
  */

  // Ponto único de entrada para cadastrar um usuário
  static register(params: { id: string; email: string; name?: string }) {
    /*
      O que faz: Cria a instância real do usuário na memória, preenchendo suas propriedades.

      O raciocínio das Regras de Negócio embutidas:

      Email.create(params.email): O usuário não aceita o e-mail de qualquer jeito. Ele força a string a passar pela alfândega do Email.create 
      que limpamos e validamos antes. Se o e-mail for inválido, o cadastro "morre" aqui.

      emailVerified: false: Esta é uma regra de negócio pura. O sistema determina que todo usuário registrado começa com o e-mail não verificado. 
      Ninguém pode criar um usuário maliciosamente com emailVerified: true direto no cadastro.
    */

    const user = new User(params.id, {
      email: Email.create(params.email), // Valida o e-mail aqui dentro automaticamente
      name: params.name,
      emailVerified: false, // Regra de Negócio: Todo usuário nasce com e-mail deslogado/não verificado
    });

    /*
      O que faz: Registra internamente no objeto do usuário que um fato histórico aconteceu: "UserRegistered" (Usuário Cadastrado). 
      Ele gera um ID para o evento, carimba a data/hora atual e anexa os dados básicos necessárias (o ID e o e-mail do usuário).

      O raciocínio: Arquitetura Orientada a Eventos. O agregado do usuário não deve se preocupar em enviar e-mails de boas-vindas ou criar 
      registros no CRM. Ele simplesmente grita para o sistema: "Eu nasci, e meus dados são esses!". Outras partes do 
      sistema vão ouvir esse grito (evento) e disparar as ações secundárias de forma totalmente desacoplada.
    */

    // Emite o evento de domínio para avisar outros módulos (ex: microsserviço de e-mail)
    user.addDomainEvent({
      eventId: crypto.randomUUID(),
      eventName: "UserRegistered",
      occurredAt: new Date(),
      aggregateId: user.id,
      payload: {
        userId: user.id,
        email: user.props.email.value,
      },
    });

    /*
      O que faz: Retorna a instância do usuário criada, validada e com o evento anexado.

      O raciocínio: Conclusão do fluxo de fábrica. Quem chamou o User.register() agora tem em mãos um objeto 100% consistente pronto para ser salvo
      no banco de dados.
    */

    return user;
  }

  /*
    O que faz: Cria um método de leitura (getter) para expor o e-mail do usuário.

    O raciocínio: Como as propriedades estão protegidas dentro do agregado, se alguém de fora precisar ler o e-mail (por exemplo, 
    para mostrar na tela ou salvar no banco), basta chamar user.email. Repare que ele retorna .props.email.value (a string limpa), 
    escondendo o objeto Email real lá de dentro. É a exposição controlada de dados.
  */

  // Getter controlado para expor apenas o texto do e-mail, protegendo o objeto interno
  get email() {
    return this.props.email.value;
  }
}
