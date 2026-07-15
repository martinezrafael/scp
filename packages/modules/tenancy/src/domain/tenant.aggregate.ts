/*
  O que faz: Importa uma classe genérica chamada AggregateRoot.

  O raciocínio lógico: No DDD, um Aggregate Root (Raiz de Agregação) é uma entidade que funciona como o "portão de entrada"
  do seu microssistema. Ao estender essa classe, nossa classe Tenant ganha superpoderes que toda entidade principal precisa ter, como:

  Ter um identificador único (id).

  Guardar uma lista de eventos que aconteceram com ela (ex: "fui criado", "fui suspenso").

*/

import { AggregateRoot } from "../../../../shared/src/domain/aggregate-root.js";

/*
  O que faz: Cria um tipo TypeScript (TenantProps) que define exatamente quais dados um Tenant precisa ter para existir e funcionar.

  O raciocínio lógico: * Por que usar um tipo separado em vez de colocar direto na classe? 
  Para separar o estado (os dados frios) do comportamento (os métodos e regras da classe).

  Note que o status é estrito: ele só aceita literalmente as strings 'active' ou 'suspended'. 
  Isso evita erros de digitação (como 'ativo' ou 'ativado').

*/

// 1. Definimos o que um Tenant precisa ter
type TenantProps = {
  name: string;
  slug: string; // Ex: "empresa-acme" (usado na URL)
  status: 'active' | 'suspended'; // Regra: Todo tenant começa como 'active'
  ownerId: string; // ID do usuário dono da conta
};

/*
  O que faz: Define a classe Tenant que herda de AggregateRoot, passando as propriedades do Tenant (TenantProps) 
  para a classe pai saber o que gerenciar.

  O raciocínio lógico: Usamos extends para não ter que reescrever toda a lógica de como eventos de domínio
  são armazenados ou como IDs são gerenciados. Herdamos esse comportamento do código compartilhado (shared).
*/

export class Tenant extends AggregateRoot<TenantProps> {

  /*
  
    O que faz: Cria um método estático chamado create. Isso significa que, para criar um tenant, você não vai rodar new Tenant(), 
    mas sim Tenant.create(...).

    O raciocínio lógico: * Se usássemos o construtor padrão (new), qualquer parte do sistema poderia criar um Tenant 
    de qualquer jeito (com dados inválidos, sem status, etc.).

    Ao usar um método estático create, nós criamos uma porta de entrada única e controlada. Só é possível criar um 
    Tenant se você fornecer exatamente os parâmetros que este método exige.
  
  */

  // 2. Método responsável por criar um novo Tenant de forma segura
  static create(params: {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
  }) {

    /*
      O que faz: Cria de fato o objeto Tenant na memória, passando as propriedades.

      O raciocínio lógico: * Perceba uma coisa crucial: quem chamou o método Tenant.create não pôde escolher o status. O parâmetro 
      status não existe nos params do método.

      O próprio domínio define status: 'active'. Esta é uma invariante de negócio (uma regra que não pode ser violada): 
      "Todo novo tenant cadastrado no sistema deve obrigatoriamente iniciar ativo". O código garante isso blindando a criação.
    */

    // Instanciamos o Tenant aplicando a regra: status inicial é sempre 'active'
    const tenant = new Tenant(params.id, {
      name: params.name,
      slug: params.slug,
      ownerId: params.ownerId,
      status: 'active',
    });
    
    /*
      O que faz: Registra internamente dentro da instância do Tenant que o evento "Tenant Criado" aconteceu.

      O raciocínio lógico: * Em sistemas modernos, quando um cliente se cadastra, muitas coisas precisam acontecer: 
      enviar e-mail de boas-vindas, criar uma conta no Stripe (cobrança), preparar o banco de dados dele.

      Se colocássemos todo esse código de e-mail e cobrança dentro do arquivo do Tenant, 
      ele viraria uma bagunça gigante e difícil de testar.

      Em vez disso, o Tenant apenas grita para quem quiser ouvir: "Olha, eu fui criado e esses são os meus dados básicos!". 
      O restante do sistema escuta esse evento e faz as tarefas secundárias de forma totalmente independente (desacoplada).
    */


    // 3. Emitimos um evento avisando o sistema: "Ei, um novo Tenant acabou de ser criado!"
    tenant.addDomainEvent({
      eventId: crypto.randomUUID(),
      eventName: 'TenantCreated',
      occurredAt: new Date(),
      aggregateId: tenant.id,
      payload: {
        tenantId: tenant.id,
        ownerId: params.ownerId,
      },
    });

    /*
      O que faz: Devolve o objeto do Tenant totalmente configurado e com o evento registrado em sua "sacola" de eventos.

      O raciocínio lógico: Quem chamou o Tenant.create(...) agora recebe uma entidade válida, consistente, que segue todas 
      as regras de negócio e está pronta para ser salva no banco de dados por um repositório.
    */

    return tenant;
  }
}