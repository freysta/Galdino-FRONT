'use client';

import Layout from '@/components/Layout';
import {
  IconDashboard,
  IconUsers,
  IconCar,
  IconRoute,
  IconMapPin,
  IconCreditCard,
  IconBell,
} from '@tabler/icons-react';

const adminNavigation = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: IconDashboard },
  { label: 'Alunos', href: '/admin/alunos', icon: IconUsers },
  { label: 'Motoristas', href: '/admin/motoristas', icon: IconCar },
  { label: 'Rotas', href: '/admin/rotas', icon: IconRoute },
  { label: 'Pontos de Embarque', href: '/admin/pontos', icon: IconMapPin },
  { label: 'Pagamentos', href: '/admin/pagamentos', icon: IconCreditCard },
  { label: 'Notificações', href: '/admin/notificacoes', icon: IconBell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout 
      navigation={adminNavigation} 
      userType="admin" 
      userName="Admin Sistema"
    >
      {children}
    </Layout>
  );
}
