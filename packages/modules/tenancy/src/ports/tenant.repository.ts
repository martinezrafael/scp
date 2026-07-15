
/*
  O que ela faz: Importa a entidade (ou Aggregate) Tenant da pasta de domínio.

  O raciocínio lógico: Para que o nosso repositório possa salvar uma "empresa/inquilino", ele precisa primeiro saber o que 
  é um Tenant (quais propriedades ele tem, como id, name, slug, etc.). Essa linha traz essa definição do coração do software (o domínio) 
  para que possamos usá-la como um tipo de dado.
*/


import { Tenant } from '../domain/tenant.aggregate.js';


/*
  O que ela faz: Cria e exporta uma interface chamada TenantRepository.

  O raciocínio lógico: O export permite que esse arquivo seja usado por outros arquivos do projeto (como o nosso caso de uso). 
  A palavra-chave interface não gera código javascript no final; ela serve como um contrato de desenvolvimento.

  A lógica aqui é: "Qualquer classe que quiser ser um repositório de Tenants no nosso sistema (seja usando Postgres, MongoDB ou 
  até mesmo salvando na memória para testes) terá que seguir a estrutura que vou definir dentro destas chaves {}".

*/

export interface TenantRepository {

  /*
  O que ela faz: Declara que quem implementar essa interface deve ter uma função chamada save.

  O raciocínio lógico (dividido em partes):

  save(...): O nome da função deixa claro o seu objetivo único (salvar).

  tenant: Tenant: A função exige receber um parâmetro obrigatório. Esse parâmetro precisa ser, obrigatoriamente, um objeto do tipo Tenant 
  (aquele que importamos na linha 1). Você não pode passar uma string ou um número aqui; tem que ser o objeto completo da empresa.

  : Promise<void>: Como operações de banco de dados envolvem rede e disco, elas são assíncronas. Portanto, a função
    retorna uma promessa (Promise). O void significa "vazio", ou seja, quando a promessa for resolvida com 
    sucesso, ela não retornará nenhum dado de volta, apenas confirmará que a gravação foi concluída sem erros.
  */


  save(tenant: Tenant): Promise<void>;
}