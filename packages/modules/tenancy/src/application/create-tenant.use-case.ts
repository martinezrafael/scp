
/*
  Raciocínio: O caso de uso precisa de duas ferramentas para trabalhar. Primeiro, ele importa o modelo Tenant 
  (para saber como construir uma empresa). Segundo, ele importa o TenantRepository usando import type 
  (indicando que usará apenas a definição da interface/contrato do banco de dados, sem trazer código pesado de execução).
*/

import { Tenant } from '../domain/tenant.aggregate.js';
import type { TenantRepository } from '../ports/tenant.repository.js';

/*
  Raciocínio: Esta é a definição do contrato de entrada. O TypeScript usa isso para garantir que quem chamar esse caso de uso 
  passe exatamente o que ele precisa para funcionar: um texto com o ID do dono (ownerId) e um texto com o nome da empresa (name). 
  Se faltar um deles, o código nem compila.
*/

// O que o caso de uso precisa receber para funcionar:
type Input = {
  ownerId: string; // ID do usuário criador
  name: string;    // Nome da empresa/tenant
};

/*
  Raciocínio: Organizamos casos de uso como classes porque elas nos permitem aplicar o padrão de Injeção de Dependência 
  (que vemos na linha seguinte). O export torna essa classe visível para o resto do sistema (ex: para uma rota da API que vai disparar essa ação).
*/

export class CreateTenantUseCase {

  /*
    Raciocínio: Aqui está o segredo da Arquitetura Limpa. Em vez do caso de uso criar uma conexão com o banco de dados aqui dentro, 
    ele exige que quem criar essa classe passe o repositório pronto pelo construtor.

    O private readonly cria automaticamente uma propriedade interna na classe chamada this.tenants, que só pode ser lida (readonly), 
    impedindo que ela seja apagada ou alterada por acidente durante a execução.
  */


  // Recebemos o repositório aqui (Inversão de Dependência)
  constructor(private readonly tenants: TenantRepository) {}

  /*
    Raciocínio: Toda classe de caso de uso costuma ter um único método principal, geralmente chamado execute ou run. 
    Ele é marcado como async (assíncrono) porque salvar coisas no banco de dados leva tempo (milissegundos), e o 
    JavaScript precisa esperar essa resposta sem travar o restante do servidor. Ele recebe o input no formato que definimos lá em cima.
  */

  async execute(input: Input) {

    /*
      Raciocínio: Aqui nós fabricamos a nossa entidade Tenant.

      id: crypto.randomUUID(): Gera um identificador único universal (ex: f81d4fae-7dec-11d0-a765-00a0c91e6bf6). É mais seguro do que 
      usar IDs sequenciais (1, 2, 3) do banco de dados.

      name e ownerId: Apenas repassa o que veio do input.

      slug: ...: Esta linha limpa o nome da empresa para virar um link de URL válido. O .toLowerCase() transforma tudo em 
      minúsculo e o .replace(/\s+/g, '-') substitui todos os espaços por hifens. (Ex: "Minha Empresa SaaS" vira "minha-empresa-saas").
    */


    // 1. Cria a estrutura do Tenant com regras básicas
    const tenant = Tenant.create({
      id: crypto.randomUUID(),
      name: input.name,
      slug: input.name.toLowerCase().replace(/\s+/g, '-'), // Formata o texto para link
      ownerId: input.ownerId,
    });

    /*
      Raciocínio: O caso de uso pega o objeto tenant que acabou de criar e diz para o repositório: "Salva isso aí para mim". 
      O await trava a execução nesta linha até que o banco de dados responda "Pronto, salvei!". Graças à interface que injetamos 
      no construtor, o caso de uso não faz a menor ideia de como isso é salvo, ele só confia que o método save vai cumprir o contrato.
    */

    // 2. Salva no banco de dados através da interface
    await this.tenants.save(tenant);

    /*
      Raciocínio: Após salvar com sucesso, o caso de uso responde para quem o chamou (geralmente o seu controlador/API) um objeto contendo
      apenas o id da nova empresa criada. Isso é uma boa prática de segurança e performance: você não devolve a entidade inteira, devolve 
      apenas o dado essencial para confirmar o sucesso da operação (o ID), permitindo que a API redirecione o usuário para a página da empresa recém-criada.
    */

    // 3. Retorna o ID da empresa criada
    return {
      id: tenant.id,
    };
  }
}