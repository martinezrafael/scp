export interface IdempotencyRepository {
  find(key: string): Promise<unknown | null>;
  save(key: string, response: unknown): Promise<void>;
}