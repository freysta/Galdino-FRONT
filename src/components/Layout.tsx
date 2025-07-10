'use client';

import { ReactNode } from 'react';
import { AppShell, Burger, Group, Text, UnstyledButton, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface LayoutProps {
  children: ReactNode;
  navigation: NavigationItem[];
  userType: 'admin' | 'motorista' | 'aluno';
  userName?: string;
}

export default function Layout({ children, navigation, userType, userName }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push('/login');
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin': return 'Administrador';
      case 'motorista': return 'Motorista';
      case 'aluno': return 'Aluno';
      default: return '';
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" fw={700}>InterUniBus</Text>
          </Group>
          <Group>
            {userName && (
              <Text size="sm" c="dimmed">
                {getUserTypeLabel()}: {userName}
              </Text>
            )}
            <UnstyledButton onClick={handleLogout} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
              <IconLogout size={16} />
              <Text size="sm">Sair</Text>
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <UnstyledButton
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon size={18} />
                <Text size="sm">{item.label}</Text>
              </UnstyledButton>
            );
          })}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
