/*
  export type Result: Cria e exporta um tipo customizado chamado Result.

  <T, E = Error>: Define dois parâmetros de tipo genéricos (Generics):

    T: Representa o tipo do dado em caso de sucesso (ex: User, number, string).

    E = Error: Representa o tipo em caso de falha. O = Error é um valor padrão; se você não especificar o tipo do erro, 
    o TypeScript assume que é o Error padrão do JavaScript.

  O operador | (OU): Este é o coração da lógica. Ele diz que um Result nunca será as duas coisas ao mesmo tempo. 
  Ou ele é o bloco da esquerda (Sucesso) OU ele é o bloco da direita (Falha).

  { ok: true; value: T } (Bloco de Sucesso): Se a propriedade ok for estritamente true, o TypeScript garante que a 
   propriedade value estará disponível com o tipo T.

  { ok: false; error: E } (Bloco de Falha): Se a propriedade ok for false, o value deixa de existir e a propriedade error aparece com o tipo E.

*/

// Ou o resultado é Sucesso (ok: true com um valor) ou Falha (ok: false com um erro)
export type Result<T, E = Error> =
  { ok: true; value: T } | { ok: false; error: E };

/*
  export const ok: Cria uma função de seta (arrow function) chamada ok.

  <T>(value: T): É uma função genérica que aceita qualquer valor de sucesso e descobre o tipo dele automaticamente.

  : Result<T>: Diz que o retorno dessa função será obrigatoriamente um Result do tipo do valor passado.

  => ({ ok: true, value }): Retorna o objeto formatado. Os parênteses por fora das chaves ({ ... }) são um atalho do JavaScript para dizer: "Retorne este objeto imediatamente, sem precisar escrever a palavra return".
*/

// Funções utilitárias para facilitar a escrita:
export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

/*
  export const fail: Cria a função para instanciar uma falha.

  <E = Error>(error: E): Recebe o erro ocorrido (pode ser uma string, um objeto de erro, etc.).

  : Result<never, E>: Preste atenção no never. No TypeScript, never significa "algo que nunca vai acontecer". Como esta é uma função 
  estritamente de falha, ela avisa ao compilador: "O valor de sucesso (T) deste resultado específico é never (nunca vai existir), 
  focando apenas no erro E".

  => ({ ok: false, error }): Retorna o objeto de erro formatado com a etiqueta ok: false.
*/

export const fail = <E = Error>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
