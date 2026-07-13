/*

  ### `export class Email {`

  * **O que faz:** Declara uma classe chamada `Email` e a exporta para que possa ser usada em outros arquivos do projeto.
  * **O raciocínio:** No DDD, não queremos usar strings puras para coisas importantes. Criamos uma classe para dar "superpoderes" e regras a esse dado.

*/

export class Email {
  /*
    ### `private constructor(public readonly value: string) {}`

    * **O que faz:** Define o construtor da classe como **`private`** (privado) e recebe uma propriedade chamada `value` que é **`readonly`** 
    (só de leitura).

    * **O raciocínio (O mais importante do arquivo):** Ao colocar `private` antes de `constructor`, você **proíbe** qualquer pessoa de 
    fazer isso fora daqui: `const email = new Email("qualquer_coisa")`. O compilador vai dar erro.

    *Por que fazer isso?* Para garantir que ninguém crie um e-mail sem passar pelas validações. A única forma de criar esse objeto será 
    chamando o método `create` que está logo abaixo. O `readonly` garante que, uma vez criado com sucesso, ninguém consiga alterar 
    o valor do e-mail (imutabilidade).

  */

  // Construtor privado: impede a criação de um e-mail sem passar pela validação do método 'create'
  private constructor(public readonly value: string) {}

  /*
      ### `static create(value: string): Email {`

    * **O que faz:** Cria um método estático chamado `create`, que recebe uma string qualquer e promete retornar um objeto do tipo `Email`.
    * **O raciocínio:** Como o construtor é privado, precisamos de uma "porta de entrada" pública. Por ser `static`, você pode chamá-lo 
    * direto pela classe, assim: `Email.create("seu@email.com")`. Ele funciona como uma portaria/alfândega do seu dado.


      ### `const normalized = value.trim().toLowerCase();`

      * **O que faz:** Pega o texto que o usuário digitou e faz duas limpezas:
      1. `.trim()`: Remove espaços inúteis no início e no fim (ex: `"  Dev@teste.com "` vira `"Dev@teste.com"`).
      2. `.toLowerCase()`: Transforma todas as letras em minúsculas (ex: `"Dev@teste.com"` vira `"dev@teste.com"`).


      * **O raciocínio:** **Normalização.** Computadores diferenciam maiúsculas de minúsculas. Se você não fizer isso, 
      `User@Gmail.com` e `user@gmail.com` seriam tratados como dois e-mails diferentes no banco de dados, o que geraria bugs de duplicidade.
  
  */

  static create(value: string): Email {
    // Normalização: remove espaços nas pontas e transforma em minúsculas
    const normalized = value.trim().toLowerCase();

    /*
        ### `if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {`

      * **O que faz:** Valida se a string limpa (`normalized`) segue o padrão visual de um e-mail usando uma Expressão Regular (Regex).
      * **O raciocínio lógico da Regex:**
      * `^` e `$` indicam que a validação deve testar o texto do início ao fim.
      * `[^\s@]+` significa: "precisa ter um ou mais caracteres que **não** sejam espaço em branco (`\s`) e **não** sejam 
      * arroba (`@`)". (A parte antes do arroba).
      * `@` significa: "obrigatoriamente precisa ter um arroba aqui".
      * `[^\s@]+\.[^\s@]+` significa: "depois do arroba, precisa ter um texto, seguido de um ponto final (`\.`), 
      * seguido de outro texto" (ex: `gmail.com`).
      * O `!` no início inverte o resultado: *"Se o texto **NÃO** passar no teste da Regex..."*
    */

    // Validação: Regex simples para checar o formato padrão de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      /*
          ### `throw new Error("Invalid email");`

        * **O que faz:** Dispara um erro interrompendo imediatamente a execução do código caso a validação da linha anterior falhe.
        * **O raciocínio:** **Defesa do Domínio.** Se o e-mail for inválido (como `banana`, ou `joao@com`), o sistema "explode" um erro na hora. 
        * O código não continua e o objeto inválido nunca é criado. Isso blinda sua aplicação.
      
      */

      throw new Error("Invalid email");
    }

    /*
      ### `return new Email(normalized);`

      * **O que faz:** Se o código chegou até aqui, significa que o e-mail passou na validação. O método então usa o construtor privado 
      (que ele tem acesso por estar dentro da própria classe) para criar e retornar a instância oficial do `Email` com o texto limpo.

      * **O raciocínio:** Sucesso! Agora você tem a garantia matemática e lógica de que esse objeto contém um e-mail limpo e válido.
    */

    return new Email(normalized);
  }
}
