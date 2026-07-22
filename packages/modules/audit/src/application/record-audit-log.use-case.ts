// Importa a entidade de domínio AuditLog do arquivo relativo.
// Ela contém a regra de negócio sobre o que é e como se cria um log de auditoria.
import { AuditLog } from '../domain/audit-log.entity.js';

// Define a interface (contrato) do repositório de auditoria.
// A camada de aplicação declara O QUE precisa (um método save), 
// mas não SE IMPORTA em COMO ele será implementado (Postgres, Mongo, Em memória, etc.).
export interface AuditLogRepository {
  // Contrato que exige que o repositório receba um objeto 'AuditLog' e retorne uma Promise vazia (void).
  save(log: AuditLog): Promise<void>;
}

// Declara a classe do Caso de Uso responsável por registrar um log de auditoria.
export class RecordAuditLogUseCase {
  // Construtor que utiliza Injeção de Dependência.
  // 'private readonly logs: AuditLogRepository' recebe a implementação do repositório
  // e cria automaticamente um atributo privado e imutável para a classe usar.
  constructor(private readonly logs: AuditLogRepository) {}

  // Método assíncrono principal que executa o fluxo do caso de uso.
  // Recebe um objeto 'input' com os dados do evento e promete retornar uma Promise contendo a string do ID gerado.
  async execute(input: {
    tenantId: string;                    // ID do tenant (organização/empresa).
    actorId: string;                     // ID do usuário ou sistema que fez a ação.
    action: string;                      // Nome da ação executada (ex: "user.created").
    resourceType: string;                // Tipo do recurso afetado (ex: "User").
    resourceId?: string;                 // (Opcional) ID do recurso específico.
    metadata?: Record<string, unknown>;  // (Opcional) Informações/contexto extra em formato chave-valor.
  }): Promise<string> {
    // 1. Instancia a entidade chamando o método estático do domínio.
    // O domínio se encarrega de gerar o ID único (UUID) e a data/hora atual (createdAt).
    const log = AuditLog.create(input);

    // 2. Persiste o log chamando a abstração do repositório injetado.
    // Usa 'await' pois a operação de escrita em banco de dados é assíncrona.
    await this.logs.save(log);

    // 3. Retorna o ID gerado para que a camada chamadora (Controller, Queue, etc.) possa usá-lo se necessário.
    return log.props.id;
  }
}