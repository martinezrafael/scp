/*
  Raciocínio:

  export: Torna essa interface pública para que outros arquivos e módulos da aplicação possam importá-la e usá-la.

  interface: Em TypeScript, uma interface é um contrato estrutural. Ela não contém código executável (não cria tabelas nem executa queries), 
  apenas define a forma e as regras que uma classe real terá que seguir.

  IdempotencyRepository: É o nome do padrão de projeto (Repository Pattern). Ele isola a regra de negócio do banco de dados real 
  (Prisma, Redis, Postgres, etc.).
*/

export interface IdempotencyRepository {

  /*
    Raciocínio Lógico (Consulta):

    O objetivo: Antes de processar uma requisição crítica (como cobrar um cartão), o sistema precisa perguntar ao banco: "Essa operação já foi 
    executada antes?".

    key: string: O identificador único da requisição (ex: "req_123abc"). É o parâmetro de busca.

    Promise<...>: Operações de banco de dados são assíncronas (I/O). O código precisa aguardar a resposta sem travar a execução do servidor.

    unknown | null:

    unknown: Se a chave for encontrada, significa que a requisição já rodou no passado. O método devolve a resposta que foi 
    salva naquela ocasião. Usamos unknown porque a resposta pode ser qualquer tipo de dado JSON (um objeto de pagamento, um status HTTP, etc.), 
    trazendo segurança de tipos sem engessar a estrutura.

    null: Se a chave não for encontrada, significa que é a primeira vez que essa requisição está rodando.
  */

  find(key: string): Promise<unknown | null>;

  /*
    Raciocínio Lógico (Persistência):

    O objetivo: Após executar uma operação inédita com sucesso, o sistema precisa gravar o resultado no banco de dados para consultas futuras.

    key: string: A chave única que será associada a essa operação.

    response: unknown: O resultado da operação que você deseja guardar (ex: o payload JSON com o recibo do pagamento) para responder 
    igualzinho se o cliente tentar de novo.

    Promise<void>: Também é uma operação assíncrona, mas o void indica que ela não precisa retornar nenhum dado após ser concluída 
    basta confirmar que o salvamento funcionou sem erros.
  */

  save(key: string, response: unknown): Promise<void>;
}