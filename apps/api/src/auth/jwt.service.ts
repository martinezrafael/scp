/*
  O que faz: Importa a biblioteca oficial do ecossistema Node.js chamada jsonwebtoken.

  Raciocínio Lógico: Nós não precisamos programar do zero a matemática complexa de criptografia, codificação Base64 e 
  assinatura digital necessária para o padrão JWT. Essa biblioteca faz todo o trabalho pesado.
*/

import jwt from "jsonwebtoken";

/*
  O que faz: Importa um objeto chamado env de um arquivo de configuração centralizado do projeto (@saas/config/env).

Raciocínio Lógico: Boas práticas de segurança exigem que chaves secretas e senhas nunca fiquem 
expostas diretamente no código (hardcoded). Esse env busca as variáveis de ambiente do sistema, garantindo
que a chave secreta permaneça oculta e mude dependendo de onde o código roda (ambiente de desenvolvimento, teste ou produção).

*/

import { env } from "../../../../packages/config/src/env.js";

/*
  O que faz: Declara e exporta uma classe chamada JwtService.

  Raciocínio Lógico: Usar uma classe cria uma estrutura encapsulada e reutilizável. Sempre que qualquer parte da API 
  (como o fluxo de login ou o middleware de segurança) precisar lidar com tokens, ela chamará essa mesma classe, centralizando a lógica.
*/

export class JwtService {
  /*
    O que faz: Define a assinatura do método que cria o token. Ele recebe um parâmetro chamado payload e promete retornar uma string.

    Raciocínio Lógico: O tipo Record<string, unknown> diz ao TypeScript: "Isso é um objeto com propriedades de texto (chaves) onde 
    os valores podem ser qualquer coisa (ID do usuário, e-mail, etc.)". O retorno é a string que representa a "pulseira de acesso" 
    que o usuário vai guardar.

  */

  // Gera o token de acesso assinado
  sign(payload: Record<string, unknown>): string {
    /*
      O que faz: Chama a função .sign() da biblioteca importada e retorna o token gerado.

      Raciocínio Lógico (Passo a Passo):

      Ele pega o payload (os dados públicos do usuário).

      Ele usa o env.JWT_SECRET (a frase secreta do servidor) para criar uma assinatura digital criptográfica. Se o payload mudar, a assinatura quebra.

      Ele passa um objeto de configuração { expiresIn: "7d" }, que adiciona automaticamente uma data de validade dentro do token. 
      Após 7 dias, o token expira por segurança e o usuário precisará fazer login novamente.
    */

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  /*
    O que faz: Define a assinatura do método que checa se o token enviado pelo usuário é válido. Ele recebe o token (string) e retorna o payload decodificado.

    Raciocínio Lógico: O <T> e o : T indicam o uso de Generics no TypeScript. Isso significa: "Quem chamar esse método pode definir qual é o formato esperado dos dados que vão sair de dentro do token". Torna o código reutilizável para diferentes tipos de payloads.
  */

  // Valida a assinatura e decodifica o payload do token
  verify<T>(token: string): T {
    /*
      O que faz: Chama o método .verify() da biblioteca, valida o token e o retorna com uma conversão de tipo.

      Raciocínio Lógico (Passo a Passo):

      O método pega o token que o cliente enviou e o env.JWT_SECRET do servidor.

      Ele refaz o cálculo da assinatura. Se o resultado bater com a assinatura que está no token, o servidor tem certeza de 
      que ninguém alterou as informações e que o token foi gerado por nós mesmos.

      Ele checa a data de validade. Se já passou de 7 dias, ele interrompe tudo e lança um erro.

      O as T (Type Assertion) é um aviso para o TypeScript: "Confia em mim, o objeto que sair daqui de dentro 
      vai ter exatamente o formato do tipo T que eu declarei na entrada".
    
    */

    return jwt.verify(token, env.JWT_SECRET) as T;
  }
}
