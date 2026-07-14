/*
  O que faz: Importa o módulo nativo do Node.js chamado crypto.

  Raciocínio Lógico: Esse módulo fornece funcionalidades criptográficas seguras. Ele não é usado para o token de acesso 
  (que é simples), mas é fundamental para o token de atualização (Refresh Token), que exige um nível de aleatoriedade 
  impossível de ser adivinhado por invasores.
*/

import crypto from "crypto";

/*

  O que faz: Cria e exporta uma classe chamada TokenService.

  Raciocínio Lógico: Em arquitetura de software, centralizar responsabilidades em "Serviços" (Services) ajuda na organização. 
  Tudo o que for relacionado à fabricação, cálculo ou manipulação de tokens no sistema ficará concentrado dentro dessa classe. 
  O export permite que outros arquivos do sistema (como as rotas de login) utilizem esse serviço.
*/

export class TokenService {
  /*
    O que faz: Define uma função interna (método) que recebe a string userId (o identificador único do usuário no banco de dados) como parâmetro.

    Raciocínio Lógico: Para criar um token de acesso, o sistema precisa saber a quem esse token pertence. Atrelando o userId ao token, 
    garantimos que, quando o usuário enviar esse token de volta nas requisições, a API saberá exatamente quem está tentando acessar o sistema.
  */

  /**
   * Gera o token de acesso de curta duração para rotas privadas.
   */
  createAccessToken(userId: string) {
    /*
      O que faz: Devolve um objeto contendo duas propriedades: o token simulado e o tempo de expiração.

      Raciocínio Lógico:

      token: access-${userId}: Usa uma template string para concatenar a palavra "access-" com o ID do usuário. Atualmente é apenas 
      um texto estático simulado para estruturar o fluxo da aplicação. No futuro, isso será substituído por um JWT (JSON Web Token) criptografado.

      expiresIn: 900: Define estritamente o tempo de vida útil do token em segundos. 900 segundos equivalem a exatamente 15 minutos.

      Lógica de Segurança: O token de acesso vai trafegar em quase todas as requisições HTTP da aplicação. Se ele for interceptado 
      por um hacker, o invasor terá apenas 15 minutos de acesso antes que o token se torne completamente inútil.
    */

    return {
      token: `access-${userId}`, // Base inicial (evoluirá para JWT posteriormente)
      expiresIn: 900, // 15 minutos
    };
  }

  /*
    O que faz: Define o método que também recebe o userId como parâmetro.

    Raciocínio Lógico: Da mesma forma que o token de acesso, o token de atualização precisa saber a qual conta de usuário ele está dando
     permissão para renovar as sessões.
  */

  /**
   * Gera o token de atualização de longa duração para renovar a sessão.
   */
  createRefreshToken(userId: string) {
    /*
      O que faz: Devolve o objeto do Refresh Token com uma estratégia de geração e expiração completamente diferente.
      
      Raciocínio Lógico:
      
      token: crypto.randomUUID(): Aqui entra o módulo importado na linha 1. Ele gera um UUIDv4 (um identificador universal único, ex: f81d4fae-7dec-11d0-a765-00a0c91e6bf6).
      
      Lógica de Segurança: Diferente do Access Token, o Refresh Token não carrega dados do usuário expostos em sua estrutura. Ele é apenas um código aleatório e gigantesco, virtualmente impossível de ser adivinhado por força bruta. O sistema guardará esse código no banco de dados atrelado ao usuário.
      
      expiresIn: 2592000: Define a expiração em segundos ($60 \times 60 \times 24 \times 30$). Isso equivale a 30 dias.
      
      Lógica de Experiência do Usuário (UX): Como o Access Token expira a cada 15 minutos, o cliente (web ou mobile) usará esse código UUID 
      de 30 dias para pedir silenciosamente novos tokens de acesso, evitando que o usuário precise digitar e-mail e senha toda vez que os 
      15 minutos acabarem.
    */

    return {
      token: crypto.randomUUID(), // Identificador único e imprevisível
      expiresIn: 2592000, // 30 dias em segundos
    };
  }
}
