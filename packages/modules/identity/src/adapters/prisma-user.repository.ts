/*
  O que faz: Importa a instância global do Prisma Client configurada no pacote de banco de dados, 
  a interface (port) UserRepository e a classe de domínio User.

  O raciocínio: Esta classe é um Adapter. Ela serve como a "ponte" de ligação que traduz as necessidades 
  do nosso domínio para a tecnologia específica do ORM (Prisma). Ela precisa da interface para garantir que 
  está cumprindo o contrato do sistema e do User para saber como transformar os dados.
*/

import { prisma } from '../../../../db/src/index.js';
import type { UserRepository } from '../ports/user.repository.js';
import { User } from '../domain/user.aggregate.js';

/*
  O que faz: Declara a classe PrismaUserRepository implementando a assinatura definida pela UserRepository.

  O raciocínio: Princípio de Inversão de Dependência (DIP). O caso de uso da aplicação não sabe que o Prisma existe; 
  ele apenas chama o método `findByEmail` definido na interface. Quem se preocupa em como ir ao banco de dados 
  buscar esse usuário de verdade é esta classe aqui.
*/

export class PrismaUserRepository implements UserRepository {
  /*
    O que faz: Implementa o método de busca por e-mail. Ele faz uma query direta no banco de dados usando o Prisma 
    e, se encontrar o registro, o transforma de volta em um objeto de domínio (User).

    O raciocínio: Isolamento de Infraestrutura. O banco de dados retorna um formato de dados genérico (record). 
    A aplicação não pode trabalhar com esse formato puro do Prisma. Por isso, usamos o método de fábrica `User.restore()` 
    para converter os dados primitivos em um Aggregate de domínio rico e protegido novamente.
  */

  async findByEmail(email: string): Promise<User | null> {
    // Busca o registro único no PostgreSQL através do Prisma Client
    const record = await prisma.user.findUnique({ where: { email } });

    // Se o usuário não existir no banco, retorna null seguindo o contrato da interface
    if (!record) return null;

    /* 
      Hidratação/Restauração do Aggregate de Domínio:
      Transforma as colunas da tabela do banco de dados de volta no objeto de regras de negócio.
    */
    return User.restore({
      id: record.id,
      email: record.email,
      name: record.name ?? undefined, // Garante compatibilidade de null do banco para undefined do TypeScript
      emailVerified: record.emailVerified,
    });
  }

  /*
    O que faz: Implementa o método de salvamento. Ele envia o estado atual do Aggregate `User` da memória 
    para ser persistido de forma definitiva no banco de dados através da operação `upsert`.

    O raciocínio: Idempotência de Persistência. Em vez de criarmos métodos separados para salvar e atualizar, 
    o padrão Repository costuma abstrair isso no método `save()`. O comando `upsert` do Prisma verifica se o `id` 
    já existe: se sim, ele atualiza as propriedades modificadas (`update`); se não, ele insere um novo registro (`create`).
  */

  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      // Critério de busca: localiza o registro pelo ID único do Aggregate
      where: { id: user.id },
      
      // Caso o usuário já exista, atualiza as colunas com os valores atuais dos Getters do domínio
      update: {
        email: user.email,
        name: user.name ?? null, // 👈 Tratamento para exactOptionalPropertyTypes: converte undefined em null
        emailVerified: user.emailVerified,
      },
      
      // Caso seja um usuário novo, cria a linha com todos os dados iniciais vindo do domínio
      create: {
        id: user.id,
        email: user.email,
        name: user.name ?? null, // 👈 Tratamento para exactOptionalPropertyTypes: converte undefined em null
        emailVerified: user.emailVerified,
      },
    });
  }
}