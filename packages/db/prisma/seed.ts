import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env localizado na raiz do monorepo
dotenv.config({ path: '../../.env' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o seed do sistema multi-tenant...');

  // 1. Garante a existência de um Usuário Administrador global (ou use um ID existente)
  const adminUser = await prisma.user.upsert({
    where: { id: 'usr_admin_default' },
    update: {},
    create: {
      id: 'usr_admin_default',
      email: 'admin@coreplatform.com',
      name: 'Admin Platform',
    },
  });

  // 2. Criação ou atualização do Tenant principal da plataforma
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'core-platform' },
    update: {},
    create: {
      id: 'tnnt_core_platform',
      name: 'Core Platform',
      slug: 'core-platform',
      status: 'active',
      ownerId: adminUser.id,
    },
  });

  // 3. Criação ou atualização do Workspace padrão atrelado ao Tenant
  const workspace = await prisma.workspace.upsert({
    // Se sua tabela Workspace tiver um índice único por slug, use-o no where. 
    // Caso contrário, usaremos um ID fixo para garantir idempotência.
    where: { id: 'wspace_default' },
    update: {},
    create: {
      id: 'wspace_default',
      tenantId: tenant.id,
      name: 'Workspace Inicial',
      slug: 'starter',
    },
  });

  // 4. Criação do vínculo de Membership (Dono/Admin) do usuário no Tenant
  const membership = await prisma.membership.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      id: 'memb_admin_default',
      tenantId: tenant.id,
      userId: adminUser.id,
      role: 'owner',
    },
  });

  console.log('🌱 Seed executado com sucesso para a estrutura Multi-Tenant:', { 
    adminUser, 
    tenant, 
    workspace, 
    membership 
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });