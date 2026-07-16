/*
  Raciocínio: Criamos um apelido de tipo (Type Alias) exportável chamado TenantContext. Ele funciona como um contrato ou um molde. 
  Qualquer objeto que queira representar o "contexto do inquilino atual" na aplicação precisa seguir exatamente esta estrutura.

  tenantId: string;

  Raciocínio: Define que é obrigatório ter o ID único do cliente/empresa dono dos dados (ex: "empresa-abc-123"). É o valor mais crítico, 
  usado para filtrar as queries no banco de dados e garantir o isolamento.

  userId: string;

  Raciocínio: Define que é obrigatório mapear o ID do usuário que fez a requisição (ex: "user-999"). Importante para logs de 
  auditoria (saber quem alterou o quê dentro daquele tenant).

  role: string;

  Raciocínio: Define que é obrigatório ter o cargo/permissão do usuário dentro deste tenant específico (ex: "admin", "member"). 
  Essencial para controle de acesso (RBAC).

*/


export type TenantContext = {
  tenantId: string;
  userId: string;
  role: string;
};


/*
  Raciocínio: Informa ao compilador do TypeScript que as modificações feitas dentro deste bloco não pertencem apenas a este arquivo local, 
  mas devem ser injetadas e aplicadas ao escopo global do projeto.
*/

declare global {
  /*
    Raciocínio: Entra no espaço de nomes (namespace) criado pela biblioteca externa Express. O TypeScript permite fazer 
    uma técnica chamada Declaration Merging (Fusão de Declarações). Se você reabrir um namespace com o mesmo nome, o TypeScript 
    mescla o que você colocar ali dentro com o que já existia originalmente na biblioteca.
  */
  namespace Express {

    /*
      Raciocínio: Reabre especificamente a interface Request do Express que gerencia as propriedades de cada requisição HTTP que entra na API.
    */

    interface Request {

      /*
        Raciocínio: Adiciona a nova propriedade chamada tenant dentro da requisição.

        O sinal de interrogação (?) é uma propriedade opcional. Isso é uma lógica crucial: quando a requisição acabou de bater no servidor 
        (em rotas públicas como Login ou Cadastro de novas contas), o Tenant ainda não foi identificado, logo o valor é undefined.

        Após o seu Middleware ou Guard validar o cabeçalho x-tenant-id, ele preencherá essa propriedade com o objeto no formato 
        TenantContext que definimos na Parte 1.
      */

      tenant?: TenantContext;
    }
  }
}