
/*
  import { Injectable, ... }: Importa o decorador que transforma essa classe em um provedor que pode ser gerenciado e injetado 
  pelo sistema de Injeção de Dependência do NestJS.

  ..., UnauthorizedException }: Importa uma classe de erro padrão do NestJS que gera automaticamente uma resposta HTTP com o status 401 
  (Unauthorized) estruturada em JSON para o cliente.
*/


import { Injectable, UnauthorizedException } from '@nestjs/common';

/*
  import type { ... }: Uma sintaxe especial do TypeScript (exigida pela regra verbatimModuleSyntax do seu projeto). Ela indica que essas 
  duas palavras existem apenas como tipos/interfaces e desaparecerão por completo quando o código for convertido para JavaScript puro.

  CanActivate: A interface que define a estrutura obrigatória que um Guard precisa ter.

  ExecutionContext: O objeto que encapsula todos os dados da requisição e do ciclo de vida atual da execução.
*/


import type { CanActivate, ExecutionContext } from '@nestjs/common';

/*
  @Injectable(): Diz ao NestJS: "Acompanhe esta classe, ela pode ser usada em módulos e injetada onde for necessário".

  export class TenantGuard: Cria e exporta a classe TenantGuard.

  implements CanActivate: Funciona como um contrato rigoroso. Ao colocar isso, o TypeScript obriga você a criar uma função 
  chamada canActivate dentro da classe. Se você não criar, o código não compila.
*/

@Injectable()
export class TenantGuard implements CanActivate {

  /*
    canActivate(...): É o método que o NestJS chama automaticamente antes de permitir o acesso à rota.

    context: ExecutionContext: Este parâmetro traz consigo informações ricas sobre a execução atual (se a requisição veio 
    via HTTP Rest, GraphQL, WebSockets ou RPC).

    : boolean: Indica que esta função deve, obrigatoriamente, responder com true (permitir o acesso à rota) ou false / 
    disparar um erro (bloquear o acesso).
  */

  canActivate(context: ExecutionContext): boolean {
    /*
      context.switchToHttp(): Como o contexto pode ser qualquer protocolo (WebSockets, RPC, etc.), essa função diz especificamente: 
      "Quero tratar esse contexto como uma requisição HTTP tradicional".

      .getRequest(): Extrai de dentro do contexto HTTP o objeto nativo da requisição (o famoso req do Express). A partir daqui, 
      temos acesso a cabeçalhos, cookies, corpo da requisição, etc.
    */
    const request = context.switchToHttp().getRequest();
    /*
      Raciocínio: Busca dentro do objeto de cabeçalhos (headers) enviados pelo Front-end/Cliente um cabeçalho customizado chamado x-tenant-id. 
      Ele dita qual o ID da empresa ou do ambiente isolado que está fazendo a chamada.
    */
    const tenantId = request.headers['x-tenant-id'];
    /*
      Raciocínio: Tenta obter a propriedade user da requisição. Essa propriedade normalmente é injetada por um Guard de Autenticação 
      (como um AuthGuard de JWT) que roda antes deste Guard.
    */
    const user = request.user;
    /*
      if (!tenantId || !user?.id): Verifica logicamente se pelo menos um dos dois dados críticos está faltando.

      Se não houver tenantId no cabeçalho OU se o objeto user não existir (ou existir, mas não tiver uma propriedade id), a condição se torna verdadeira.

      throw new UnauthorizedException(...): Se a condição acima for verdadeira, o código interrompe imediatamente o fluxo e lança a exceção 401. 
      O usuário recebe na tela uma resposta de erro e não ganha acesso à API.
    */
    if (!tenantId || !user?.id) {
      throw new UnauthorizedException('Tenant ID ou Usuário não identificado.');
    }
    /*
      request.tenant = { ... };: Injeta uma propriedade nova chamada tenant direto no escopo desta requisição específica.

      tenantId: String(tenantId): Garante que o ID do inquilino seja tratado estritamente como um texto (string), prevenindo problemas de tipagem.

      userId: user.id: Transfere o ID do usuário autenticado para o contexto unificado do Tenant.

      role: user.role || 'user': Atribui a regra/cargo do usuário. Caso a propriedade role venha vazia por algum motivo, 
      o operador || atribui um valor padrão de segurança: 'user' (com permissões mínimas).
    */
    request.tenant = {
      tenantId: String(tenantId),
      userId: user.id,
      role: user.role || 'user',
    };
    /*
      return true;: Informa ao NestJS que a validação foi um sucesso total. O Guard libera o caminho e a requisição pode avançar para o 
      Controller, levando consigo o objeto request.tenant preenchido de forma limpa e segura.
    */
    return true;
  }
}