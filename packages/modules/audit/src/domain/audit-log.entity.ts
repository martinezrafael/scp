// Define o tipo 'AuditLogProps', que funciona como um "contrato" especificando
// todas as propriedades que um log de auditoria DEVE ter no domínio.
export type AuditLogProps = {
  id: string;                          // Identificador único do registro de log (UUID).
  tenantId: string;                    // ID da empresa/cliente (tenant) onde o evento ocorreu.
  actorId: string;                     // ID do usuário ou sistema que executou a ação.
  action: string;                      // Nome da ação realizada (ex: "user.deleted", "billing.updated").
  resourceType: string;                // O tipo do recurso afetado (ex: "User", "Invoice", "Document").
  resourceId?: string;                 // (Opcional) O ID específico do recurso afetado, caso exista.
  metadata?: Record<string, unknown>;  // (Opcional) Objeto com dados extras/contexto da ação (chave-valor flexível e seguro).
  createdAt: Date;                     // Data e hora exatas em que o log foi criado.
};

// Declaração da classe 'AuditLog', que representa a Entidade de Domínio da auditoria.
export class AuditLog {
  // Construtor da classe.
  // 'public readonly props': cria uma propriedade 'props' visível por fora,
  // mas 'readonly' garante que nenhuma propriedade do log seja alterada após a criação (imutabilidade).
  constructor(public readonly props: AuditLogProps) {}

  // Método estático de criação (Factory Method).
  // Permite criar um AuditLog sem ter que passar 'id' e 'createdAt' manualmente.
  // 'Omit<AuditLogProps, 'id' | 'createdAt'>': cria um tipo baseado em AuditLogProps, mas REMOVE as chaves 'id' e 'createdAt'.
  static create(input: Omit<AuditLogProps, 'id' | 'createdAt'>) {
    // Retorna uma nova instância da classe AuditLog preenchendo as propriedades de forma automática e manual.
    return new AuditLog({
      id: crypto.randomUUID(),  // Gera um UUID v4 único e universal para o log.
      createdAt: new Date(),    // Captura o momento exato (timestamp) da criação do registro.
      ...input,                 // Desestrutura (copia) todas as outras propriedades passadas no 'input' (tenantId, actorId, action, etc).
    });
  }
}