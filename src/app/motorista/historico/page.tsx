"use client";

import { useState } from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
} from "@tabler/icons-react";

import { useAttendance, useRoutes } from "@/hooks/useApiData";
import { Attendance, Route } from "@/services/api";

export default function HistoricoPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  // Usar a API real
  const { data: attendance, loading: attendanceLoading } = useAttendance();
  const { data: routes, loading: routesLoading } = useRoutes();

  // Processar dados para criar histórico de rotas
  const processRouteHistory = () => {
    if (!routes || !attendance) return [];

    // Agrupar presenças por rota e data
    const routeHistory: any[] = [];

    routes.forEach((route: Route) => {
      // Filtrar presenças desta rota
      const routeAttendance = attendance.filter(
        (att: Attendance) => att.routeId === route.id,
      );

      // Agrupar por data
      const attendanceByDate: { [key: string]: Attendance[] } = {};
      routeAttendance.forEach((att: Attendance) => {
        const date = att.date;
        if (!attendanceByDate[date]) {
          attendanceByDate[date] = [];
        }
        attendanceByDate[date].push(att);
      });

      // Criar entradas de histórico
      Object.entries(attendanceByDate).forEach(([date, dayAttendance]) => {
        const studentsPresent = dayAttendance.filter(
          (att) => att.status === "Presente",
        ).length;
        const studentsAbsent = dayAttendance.filter(
          (att) => att.status === "Ausente",
        ).length;
        const studentsExpected = dayAttendance.length;

        routeHistory.push({
          id: `${route.id}-${date}`,
          date: date,
          time: route.departureTime || route.time || "N/A",
          destination:
            route.destination || route.name || "Destino não informado",
          origin: route.origin || "Origem não informada",
          studentsExpected: studentsExpected,
          studentsPresent: studentsPresent,
          studentsAbsent: studentsAbsent,
          status:
            studentsPresent > 0
              ? "completed"
              : studentsExpected > 0
                ? "cancelled"
                : "completed",
          duration: "45 min", // Valor padrão - pode ser calculado
          distance: "25 km", // Valor padrão - pode ser calculado
          observations:
            dayAttendance.find((att) => att.observation)?.observation || "",
          routeData: route,
          attendanceData: dayAttendance,
        });
      });
    });

    // Ordenar por data (mais recente primeiro)
    return routeHistory.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  };

  const routeHistory = processRouteHistory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "delayed":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      case "delayed":
        return "Atrasada";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <IconCheck size="0.8rem" />;
      case "cancelled":
        return <IconX size="0.8rem" />;
      case "delayed":
        return <IconAlertCircle size="0.8rem" />;
      default:
        return null;
    }
  };

  const filteredRoutes = routeHistory.filter((route) => {
    const matchesSearch =
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const paginatedRoutes = filteredRoutes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalRoutes = filteredRoutes.length;
  const completedRoutes = filteredRoutes.filter(
    (r) => r.status === "completed",
  ).length;
  const cancelledRoutes = filteredRoutes.filter(
    (r) => r.status === "cancelled",
  ).length;
  const totalStudents = filteredRoutes.reduce(
    (sum, r) => sum + r.studentsPresent,
    0,
  );

  // Obter datas únicas para o filtro
  const uniqueDates = [...new Set(routeHistory.map((r) => r.date))]
    .sort()
    .reverse();

  if (attendanceLoading || routesLoading) {
    return <div>Carregando histórico...</div>;
  }

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
            <Text size="sm" c="dimmed" mb="xs">
              Total de Rotas
            </Text>
            <Text size="xl" fw={700}>
              {totalRoutes}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Concluídas
            </Text>
            <Text size="xl" fw={700} c="green">
              {completedRoutes}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Canceladas
            </Text>
            <Text size="xl" fw={700} c="red">
              {cancelledRoutes}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Total Passageiros
            </Text>
            <Text size="xl" fw={700} c="blue">
              {totalStudents}
            </Text>
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
                { value: "completed", label: "Concluída" },
                { value: "cancelled", label: "Cancelada" },
                { value: "delayed", label: "Atrasada" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Data"
              data={uniqueDates.map((date) => ({
                value: date,
                label: new Date(date).toLocaleDateString("pt-BR"),
              }))}
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
        {paginatedRoutes.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhum histórico de rota encontrado
          </Text>
        ) : (
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
                        {new Date(route.date).toLocaleDateString("pt-BR")}
                      </Text>
                      <Group gap="xs">
                        <IconClock size="0.8rem" />
                        <Text size="xs" c="dimmed">
                          {route.time}
                        </Text>
                      </Group>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {route.destination}
                      </Text>
                      <Group gap="xs" mt="xs">
                        <IconMapPin size="0.8rem" />
                        <Text size="xs" c="dimmed">
                          De: {route.origin}
                        </Text>
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
                      <Text size="xs" c="dimmed">
                        {route.distance}
                      </Text>
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
        )}

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
                <Text size="sm" c="dimmed">
                  Data
                </Text>
                <Text fw={500}>
                  {new Date(selectedRoute.date).toLocaleDateString("pt-BR")}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Horário
                </Text>
                <Text fw={500}>{selectedRoute.time}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">
                  Rota
                </Text>
                <Text fw={500}>
                  {selectedRoute.origin} → {selectedRoute.destination}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">
                  Esperados
                </Text>
                <Text fw={500}>{selectedRoute.studentsExpected}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">
                  Presentes
                </Text>
                <Text fw={500} c="green">
                  {selectedRoute.studentsPresent}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">
                  Ausentes
                </Text>
                <Text fw={500} c="red">
                  {selectedRoute.studentsAbsent}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Duração
                </Text>
                <Text fw={500}>{selectedRoute.duration}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Distância
                </Text>
                <Text fw={500}>{selectedRoute.distance}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">
                  Status
                </Text>
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
                  <Text size="sm" c="dimmed">
                    Observações
                  </Text>
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
