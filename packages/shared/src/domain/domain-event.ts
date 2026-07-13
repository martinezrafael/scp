/*
  export: Torna essa interface pública para que outros arquivos e módulos do projeto possam usá-la como um tipo de dado.

  interface: Palavra-chave do TypeScript que define uma estrutura de contrato para objetos.

  DomainEvent: O nome do contrato. No padrão DDD, um evento de domínio representa algo importante que aconteceu no passado do negócio.
*/

export interface DomainEvent {
  /*
    O código: eventId é uma string (texto).

    O raciocínio lógico: Todo evento gerado no sistema precisa ser único e rastreável. Se o sistema disparar dois avisos de "Pedido Criado", 
    cada aviso terá um eventId diferente (geralmente um UUID/GUID).

    Para que serve: Serve para auditoria e para evitar um problema chamado idempotência (garantir que o sistema não 
    processe o mesmo aviso duas vezes por erro de rede, por exemplo).
  */

  eventId: string; //id único do aviso

  /*
    O código: eventName é uma string.

    O raciocínio lógico: É o "nome do evento" ou a "etiqueta" do que aconteceu. No DDD, usamos sempre o 
    verbo no passado porque um evento é um fato histórico inalterável.

    Exemplos: "OrderCreated", "PaymentApproved", "UserRegistered". Quem estiver ouvindo esse evento vai ler 
    essa string para saber exatamente o que fazer.
  */

  eventName: string; //Ex.: "OrderCreated"

  /*
    O código: occurredAt é um objeto do tipo Date nativo do JavaScript.

    O raciocínio lógico: É a marca temporal (timestamp) exata de quando a ação aconteceu no mundo real.

    Para que serve: Vital para logs, auditorias e para sistemas de Event Sourcing (onde o estado do sistema é reconstruído reexecutando os eventos na ordem cronológica correta).
  */

  occurredAt: Date; // Quando aconteceu

  /*
    O código: aggregateId é uma string.

    O raciocínio lógico: Indica qual entidade principal (o Aggregate Root) deu origem a esse evento.

    Exemplo prático: Se o evento é "OrderCreated" (Pedido Criado), o aggregateId será o ID do Pedido 
    (ex: "order-abc-123"). Se o evento for "ProductPriceChanged", será o ID do Produto. Isso vincula o evento ao seu dono.
  */

  aggregateId: string; // Quem gerou esse evento (ex.: ID do pedido)

  /*
    O código: Record<string, unknown> é uma forma elegante do TypeScript dizer: "Isto é um objeto JavaScript dinâmico, onde as 
    chaves são textos (string) e o valor de cada chave pode ser qualquer coisa (unknown)".

    O raciocínio lógico: Cada evento carrega dados diferentes. O evento de "Pedido Criado" precisa carregar o total do 
    pedido e o ID do cliente. O evento de "Preço Alterado" precisa carregar o preço antigo e o preço novo. Como a interface 
    é genérica para qualquer evento, o payload (a carga útil) aceita qualquer estrutura de dados que venha dentro dele.

    Por que unknown e não any? O unknown é mais seguro que o any. Ele força o desenvolvedor que for ler o evento a 
    verificar ou validar o tipo do dado antes de usá-lo, evitando erros em tempo de execução.
  */

  payload: Record<string, unknown>; // Os dados extras (ex: total do pedido)
}
