'use client';

import {
  Grid,
  Card,
  Text,
  Title,
  Stack,
  Group,
  Badge,
  Button,
  SimpleGrid,
  ThemeIcon,
  Progress,
  Timeline,
} from '@mantine/core';
import {
  IconRoute,
  IconUsers,
  IconClock,
  IconMapPin,
  IconCheck,
  IconAlertCircle,
  IconCar,
} from '@tabler/icons-react';

// Mock data
const todayRoutes = [
  {
    id: 1,
    destination: 'Campus Norte - UNIFESP',
    time: '07:30',
    studentsConfirmed: 25,
    studentsTotal: 28,
    status: 'pending',
    boardingPoint: 'Terminal Rodoviário',
    estimatedDuration: '45 min',
  },
  {
    id: 2,
    destination: 'Campus Norte - UNIFESP',
    time: '12:30',
    studentsConfirmed: 22,
    studentsTotal: 25,
    status: 'pending',
    boardingPoint: 'Terminal Rodoviário',
    estimatedDuration: '45 min',
  },
  {
    id: 3,
    destination: 'Centro - Retorno',
    time: '17:30',
    studentsConfirmed: 0,
    studentsTotal: 30,
    status: 'scheduled',
    boardingPoint: 'Campus Norte',
    estimatedDuration: '50 min',
  },
];

const recentActivity = [
  {
    time: '06:45',
    title: 'Check-in realizado',
    description: 'Veículo inspecionado e pronto para a primeira viagem',
    color: 'green',
    icon: IconCheck,
  },
  {
    time: '07:00',
    title: 'Rota iniciada',
    description: 'Saída do terminal rumo ao Campus Norte',
    color: 'blue',
    icon: IconRoute,
  },
  {
    time: '07:15',
    title: 'Presença confirmada',
    description: '25 de 28 alunos confirmaram presença',
    color: 'orange',
    icon: IconUsers,
  },
];

const stats = [
  {
    title: 'Rotas do Dia',
    value: '3',
    description: '2 pendentes, 1 agendada',
    icon: IconRoute,
    color: 'blue',
  },
  {
    title: 'Alunos Esperados',
    value: '83',
    description: 'Total do dia',
    icon: IconUsers,
    color: 'green',
  },
  {
    title: 'Próxima Saída',
    value: '07:30',
    description: 'Campus Norte',
    icon: IconClock,
    color: 'orange',
  },
];

export default function MotoristaDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'scheduled': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'scheduled': return 'Agendada';
      default: return 'Desconhecido';
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Dashboard do Motorista</Title>
          <Text c="dimmed">
            Bem-vindo, Carlos! Hoje é {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </div>
        <Button leftSection={<IconCar size="1rem" />} variant="light">
          Status do Veículo
        </Button>
      </Group>

      {/* Cards de estatísticas */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
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
                  <Text c="dimmed" size="sm">
                    {stat.description}
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
        {/* Rotas do dia */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Group justify="space-between" mb="md">
              <Text fw={500} size="lg">Rotas de Hoje</Text>
              <Badge variant="light" color="blue">
                {todayRoutes.length} rotas
              </Badge>
            </Group>
            <Stack gap="md">
              {todayRoutes.map((route) => (
                <Card key={route.id} withBorder radius="sm" padding="md">
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500} size="sm">
                          {route.destination}
                        </Text>
                        <Badge color={getStatusColor(route.status)} variant="light" size="sm">
                          {getStatusLabel(route.status)}
                        </Badge>
                      </Group>
                      
                      <Group gap="md" mb="xs">
                        <Group gap="xs">
                          <IconClock size="0.8rem" />
                          <Text size="sm" c="dimmed">{route.time}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconMapPin size="0.8rem" />
                          <Text size="sm" c="dimmed">{route.boardingPoint}</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Duração: {route.estimatedDuration}
                        </Text>
                      </Group>

                      <Group justify="space-between" align="center">
                        <div>
                          <Text size="sm">
                            Alunos: {route.studentsConfirmed}/{route.studentsTotal}
                          </Text>
                          <Progress 
                            value={(route.studentsConfirmed / route.studentsTotal) * 100} 
                            size="sm" 
                            color={route.studentsConfirmed === route.studentsTotal ? 'green' : 'orange'}
                            mt="xs"
                          />
                        </div>
                        
                        {route.status === 'pending' && (
                          <Button size="sm" variant="light">
                            Confirmar Presenças
                          </Button>
                        )}
                      </Group>
                    </div>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Atividade recente */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Text fw={500} size="lg" mb="md">Atividade de Hoje</Text>
            <Timeline active={recentActivity.length} bulletSize={24} lineWidth={2}>
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <Timeline.Item
                    key={index}
                    bullet={
                      <ThemeIcon
                        size={22}
                        variant="filled"
                        color={activity.color}
                        radius="xl"
                      >
                        <Icon size="0.8rem" />
                      </ThemeIcon>
                    }
                    title={
                      <Group gap="xs">
                        <Text size="sm" fw={500}>{activity.title}</Text>
                        <Text size="xs" c="dimmed">{activity.time}</Text>
                      </Group>
                    }
                  >
                    <Text size="xs" c="dimmed" mt={4}>
                      {activity.description}
                    </Text>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Informações do veículo */}
      <Card withBorder padding="lg" radius="md">
        <Title order={3} mb="md">Informações do Veículo - Ônibus 001</Title>
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
          <div>
            <Text size="sm" c="dimmed" mb="xs">Quilometragem</Text>
            <Text size="lg" fw={700}>125.430 km</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">Combustível</Text>
            <Text size="lg" fw={700} c="green">85%</Text>
            <Progress value={85} color="green" size="sm" mt="xs" />
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">Próxima Manutenção</Text>
            <Text size="lg" fw={700}>15/02/2024</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">Status Geral</Text>
            <Badge color="green" variant="light">
              <Group gap="xs">
                <IconCheck size="0.8rem" />
                Operacional
              </Group>
            </Badge>
          </div>
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
