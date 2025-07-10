'use client';

import Layout from '@/components/Layout';
import {
  IconDashboard,
  IconClipboardCheck,
  IconHistory,
} from '@tabler/icons-react';

const motoristaNavigation = [
  { label: 'Dashboard', href: '/motorista/dashboard', icon: IconDashboard },
  { label: 'Confirmar Presença', href: '/motorista/presencas', icon: IconClipboardCheck },
  { label: 'Histórico de Rotas', href: '/motorista/historico', icon: IconHistory },
];

export default function MotoristaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout 
      navigation={motoristaNavigation} 
      userType="motorista" 
      userName="Carlos Santos"
    >
      {children}
    </Layout>
  );
}
