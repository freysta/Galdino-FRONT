"use client";

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
} from "@mantine/core";
import {
  IconUsers,
  IconRoute,
  IconCreditCard,
  IconCar,
} from "@tabler/icons-react";

import {
  useDashboardStats,
  useNotifications,
  useRoutes,
  usePayments,
} from "@/hooks/useApi";
import { DashboardStats, Route, Payment, Notification } from "@/services/api";

export default function AdminDashboard() {
  // Usar a API real com React Query
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: notifications, isLoading: notificationsLoading } =
    useNotifications();
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  // Garantir que os dados são arrays
  const routesArray = Array.isArray(routes) ? routes : [];
  const paymentsArray = Array.isArray(payments) ? payments : [];
  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  // Calcular estatísticas baseadas nos dados reais
  const stats = [
    {
      title: "Total de Alunos",
      value:
        (dashboardStats as DashboardStats)?.totalStudents?.toString() ||
        routesArray
          .reduce((total, route) => total + (route.enrolled || 0), 0)
          .toString() ||
        "10",
      diff: "+12%",
      icon: IconUsers,
      color: "blue",
    },
    {
      title: "Rotas do Dia",
      value:
        routesArray
          .filter(
            (route: Route) =>
              route.status === "Planejada" || route.status === "EmAndamento",
          )
          .length.toString() || "0",
      diff: "+2",
      icon: IconRoute,
      color: "green",
    },
    {
      title: "Pagamentos Pendentes",
      value:
        paymentsArray
          .filter((payment: Payment) => payment.status === "Pendente")
          .length.toString() || "0",
      diff: "-5%",
      icon: IconCreditCard,
      color: "orange",
    },
    {
      title: "Motoristas Ativos",
      value:
        (dashboardStats as DashboardStats)?.totalDrivers?.toString() ||
        new Set(
          routesArray
            .map((route) => route.driverId || route.fk_id_motorista)
            .filter(Boolean),
        ).size.toString() ||
        "11",
      diff: "+1",
      icon: IconCar,
      color: "violet",
    },
  ];

  // Filtrar notificações recentes (últimas 4) ou criar notificações padrão
  const recentNotifications =
    notificationsArray.length > 0
      ? notificationsArray.slice(0, 4)
      : [
          {
            id: 1,
            title: "Pagamento em Atraso",
            message:
              "Seu pagamento referente ao mês 01/2024 está em atraso. Regularize sua situação.",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Rota Cancelada",
            message:
              "A rota do dia 20/01/2024 foi cancelada devido às condições climáticas.",
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            title: "Novo Horário",
            message:
              "Informamos que a partir de segunda-feira o horário de saída será às 06:30h.",
            createdAt: new Date().toISOString(),
          },
          {
            id: 4,
            title: "Confirmação de Presença",
            message:
              "Por favor, confirme sua presença na rota de amanhã até às 20:00h.",
            createdAt: new Date().toISOString(),
          },
        ];

  // Filtrar rotas de hoje ou criar rotas padrão
  const todayRoutes =
    routesArray.length > 0
      ? routesArray.slice(0, 3)
      : [
          {
            id: 1,
            destination: "Ida",
            driverName: "N/A",
            enrolled: 0,
            departureTime: "06:30",
            status: "Planejada",
          },
          {
            id: 2,
            destination: "Volta",
            driverName: "N/A",
            enrolled: 0,
            departureTime: "17:00",
            status: "Planejada",
          },
          {
            id: 3,
            destination: "Ida",
            driverName: "N/A",
            enrolled: 0,
            departureTime: "06:30",
            status: "Planejada",
          },
        ];

  // Calcular resumo financeiro
  const totalRevenue = paymentsArray
    .filter((p: Payment) => p.status === "Pago")
    .reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const pendingAmount = paymentsArray
    .filter((p: Payment) => p.status === "Pendente")
    .reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const overdueCount = paymentsArray.filter(
    (p: Payment) => p.status === "Atrasado",
  ).length;
  const totalPayments = paymentsArray.length || 1;
  const defaultRate = Math.round((overdueCount / totalPayments) * 100);

  if (
    statsLoading ||
    notificationsLoading ||
    routesLoading ||
    paymentsLoading
  ) {
    return <div>Carregando dashboard...</div>;
  }

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
        {/* Últimas notificações */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Group justify="space-between" mb="md">
              <Text fw={500} size="lg">
                Últimas Notificações
              </Text>
              <Badge variant="light" color="blue">
                {recentNotifications.length} novas
              </Badge>
            </Group>
            <Stack gap="sm">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification: Notification) => (
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
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString(
                              "pt-BR",
                            )
                          : "N/A"}
                      </Text>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  Nenhuma notificação recente
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Rotas recentes */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg" radius="md" h="100%">
            <Text fw={500} size="lg" mb="md">
              Rotas de Hoje
            </Text>
            <Stack gap="sm">
              {todayRoutes.length > 0 ? (
                todayRoutes.map((route: Route) => (
                  <Paper key={route.id} p="sm" withBorder radius="sm">
                    <Group justify="space-between" align="center">
                      <div>
                        <Text size="sm" fw={500}>
                          {route.destination || route.name || "Rota sem nome"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Motorista: {route.driverName || route.driver || "N/A"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {route.enrolled || 0} alunos •{" "}
                          {route.departureTime || route.time || "N/A"}
                        </Text>
                      </div>
                      <Badge
                        color={
                          route.status === "Concluida"
                            ? "green"
                            : route.status === "EmAndamento"
                              ? "blue"
                              : route.status === "Planejada"
                                ? "orange"
                                : "gray"
                        }
                        variant="light"
                        size="sm"
                      >
                        {route.status === "Planejada"
                          ? "Planejada"
                          : route.status === "EmAndamento"
                            ? "Em Andamento"
                            : route.status === "Concluida"
                              ? "Concluída"
                              : route.status === "Cancelada"
                                ? "Cancelada"
                                : route.status || "Planejada"}
                      </Badge>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  Nenhuma rota programada para hoje
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Resumo financeiro */}
      <Card withBorder padding="lg" radius="md">
        <Title order={3} mb="md">
          Resumo Financeiro -{" "}
          {new Date().toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Receita Total
            </Text>
            <Text size="xl" fw={700} c="green">
              R$ {totalRevenue.toFixed(2)}
            </Text>
            <Progress value={85} color="green" size="sm" mt="xs" />
            <Text size="xs" c="dimmed" mt="xs">
              85% da meta mensal
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Pagamentos Pendentes
            </Text>
            <Text size="xl" fw={700} c="orange">
              R$ {pendingAmount.toFixed(2)}
            </Text>
            <Progress value={15} color="orange" size="sm" mt="xs" />
            <Text size="xs" c="dimmed" mt="xs">
              {
                paymentsArray.filter((p: Payment) => p.status === "Pendente")
                  .length
              }{" "}
              alunos pendentes
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Taxa de Inadimplência
            </Text>
            <Text size="xl" fw={700} c="red">
              {defaultRate}%
            </Text>
            <Progress value={defaultRate} color="red" size="sm" mt="xs" />
            <Text size="xs" c="dimmed" mt="xs">
              Meta: máx. 5%
            </Text>
          </div>
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
