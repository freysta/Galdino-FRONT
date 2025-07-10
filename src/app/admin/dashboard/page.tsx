'use client';

import {
  Grid,
  Card,
  Text,
  Title,
  Stack,
  Group,
  Badge,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Progress,
} from '@mantine/core';
import {
  IconUsers,
  IconRoute,
  IconCreditCard,
  IconAlertCircle,
  IconTrendingUp,
  IconCar,
} from '@tabler/icons-react';

// Mock data
const stats = [
  {
    title: 'Total de Alunos',
    value: '248',
    diff: '+12%',
    icon: IconUsers,
    color: 'blue',
  },
  {
    title: 'Rotas do Dia',
    value: '8',
    diff: '+2',
    icon: IconRoute,
    color: 'green',
  },
  {
    title: 'Pagamentos Pendentes',
    value: '15',
    diff: '-5%',
    icon: IconCreditCard,
    color: 'orange',
  },
  {
    title: 'Motoristas Ativos',
    value: '12',
    diff: '+1',
    icon: IconCar,
    color: 'violet',
  },
];

const notifications = [
  {
    id: 1,
    title: 'Pagamento em atraso',
    message: 'João Silva - Mensalidade de Janeiro',
    time: '2 horas atrás',
    type: 'warning',
  },
  {
    id: 2,
    title: 'Nova rota criada',
    message: 'Rota Campus Norte - Centro criada com sucesso',
    time: '4 horas atrás',
    type: 'success',
  },
  {
    id: 3,
    title: 'Motorista indisponível',
    message: 'Carlos Santos reportou indisponibilidade para amanhã',
    time: '6 horas atrás',
    type: 'info',
  },
  {
    id: 4,
    title: 'Manutenção de veículo',
    message: 'Ônibus 001 agendado para manutenção',
    time: '1 dia atrás',
    type: 'warning',
  },
];

const recentRoutes = [
  {
    id: 1,
    destination: 'Campus Norte',
    driver: 'Carlos Santos',
    students: 28,
    status: 'Em andamento',
    time: '08:00',
  },
  {
    id: 2,
    destination: 'Campus Sul',
    driver: 'Maria Oliveira',
    students: 32,
    status: 'Concluída',
    time: '07:30',
  },
  {
    id: 3,
    destination: 'Centro',
    driver: 'João Pereira',
    students: 25,
    status: 'Agendada',
    time: '09:00',
  },
];

export default function AdminDashboard() {
  return (
    <Stack gap="lg">
      <Title order={1}>Dashboard Administrativo</Title>

      {/* Cards de estatísticas */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} withBorder padding="lg" radius="md">
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                  <Text c="teal" size="sm" fw={500}>
                    <span>{stat.diff}</span>
                  </Text>
                </div>
                <ThemeIcon color={stat.color} variant="light" size={38} radius="md">
                  <Icon size="1.8rem" stroke={1.5} />
                </ThemeIcon>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <Grid>
        {/* Últimas notificações */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Group justify="space-between" mb="md">
              <Text fw={500} size="lg">Últimas Notificações</Text>
              <Badge variant="light" color="blue">
                {notifications.length} novas
              </Badge>
            </Group>
            <Stack gap="sm">
              {notifications.map((notification) => (
                <Paper key={notification.id} p="sm" withBorder radius="sm">
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {notification.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {notification.message}
                      </Text>
                    </div>
                    <Text size="xs" c="dimmed">
                      {notification.time}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Rotas recentes */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Text fw={500} size="lg" mb="md">Rotas de Hoje</Text>
            <Stack gap="sm">
              {recentRoutes.map((route) => (
                <Paper key={route.id} p="sm" withBorder radius="sm">
                  <Group justify="space-between" align="center">
                    <div>
                      <Text size="sm" fw={500}>
                        {route.destination}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Motorista: {route.driver}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {route.students} alunos • {route.time}
                      </Text>
                    </div>
                    <Badge
                      color={
                        route.status === 'Concluída' ? 'green' :
                        route.status === 'Em andamento' ? 'blue' : 'gray'
                      }
                      variant="light"
                      size="sm"
                    >
                      {route.status}
                    </Badge>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Resumo financeiro */}
      <Card withBorder padding="lg" radius="md">
        <Title order={3} mb="md">Resumo Financeiro - Janeiro 2024</Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <div>
            <Text size="sm" c="dimmed" mb="xs">Receita Total</Text>
            <Text size="xl" fw={700} c="green">R$ 24.800,00</Text>
            <Progress value={85} color="green" size="sm" mt="xs" />
            <Text size="xs" c="dimmed" mt="xs">85% da meta mensal</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">Pagamentos Pendentes</Text>
            <Text size="xl" fw={700} c="orange">R$ 3.750,00</Text>
            <Progress value={15} color="orange" size="sm" mt="xs" />
            <Text size="xs" c="dimmed" mt="xs">15 alunos em atraso</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">Taxa de Inadimplência</Text>
            <Text size="xl" fw={700} c="red">6%</Text>
            <Progress value={6} color="red" size="sm" mt="xs" />
            <Text size="xs" c="dimmed" mt="xs">Meta: máx. 5%</Text>
          </div>
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
