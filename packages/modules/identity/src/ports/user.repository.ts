/*
  O que faz: Traz para este arquivo a definição de um usuário (User) que está lá na camada de domínio (as regras de negócio puras).

  Raciocínio Lógico: Para o nosso sistema gerenciar usuários, ele precisa saber o que é um usuário e quais dados 
  ele possui (como ID, nome, email). Esse User funciona como a "moeda de troca" oficial da nossa aplicação.
*/

import { User } from "../domain/user.aggregate.js";

/*
  O que faz: Cria e exporta uma interface chamada UserRepository.

  Raciocínio Lógico: Uma interface no TypeScript não executa nenhuma ação, ela não tem código funcional. 
  Pense nela como um contrato de prestação de serviços ou uma planta arquitetônica. Ela diz: "Quem quiser fingir ou 
  ser o repositório de usuários real do sistema, terá que seguir as regras que vou listar aqui dentro".

*/

export interface UserRepository {
  /*
    O que faz: Declara que qualquer banco de dados integrado ao sistema precisa saber buscar um usuário pelo email.

    Raciocínio Lógico:

    email: string: O método exige receber um texto (o email) como argumento.

    Promise<...>: Como operações de banco de dados levam tempo para responder (vão pela rede, buscam em disco), o JavaScript lida 
    com isso de forma assíncrona usando Promises (promessas de uma resposta futura).

    <User | null>: O banco só tem duas opções de resposta aqui. Ou ele encontra o usuário e nos devolve um objeto User completo, 
    ou ele não encontra nada e nos devolve null (nulo).

  */

  findByEmail(email: string): Promise<User | null>;

  /*
    O que faz: Declara que o banco de dados precisa saber como persistir (gravar) um usuário.

    Raciocínio Lógico:

    (user: User): Para salvar, o método precisa receber o objeto User completo que criamos na nossa aplicação.

    Promise<void>: Novamente, é uma operação assíncrona. O termo void significa "vazio" ou "nada". O raciocínio é: 
    quando terminamos de salvar algo no banco, não precisamos que ele nos devolva os dados do usuário de volta, 
    só precisamos que ele avise: "Pronto, terminei de salvar com sucesso!".
  */

  save(user: User): Promise<void>;
}
