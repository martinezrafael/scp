/*
  import { rolePermissions } ...: Aqui trazemos o objeto real (a tabela que mapeia cargos para permissões). O JavaScript precisa dele 
  rodando no navegador ou no servidor para ler os dados.

  import type { Permission, RoleName } ...: Usamos o type aqui para avisar o compilador: "Estou trazendo o contrato de tipagem". 
  Isso garante que, após o código ser transformado em JavaScript puro, essas duas palavras sumam, deixando o código final mais 
  leve e sem conflitos de escopo.
*/

import { rolePermissions } from '../domain/permission.js';
import type { Permission, RoleName } from '../domain/permission.js';


/*
  export class PolicyEngine: Estamos criando e exportando uma classe chamada PolicyEngine (Motor de Políticas).

  O raciocínio: Usar uma classe cria uma estrutura organizada e expansível. Se no futuro você precisar carregar as permissões 
  de um banco de dados real (em vez de um arquivo estático), você poderá injetar essa conexão dentro dessa mesma classe sem quebrar o resto do sistema.
*/

export class PolicyEngine {
  /*
  can( ... ): Esse é o método (uma função dentro da classe). O nome é super semântico: can significa "pode" em inglês. 
  Leremos isso no código como: policy.can('admin', 'ai.use') ("o admin pode usar IA?").

  role: RoleName: O primeiro parâmetro exige o cargo do usuário. Graças à tipagem RoleName, o TypeScript impede que alguém passe 
  um cargo inexistente (ex: can('super-usuario', ...)) gerando erro antes mesmo do código rodar.

  permission: Permission: O segundo parâmetro exige a ação que o usuário está tentando fazer. Também blindado pelo tipo Permission.

  : boolean: É o contrato de retorno. Essa função é uma pergunta de "Sim ou Não", logo, ela obrigatoriamente tem que devolver 
  true (Verdadeiro / Acesso Permitido) ou false (Falso / Acesso Negado).
  */

  can(role: RoleName, permission: Permission): boolean {

    /*
      rolePermissions[role]: O código acessa o objeto da tabela de permissões usando o cargo recebido como chave.

      Exemplo prático: Se role for 'admin', essa parte isola e captura o array do admin: ['members.invite', 'workflows.create', 'ai.use'].

      .includes(permission): O método .includes() é uma função nativa do JavaScript para arrays. Ela varre a lista que acabamos de capturar procurando se a string exata da permission está lá dentro.

      Continuando o exemplo: Se a permissão solicitada for 'ai.use', o .includes() olha para a lista do admin, encontra o texto lá dentro e responde true. Se a permissão solicitada fosse 'billing.manage', ele não encontraria e responderia false.

      return: Devolve essa resposta final (true ou false) para quem chamou a função.
    */

    return rolePermissions[role].includes(permission);
  }
}