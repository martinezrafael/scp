/*
  import type { DomainEvent }: Importa a interface do evento que analisámos antes. O uso da palavra type é uma otimização do 
  TypeScript: avisa o compilador de que estamos a importar apenas uma definição de tipo (um contrato), 
  e não código executável.

  import { Entity }: Importa a classe base Entity. Como a Raiz do Agregado também é uma entidade 
  (ela precisa de um ID único), ela vai herdar tudo o que a Entity já faz.
*/

import type { DomainEvent } from "./domain-event.js";
import { Entity } from "./entity.js";

/*
  export abstract class AggregateRoot<Props>: Define uma classe abstrata (um molde que não pode ser instanciado diretamente) 
  chamada AggregateRoot que aceita propriedades genéricas (Props).

  extends Entity<Props>: Aqui acontece a herança. Significa que o AggregateRoot ganha automaticamente o ID imutável (id), 
  a lógica de comparação (equals) e o objeto de propriedades (props) que decifrámos na primeira task.
*/

export abstract class AggregateRoot<Props> extends Entity<Props> {
  /*
    private: Esta propriedade é estritamente secreta. Ninguém fora desta classe (nem mesmo as classes que herdarem dela) 
    pode ler ou modificar esta lista diretamente. Isso protege o estado do objeto.

    domainEvents: DomainEvent[]: Define que a variável é um array (uma lista) que só aceita objetos que sigam 
    o contrato da interface DomainEvent.

    = [];: Inicializa a propriedade como um array vazio. Esta é a famosa "sacola de eventos". Sempre que algo importante 
    acontecer no negócio, o aviso vai para aqui para dentro.
  */

  private domainEvents: DomainEvent[] = []; // A sacola de eventos privada

  /*
    protected: Este método só pode ser chamado por quem herdar de AggregateRoot. O mundo exterior (como um controlador da API) não 
    pode disparar eventos para dentro do agregado à força.

    addDomainEvent(event: DomainEvent): Recebe o evento que acabou de acontecer.

    : void: Significa que o método faz uma ação mas não devolve nenhuma resposta (não há return).

    this.domainEvents.push(event);: Pega no evento recebido e coloca-o no fim da nossa lista privada ("guarda o aviso na sacola").
  */

  // o "Chefe" adiciona um aviso na sacola
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /*
    pullDomainEvents(): DomainEvent[]: Este método é público (padrão quando não escrevemos nada antes dele). O sistema (normalmente a 
    camada que salva os dados no banco, chamada Repositório) vai chamar este método para recolher os avisos e despachá-los para o 
    resto do ecossistema. Ele promete devolver um array de eventos.

    const events = [...this.domainEvents];: Aqui é usada a sintaxe Spread (...). Em vez de apenas passar a lista original, o código cria uma cópia idêntica da 
    lista de eventos atual e guarda-a na constante events.

    Porquê o raciocínio da cópia? Se passássemos a lista original por referência e a limpássemos logo a seguir, correríamos o risco 
    de apagar os dados antes de eles serem lidos.

    this.domainEvents = [];: Limpa imediatamente a sacola privada, voltando a deixá-la vazia. Raciocínio lógico crucial: Isto evita que o mesmo evento seja disparado duas vezes (duplicidade) se o método for chamado novamente por engano.

    return events;: Devolve a cópia dos eventos que estavam guardados para que o sistema os envie para os 
    serviços responsáveis (como enviar e-mails, notificações, etc.).
  */

  // O sistema vem, pega todos os avisos da sacola para disparar e limpa ela
  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = []; // Limpa a sacola para não duplicar envios
    return events;
  }
}
