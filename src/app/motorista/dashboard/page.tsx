"use client";

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
} from "@mantine/core";
import {
  IconRoute,
  IconUsers,
  IconClock,
  IconMapPin,
  IconCheck,
  IconAlertCircle,
  IconCar,
} from "@tabler/icons-react";

import { useRoutes, useAttendance, useBuses } from "@/hooks/useApiData";
import { Route, Attendance, Bus } from "@/services/api";

export default function MotoristaDashboard() {
  // Usar a API real
  const { data: routes, loading: routesLoading } = useRoutes();
  const { data: attendance, loading: attendanceLoading } = useAttendance();
  const { data: buses, loading: busesLoading } = useBuses();

  // Filtrar rotas do dia atual
  const today = new Date().toISOString().split("T")[0];
  const todayRoutes =
    routes
      ?.filter(
        (route: Route) => route.date === today || route.status === "Ativo",
      )
      .slice(0, 3) || [];

  // Calcular estatísticas
  const totalStudentsToday = todayRoutes.reduce(
    (sum: number, route: Route) => sum + (route.enrolled || 0),
    0,
  );

  const nextRoute = todayRoutes.find(
    (route: Route) => route.status === "Ativo" || route.status === "Agendada",
  );

  const stats = [
    {
      title: "Rotas do Dia",
      value: todayRoutes.length.toString(),
      description: `${todayRoutes.filter((r: Route) => r.status === "Ativo").length} ativas`,
      icon: IconRoute,
      color: "blue",
    },
    {
      title: "Alunos Esperados",
      value: totalStudentsToday.toString(),
      description: "Total do dia",
      icon: IconUsers,
      color: "green",
    },
    {
      title: "Próxima Saída",
      value: nextRoute?.departureTime || nextRoute?.time || "--:--",
      description: nextRoute?.destination || nextRoute?.name || "Nenhuma rota",
      icon: IconClock,
      color: "orange",
    },
  ];

  // Atividade recente simulada (pode ser expandida com dados reais)
  const recentActivity = [
    {
      time: "06:45",
      title: "Check-in realizado",
      description: "Veículo inspecionado e pronto para a primeira viagem",
      color: "green",
      icon: IconCheck,
    },
    {
      time: "07:00",
      title: "Rota iniciada",
      description: "Saída do terminal rumo ao destino",
      color: "blue",
      icon: IconRoute,
    },
    {
      time: "07:15",
      title: "Presença confirmada",
      description: `${attendance?.length || 0} presenças registradas`,
      color: "orange",
      icon: IconUsers,
    },
  ];

  // Informações do primeiro ônibus (pode ser expandido para o ônibus do motorista)
  const currentBus = buses?.[0] || null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
      case "Ativo":
        return "green";
      case "Pendente":
        return "orange";
      case "Agendada":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Ativo":
        return "Em Andamento";
      case "Agendada":
        return "Agendada";
      case "Concluída":
        return "Concluída";
      default:
        return status || "Desconhecido";
    }
  };

  if (routesLoading || attendanceLoading || busesLoading) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Dashboard do Motorista</Title>
          <Text c="dimmed">
            Bem-vindo! Hoje é{" "}
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
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
                <ThemeIcon
                  color={stat.color}
                  variant="light"
                  size={38}
                  radius="md"
                >
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
              <Text fw={500} size="lg">
                Rotas de Hoje
              </Text>
              <Badge variant="light" color="blue">
                {todayRoutes.length} rotas
              </Badge>
            </Group>
            <Stack gap="md">
              {todayRoutes.map((route: Route) => (
                <Card key={route.id} withBorder radius="sm" padding="md">
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500} size="sm">
                          {route.destination || route.name || "Rota sem nome"}
                        </Text>
                        <Badge
                          color={getStatusColor(route.status)}
                          variant="light"
                          size="sm"
                        >
                          {getStatusLabel(route.status)}
                        </Badge>
                      </Group>

                      <Group gap="md" mb="xs">
                        <Group gap="xs">
                          <IconClock size="0.8rem" />
                          <Text size="sm" c="dimmed">
                            {route.departureTime || route.time || "N/A"}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <IconMapPin size="0.8rem" />
                          <Text size="sm" c="dimmed">
                            {route.origin || "Ponto de partida"}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Veículo: {route.vehicle || "N/A"}
                        </Text>
                      </Group>

                      <Group justify="space-between" align="center">
                        <div>
                          <Text size="sm">
                            Capacidade: {route.enrolled || 0}/
                            {route.capacity || 0}
                          </Text>
                          <Progress
                            value={
                              route.capacity
                                ? ((route.enrolled || 0) / route.capacity) * 100
                                : 0
                            }
                            size="sm"
                            color={
                              (route.enrolled || 0) === (route.capacity || 0)
                                ? "green"
                                : "orange"
                            }
                            mt="xs"
                          />
                        </div>

                        {route.status === "Ativo" && (
                          <Button size="sm" variant="light">
                            Confirmar Presenças
                          </Button>
                        )}
                      </Group>
                    </div>
                  </Group>
                </Card>
              ))}

              {todayRoutes.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">
                  Nenhuma rota programada para hoje
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Atividade recente */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Text fw={500} size="lg" mb="md">
              Atividade de Hoje
            </Text>
            <Timeline
              active={recentActivity.length}
              bulletSize={24}
              lineWidth={2}
            >
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
                        <Text size="sm" fw={500}>
                          {activity.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {activity.time}
                        </Text>
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
        <Title order={3} mb="md">
          Informações do Veículo -{" "}
          {currentBus?.placa || "Veículo não atribuído"}
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Modelo
            </Text>
            <Text size="lg" fw={700}>
              {currentBus?.modelo || "N/A"}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Capacidade
            </Text>
            <Text size="lg" fw={700} c="blue">
              {currentBus?.capacidade || 0} lugares
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Ano
            </Text>
            <Text size="lg" fw={700}>
              {currentBus?.ano || "N/A"}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Status
            </Text>
            <Badge
              color={
                currentBus?.status === "Ativo"
                  ? "green"
                  : currentBus?.status === "Manutenção"
                    ? "orange"
                    : "red"
              }
              variant="light"
            >
              <Group gap="xs">
                <IconCheck size="0.8rem" />
                {currentBus?.status || "Desconhecido"}
              </Group>
            </Badge>
          </div>
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
