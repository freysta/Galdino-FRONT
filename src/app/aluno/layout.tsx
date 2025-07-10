'use client';

import Layout from '@/components/Layout';
import {
  IconRoute,
  IconCreditCard,
  IconBell,
  IconUser,
} from '@tabler/icons-react';

const alunoNavigation = [
  { label: 'Minhas Rotas', href: '/aluno/rotas', icon: IconRoute },
  { label: 'Pagamentos', href: '/aluno/pagamentos', icon: IconCreditCard },
  { label: 'Notificações', href: '/aluno/notificacoes', icon: IconBell },
  { label: 'Perfil', href: '/aluno/perfil', icon: IconUser },
];

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout 
      navigation={alunoNavigation} 
      userType="aluno" 
      userName="Ana Silva Santos"
    >
      {children}
    </Layout>
  );
}
