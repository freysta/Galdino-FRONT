'use client';

import { useState } from 'react';
import {
  Title,
  Button,
  TextInput,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Table,
  Pagination,
  Select,
  Grid,
  Modal,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconSearch,
  IconEye,
  IconDownload,
  IconClock,
  IconMapPin,
  IconUsers,
  IconCheck,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';

// Mock data
const mockRouteHistory = [
  {
    id: 1,
    date: '2024-01-24',
    time: '07:30',
    destination: 'Campus Norte - UNIFESP',
    origin: 'Terminal Rodoviário',
    studentsExpected: 28,
    studentsPresent: 25,
    studentsAbsent: 3,
    status: 'completed',
    duration: '45 min',
    distance: '25 km',
    observations: 'Viagem tranquila, trânsito normal',
  },
  {
    id: 2,
    date: '2024-01-24',
    time: '12:30',
    destination: 'Campus Norte - UNIFESP',
    origin: 'Terminal Rodoviário',
    studentsExpected: 25,
    studentsPresent: 22,
    studentsAbsent: 3,
    status: 'completed',
    duration: '50 min',
    distance: '25 km',
    observations: 'Trânsito intenso na volta',
  },
  {
    id: 3,
    date: '2024-01-24',
    time: '17:30',
    destination: 'Centro - Retorno',
    origin: 'Campus Norte',
    studentsExpected: 30,
    studentsPresent: 28,
    studentsAbsent: 2,
    status: 'completed',
    duration: '55 min',
    distance: '28 km',
    observations: 'Chuva leve no trajeto',
  },
  {
    id: 4,
    date: '2024-01-23',
    time: '07:30',
    destination: 'Campus Norte - UNIFESP',
    origin: 'Terminal Rodoviário',
    studentsExpected: 28,
    studentsPresent: 26,
    studentsAbsent: 2,
    status: 'completed',
    duration: '42 min',
    distance: '25 km',
    observations: 'Viagem sem intercorrências',
  },
  {
    id: 5,
    date: '2024-01-23',
    time: '12:30',
    destination: 'Campus Norte - UNIFESP',
    origin: 'Terminal Rodoviário',
    studentsExpected: 25,
    studentsPresent: 0,
    studentsAbsent: 25,
    status: 'cancelled',
    duration: '0 min',
    distance: '0 km',
    observations: 'Cancelada devido a problema mecânico',
  },
  {
    id: 6,
    date: '2024-01-22',
    time: '07:30',
    destination: 'Campus Norte - UNIFESP',
    origin: 'Terminal Rodoviário',
    studentsExpected: 28,
    studentsPresent: 27,
    studentsAbsent: 1,
    status: 'completed',
    duration: '48 min',
    distance: '25 km',
    observations: 'Atraso de 10 minutos na saída',
  },
];

export default function HistoricoPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [routes] = useState(mockRouteHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'delayed': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      case 'delayed': return 'Atrasada';
      default: return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <IconCheck size="0.8rem" />;
      case 'cancelled': return <IconX size="0.8rem" />;
      case 'delayed': return <IconAlertCircle size="0.8rem" />;
      default: return null;
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || route.status === statusFilter;
    const matchesDate = !dateFilter || route.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (route: any) => {
    setSelectedRoute(route);
    open();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(startIndex, startIndex + itemsPerPage);

  // Estatísticas
  const totalRoutes = filteredRoutes.length;
  const completedRoutes = filteredRoutes.filter(r => r.status === 'completed').length;
  const cancelledRoutes = filteredRoutes.filter(r => r.status === 'cancelled').length;
  const totalStudents = filteredRoutes.reduce((sum, r) => sum + r.studentsPresent, 0);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Histórico de Rotas</Title>
        <Button leftSection={<IconDownload size="1rem" />} variant="light">
          Exportar Relatório
        </Button>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">Total de Rotas</Text>
            <Text size="xl" fw={700}>{totalRoutes}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">Concluídas</Text>
            <Text size="xl" fw={700} c="green">{completedRoutes}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">Canceladas</Text>
            <Text size="xl" fw={700} c="red">{cancelledRoutes}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">Total Passageiros</Text>
            <Text size="xl" fw={700} c="blue">{totalStudents}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Buscar por destino ou origem..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
              data={[
                { value: 'completed', label: 'Concluída' },
                { value: 'cancelled', label: 'Cancelada' },
                { value: 'delayed', label: 'Atrasada' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Data"
              data={[
                { value: '2024-01-24', label: '24/01/2024' },
                { value: '2024-01-23', label: '23/01/2024' },
                { value: '2024-01-22', label: '22/01/2024' },
              ]}
              value={dateFilter}
              onChange={setDateFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredRoutes.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de histórico */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Data/Hora</Table.Th>
              <Table.Th>Rota</Table.Th>
              <Table.Th>Passageiros</Table.Th>
              <Table.Th>Duração</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedRoutes.map((route) => (
              <Table.Tr key={route.id}>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={500}>
                      {new Date(route.date).toLocaleDateString('pt-BR')}
                    </Text>
                    <Group gap="xs">
                      <IconClock size="0.8rem" />
                      <Text size="xs" c="dimmed">{route.time}</Text>
                    </Group>
                  </div>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={500}>{route.destination}</Text>
                    <Group gap="xs" mt="xs">
                      <IconMapPin size="0.8rem" />
                      <Text size="xs" c="dimmed">De: {route.origin}</Text>
                    </Group>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconUsers size="0.8rem" />
                    <Text size="sm">
                      {route.studentsPresent}/{route.studentsExpected}
                    </Text>
                  </Group>
                  {route.studentsAbsent > 0 && (
                    <Text size="xs" c="dimmed">
                      {route.studentsAbsent} ausente(s)
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm">{route.duration}</Text>
                    <Text size="xs" c="dimmed">{route.distance}</Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={getStatusColor(route.status)} 
                    variant="light"
                    leftSection={getStatusIcon(route.status)}
                  >
                    {getStatusLabel(route.status)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <ActionIcon 
                    variant="subtle" 
                    color="blue"
                    onClick={() => handleViewDetails(route)}
                  >
                    <IconEye size="1rem" />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {totalPages > 1 && (
          <Group justify="center" mt="md">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        )}
      </Card>

      {/* Modal de detalhes */}
      <Modal opened={opened} onClose={close} title="Detalhes da Rota" size="lg">
        {selectedRoute && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Data</Text>
                <Text fw={500}>
                  {new Date(selectedRoute.date).toLocaleDateString('pt-BR')}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Horário</Text>
                <Text fw={500}>{selectedRoute.time}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Rota</Text>
                <Text fw={500}>
                  {selectedRoute.origin} → {selectedRoute.destination}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Esperados</Text>
                <Text fw={500}>{selectedRoute.studentsExpected}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Presentes</Text>
                <Text fw={500} c="green">{selectedRoute.studentsPresent}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Ausentes</Text>
                <Text fw={500} c="red">{selectedRoute.studentsAbsent}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Duração</Text>
                <Text fw={500}>{selectedRoute.duration}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Distância</Text>
                <Text fw={500}>{selectedRoute.distance}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Status</Text>
                <Badge 
                  color={getStatusColor(selectedRoute.status)} 
                  variant="light"
                  leftSection={getStatusIcon(selectedRoute.status)}
                >
                  {getStatusLabel(selectedRoute.status)}
                </Badge>
              </Grid.Col>
              {selectedRoute.observations && (
                <Grid.Col span={12}>
                  <Text size="sm" c="dimmed">Observações</Text>
                  <Text>{selectedRoute.observations}</Text>
                </Grid.Col>
              )}
            </Grid>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
