/*
  O que faz: Importa a classe especializada PostgreSqlContainer da biblioteca do Testcontainers.

  Raciocínio lógico: Em vez de usarmos uma classe genérica de container do Docker e configurarmos variáveis de ambiente do Postgres na mão 
  (como POSTGRES_DB, POSTGRES_PASSWORD, portas, etc.), essa classe específica já traz todas as boas práticas e 
  pré-configurações do PostgreSQL embutidas.
*/
import { PostgreSqlContainer } from '@testcontainers/postgresql';


/*
  O que faz: Exporta uma função para ser usada em outros arquivos e a marca como async (assíncrona).

  Raciocínio lógico:

  export: Torna a função reutilizável na suíte de testes (ex: no setup do Vitest ou Jest).

  async: Subir um container envolve operações I/O do mundo real: baixar imagem do Docker (se não existir), alocar recursos, iniciar o processo do 
  banco e aguardar a porta estar pronta para conexões. Como isso leva alguns segundos e não é instantâneo, a função precisa retornar uma Promise 
  (daí o async).
*/

export async function startPostgresTestContainer() {

  /*
    Aqui acontecem duas etapas conectadas:

    new PostgreSqlContainer('postgres:16') (Instanciação):

    Raciocínio: Instancia o objeto de configuração informando a imagem oficial do Docker (postgres:16). Isso garante que seus testes rodarão 
    exatamente na mesma versão do PostgreSQL que você usa em produção.

    .start() (Execução do ciclo de vida):

    Raciocínio: É onde a mágica do Testcontainers acontece na prática. Ao chamar .start(), a biblioteca realiza em segundo plano:

    - Conecta no daemon do Docker da sua máquina.

    - Mapeia as portas internas do Postgres (5432) para uma porta aleatória disponível na sua máquina (evitando conflitos de porta se você 
    já tiver outro Postgres rodando).

    - Inicia o container e espera o PostgreSQL estar totalmente pronto para aceitar conexões (healthcheck automático).

    return (Retorno da instância ativa):

    Raciocínio: Retorna a Promise da instância do container já em execução. Quem chamar essa função receberá um objeto contendo métodos 
    úteis para o teste, como:

    .getConnectionString() (para passar a URL de conexão para o Prisma/ORM).

    .stop() (para destruir o container ao final dos testes).
  */

  return new PostgreSqlContainer('postgres:16').start();
}