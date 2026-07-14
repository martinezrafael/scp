/*
  O que faz: Importa e executa imediatamente o pacote dotenv.

  Raciocínio Lógico: Por padrão, o Node.js não lê arquivos .env. Essa linha faz o dotenv procurar um arquivo chamado .env na 
  raiz do projeto, ler as linhas dele e injetar esses valores dentro do objeto global process.env do Node. Sem essa linha, 
  todas as variáveis de ambiente seriam undefined.
*/

import "dotenv/config";

/*
  O que faz: Importa o z, que é o objeto principal da biblioteca Zod.

  Raciocínio Lógico: O Zod é uma biblioteca de declaração e validação de esquemas (schemas). O z nos dá acesso a todas as funções 
  necessárias para construir o nosso "molde" de validação (como strings, números, enums, etc.).
*/

import { z } from "zod";

/*
  O que faz: Cria uma constante chamada envSchema que armazena a estrutura de um objeto esperada pelo Zod.

  Raciocínio Lógico: Como o process.env do Node é um objeto chave-valor, nós usamos z.object para dizer ao Zod: "Olha, 
  eu espero receber um objeto e, dentro dele, quero validar as seguintes propriedades..."
*/

const envSchema = z.object({
  /*
    O que faz: Define a regra para a variável NODE_ENV.

    Raciocínio Lógico: * z.enum([...]) restringe o valor: ele só aceita se for exatamente uma dessas três strings. Se o valor for 
    "staging", por exemplo, ele vai rejeitar.

    .default("development") adiciona um comportamento de segurança: se a pessoa esquecer de colocar NODE_ENV no arquivo .env, 
    o Zod não quebra o app; ele simplesmente assume que o valor é "development".
  */

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /*
    O que faz: Define as regras para DATABASE_URL e APP_URL.

    Raciocínio Lógico: O Zod encadeia funções. Primeiro ele checa se o valor é uma string (texto). Se for, ele aplica a próxima validação: 
    .url(). Isso garante que o texto comece com http://, https://, postgresql://, etc. Se alguém digitar apenas "meubanco", o Zod bloqueia a inicialização. Como não têm .optional(), elas são obrigatórias.
  */

  DATABASE_URL: z.string().url(),
  APP_URL: z.string().url(),

  /*
    O que faz: Define a regra para a chave secreta do Token JWT.

    Raciocínio Lógico: Garante que a senha seja uma string e tenha no mínimo 32 caracteres (.min(32)). Isso é uma regra de 
    segurança em runtime: impede que um desenvolvedor distraído coloque uma senha fraca como "123" em produção.
  */

  JWT_SECRET: z.string().min(32), // Mínimo de 32 caracteres para segurança

  /*
    O que faz: Define variáveis que o sistema pode usar, mas que não são vitais para o app ligar.

    Raciocínio Lógico: O modificador .optional() diz ao Zod: "Se essa chave não existir no .env, tudo bem, ignore 
    e passe para a próxima". No caso do REDIS_URL, se ela for enviada, ela obrigatoriamente precisa ser uma URL válida; se não for enviada, 
    ela fica como undefined.
  */

  REDIS_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

/*
  O que faz: Pega o objeto bruto process.env (que veio lá da linha 1), passa pelo molde envSchema e exporta o resultado na constante env.

    Raciocínio Lógico: O método .parse() é o executor.

    Ele lê o process.env.

    Limpa o que não foi mapeado no schema.

    Valida os tipos e regras de cada linha.

    Se algo estiver errado: Ele dispara um erro (ZodError), interrompe a execução do Node.js imediatamente e mostra o que falhou no console.

    Se tudo estiver certo: Ele retorna o objeto validado. A partir de agora, em vez de usar process.env.DATABASE_URL, o restante do projeto usará env.DATABASE_URL.
*/

// Faz o parse do process.env. Se falhar, dispara um erro no console e trava o app.
export const env = envSchema.parse(process.env);

/*
  O que faz: Cria e exporta um tipo TypeScript chamado Env.

  Raciocínio Lógico: Em vez de você ter que escrever manualmente uma interface ou type no TypeScript repetindo tudo o que já escreveu 
  no schema do Zod (ex: type Env = { DATABASE_URL: string, ... }), a função z.infer olha para o envSchema e deduz o tipo TypeScript 
  exato dele automaticamente.
*/

// Exporta o tipo inferido automaticamente pelo Zod
export type Env = z.infer<typeof envSchema>;
