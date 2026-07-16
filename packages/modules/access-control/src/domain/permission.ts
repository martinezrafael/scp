/*

  export type Permission =: Aqui você está criando um Tipo de União (Union Type) personalizado no TypeScript chamado Permission. 
  O export serve para que outros arquivos do projeto possam usar esse mesmo dicionário.

  O símbolo | (ou/pipe): O raciocínio lógico aqui é dizer: "A tipagem Permission só aceita receber exatamente o texto 'members.invite' OU 
  o texto 'members.manage' OU 'billing.manage'..." e assim por diante.

  A lógica por trás: Se no futuro você tentar escrever permission = 'member.invitar' (com erro de digitação), o TypeScript vai 
  acusar um erro imediatamente na sua tela. Você acabou de blindar o sistema contra erros de escrita.
*/

// 1. Definição de todas as ações possíveis no sistema
export type Permission =
  | 'members.invite'
  | 'members.manage'
  | 'billing.manage'
  | 'workflows.create'
  | 'ai.use'
  | 'admin.access';


/*
  export type RoleName = ...: Segue exatamente a mesma lógica do bloco anterior, mas agora focado nos cargos (papéis) do sistema.

  A lógica por trás: Um usuário no seu sistema só poderá pertencer a um desses 4 grupos literais. Não existe a possibilidade de 
  inventar um cargo super-admin do nada sem antes passar por essa linha de código e adicioná-lo aí.
*/

// 2. Definição dos cargos (papéis) disponíveis
export type RoleName = 'owner' | 'admin' | 'member' | 'viewer';

/*
  export const rolePermissions: Cria uma constante real (um objeto JavaScript que vai existir quando o sistema estiver rodando) 
  para guardar o mapa de permissões.

  Record<RoleName, Permission[]>: Essa é a parte mais inteligente do código. O Record diz ao TypeScript o seguinte:

  As chaves desse objeto obrigatoriamente têm que ser os cargos que definimos em RoleName (owner, admin, member, viewer). 
  Você não pode esquecer de nenhum e não pode inventar chaves novas.

  O valor de cada chave obrigatoriamente tem que ser uma lista/array ([]) contendo apenas as ações que criamos em Permission.
*/


// 3. Matriz que vincula cada cargo às suas permissões permitidas
export const rolePermissions: Record<RoleName, Permission[]> = {
  /*
    Raciocínio: O dono (owner) tem acesso total. Abrimos um array e listamos todas as strings válidas do tipo Permission.
  */
  owner: [
    'members.invite',
    'members.manage',
    'billing.manage',
    'workflows.create',
    'ai.use',
    'admin.access',
  ],
  /*
    Raciocínio: O administrador tem acesso intermediário. Ele pode convidar membros, criar workflows e usar IA, mas não pode mexer no 
    faturamento (billing.manage) e nem ter acesso à administração master (admin.access).
  */
  admin: ['members.invite', 'workflows.create', 'ai.use'],
  /*
    Raciocínio: O membro é o funcionário padrão. Ele só pode fazer o trabalho do dia a dia (criar workflows e usar IA). 
    Repare que ele já perdeu o direito de convidar outras pessoas (members.invite).
  */
  member: ['workflows.create', 'ai.use'],
  /*
    Raciocínio: O visualizador é o nível mais baixo de acesso. O array está vazio []. Logicamente, quando o sistema perguntar 
    se o viewer pode fazer algo, a resposta sempre será não, pois não há nada listado para ele.
  */
  viewer: [], // Viewer não possui permissões de escrita/gerenciamento
};