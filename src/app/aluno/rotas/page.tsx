'use client';

import { useState } from 'react';
import {
  Title,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Button,
  Grid,
  Alert,
  Timeline,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import {
  IconRoute,
  IconClock,
  IconMapPin,
  IconUsers,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconCar,
  IconPhone,
} from '@tabler/icons-react';

// Mock data
const upcomingRoutes = [
  {
    id: 1,
    date: '2024-01-25',
    time: '07:30',
    destination: 'Campus Norte - UNIFESP',
    boardingPoint: 'Terminal Rodoviário',
    driver: 'Carlos Santos Silva',
    driverPhone: '(11) 98888-1111',
    vehicle: 'Ônibus 001',
    estimatedDuration: '45 min',
    status: 'confirmed',
    occupancy: 28,
    capacity: 40,
  },
  {
    id: 2,
    date: '2024-01-25',
    time: '12:30',
    destination: 'Campus Norte - UNIFESP',
    boardingPoint: 'Terminal Rodoviário',
    driver: 'Carlos Santos Silva',
    driverPhone: '(11) 98888-1111',
    vehicle: 'Ônibus 001',
    estimatedDuration: '45 min',
    status: 'confirmed',
    occupancy: 25,
    capacity: 40,
  },
  {
    id: 3,
    date: '2024-01-25',
    time: '17:30',
    destination: 'Centro - Retorno',
    boardingPoint: 'Campus Norte',
    driver: 'Carlos Santos Silva',
    driverPhone: '(11) 98888-1111',
    vehicle: 'Ônibus 001',
    estimatedDuration: '50 min',
    status: 'pending',
    occupancy: 0,
    capacity: 40,
  },
  {
    id: 4,
    date: '2024-01-26',
    time: '07:30',
    destination: 'Campus Norte - UNIFESP',
    boardingPoint: 'Terminal Rodoviário',
    driver: 'Maria Oliveira Costa',
    driverPhone: '(11) 98888-2222',
    vehicle: 'Ônibus 002',
    estimatedDuration: '45 min',
    status: 'confirmed',
    occupancy: 22,
    capacity: 35,
  },
];

const routeSteps = [
  {
    time: '07:30',
    location: 'Terminal Rodoviário',
    description: 'Embarque - Chegue 10 minutos antes',
    status: 'pending',
  },
  {
    time: '07:35',
    location: 'Shopping Center Norte',
    description: 'Parada intermediária',
    status: 'pending',
  },
  {
    time: '07:45',
    location: 'Estação Metrô',
    description: 'Parada intermediária',
    status: 'pending',
  },
  {
    time: '08:15',
    location: 'Campus Norte - UNIFESP',
    description: 'Destino final',
    status: 'pending',
  },
];

export default function AlunoRotasPage() {
  const [selectedRoute, setSelectedRoute] = useState(upcomingRoutes[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <IconCheck size="0.8rem" />;
      case 'pending': return <IconClock size="0.8rem" />;
      case 'cancelled': return <IconAlertCircle size="0.8rem" />;
      default: return null;
    }
  };

  const todayRoutes = upcomingRoutes.filter(route => route.date === '2024-01-25');
  const futureRoutes = upcomingRoutes.filter(route => route.date > '2024-01-25');

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Minhas Rotas</Title>
          <Text c="dimmed">
            Acompanhe suas viagens e horários
          </Text>
        </div>
      </Group>

      {/* Alerta importante */}
      <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
        <Text size="sm">
          <strong>Lembre-se:</strong> Chegue ao ponto de embarque pelo menos 10 minutos antes do horário. 
          Em caso de atraso, entre em contato com o motorista.
        </Text>
      </Alert>

      <Grid>
        {/* Rotas de hoje */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="md">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Rotas de Hoje - {new Date('2024-01-25').toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </Text>
              
              <Stack gap="md">
                {todayRoutes.map((route) => (
                  <Card 
                    key={route.id} 
                    withBorder 
                    radius="sm" 
                    padding="md"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedRoute.id === route.id ? '#f0f9ff' : undefined,
                      borderColor: selectedRoute.id === route.id ? '#3b82f6' : undefined,
                    }}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500} size="sm">
                            {route.destination}
                          </Text>
                          <Badge 
                            color={getStatusColor(route.status)} 
                            variant="light"
                            leftSection={getStatusIcon(route.status)}
                          >
                            {getStatusLabel(route.status)}
                          </Badge>
                        </Group>
                        
                        <Grid>
                          <Grid.Col span={6}>
                            <Group gap="xs" mb="xs">
                              <IconClock size="0.8rem" />
                              <Text size="sm" c="dimmed">{route.time}</Text>
                            </Group>
                            <Group gap="xs">
                              <IconMapPin size="0.8rem" />
                              <Text size="sm" c="dimmed">{route.boardingPoint}</Text>
                            </Group>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Group gap="xs" mb="xs">
                              <IconCar size="0.8rem" />
                              <Text size="sm" c="dimmed">{route.vehicle}</Text>
                            </Group>
                            <Group gap="xs">
                              <IconUsers size="0.8rem" />
                              <Text size="sm" c="dimmed">
                                {route.occupancy}/{route.capacity} lugares
                              </Text>
                            </Group>
                          </Grid.Col>
                        </Grid>
                      </div>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>

            {/* Próximas rotas */}
            {futureRoutes.length > 0 && (
              <Card withBorder padding="lg">
                <Text fw={500} size="lg" mb="md">Próximas Rotas</Text>
                <Stack gap="sm">
                  {futureRoutes.map((route) => (
                    <Card key={route.id} withBorder radius="sm" padding="sm">
                      <Group justify="space-between">
                        <div>
                          <Text fw={500} size="sm">{route.destination}</Text>
                          <Group gap="md" mt="xs">
                            <Group gap="xs">
                              <IconClock size="0.7rem" />
                              <Text size="xs" c="dimmed">
                                {new Date(route.date).toLocaleDateString('pt-BR')} - {route.time}
                              </Text>
                            </Group>
                            <Group gap="xs">
                              <IconMapPin size="0.7rem" />
                              <Text size="xs" c="dimmed">{route.boardingPoint}</Text>
                            </Group>
                          </Group>
                        </div>
                        <Badge color={getStatusColor(route.status)} variant="light" size="sm">
                          {getStatusLabel(route.status)}
                        </Badge>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid.Col>

        {/* Detalhes da rota selecionada */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder padding="lg" h="fit-content">
            <Text fw={500} size="lg" mb="md">Detalhes da Rota</Text>
            
            <Stack gap="md">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Destino</Text>
                <Text fw={500}>{selectedRoute.destination}</Text>
              </div>
              
              <div>
                <Text size="sm" c="dimmed" mb="xs">Horário de Saída</Text>
                <Group gap="xs">
                  <IconClock size="0.8rem" />
                  <Text fw={500}>{selectedRoute.time}</Text>
                </Group>
              </div>
              
              <div>
                <Text size="sm" c="dimmed" mb="xs">Ponto de Embarque</Text>
                <Group gap="xs">
                  <IconMapPin size="0.8rem" />
                  <Text fw={500}>{selectedRoute.boardingPoint}</Text>
                </Group>
              </div>
              
              <div>
                <Text size="sm" c="dimmed" mb="xs">Motorista</Text>
                <Text fw={500}>{selectedRoute.driver}</Text>
                <Group gap="xs" mt="xs">
                  <IconPhone size="0.8rem" />
                  <Text size="sm" c="dimmed">{selectedRoute.driverPhone}</Text>
                </Group>
              </div>
              
              <div>
                <Text size="sm" c="dimmed" mb="xs">Veículo</Text>
                <Group gap="xs">
                  <IconCar size="0.8rem" />
                  <Text fw={500}>{selectedRoute.vehicle}</Text>
                </Group>
              </div>
              
              <div>
                <Text size="sm" c="dimmed" mb="xs">Duração Estimada</Text>
                <Text fw={500}>{selectedRoute.estimatedDuration}</Text>
              </div>

              <Divider />

              <div>
                <Text size="sm" c="dimmed" mb="md">Trajeto da Rota</Text>
                <Timeline active={0} bulletSize={20} lineWidth={2}>
                  {routeSteps.map((step, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon
                          size={18}
                          variant="filled"
                          color="blue"
                          radius="xl"
                        >
                          <Text size="xs" fw={700}>{index + 1}</Text>
                        </ThemeIcon>
                      }
                      title={
                        <Group gap="xs">
                          <Text size="sm" fw={500}>{step.location}</Text>
                          <Text size="xs" c="dimmed">{step.time}</Text>
                        </Group>
                      }
                    >
                      <Text size="xs" c="dimmed" mt={4}>
                        {step.description}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>

              {selectedRoute.status === 'pending' && (
                <Alert icon={<IconAlertCircle size="1rem" />} color="orange">
                  <Text size="sm">
                    Esta rota ainda não foi confirmada. Aguarde a confirmação do motorista.
                  </Text>
                </Alert>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
