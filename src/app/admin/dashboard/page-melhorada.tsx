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
  RingProgress,
  Divider,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconUsers,
  IconRoute,
  IconTrendingUp,
  IconCash,
  IconAlertTriangle,
  IconCalendar,
  IconChartPie,
  IconRefresh,
  IconClock,
} from "@tabler/icons-react";

import {
  useNotifications,
  useRoutes,
  usePayments,
  useStudents,
} from "@/hooks/useApi";
import { Route, Payment, Notification, Student } from "@/services/api";

export default function AdminDashboard() {
  // Usar a API real com React Query
  const { data: notifications, isLoading: notificationsLoading } =
    useNotifications();
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: students, isLoading: studentsLoading } = useStudents();

  // Garantir que os dados são arrays
  const routesArray = Array.isArray(routes) ? routes : [];
  const paymentsArray = Array.isArray(payments) ? payments : [];
  const notificationsArray = Array.isArray(notifications) ? notifications : [];
  const studentsArray = Array.isArray(students) ? students : [];

  // Função para buscar nome do aluno pelo ID
  const getStudentName = (studentId: number) => {
    const student = studentsArray.find((s: Student) => s.id === studentId);
    return student?.name || `Aluno #${studentId}`;
  };

  // Cálculos financeiros detalhados
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthStr = `${currentMonth.toString().padStart(2, "0")}/${currentYear}`;

  // Filtrar pagamentos do mês atual
  const currentMonthPayments = paymentsArray.filter(
    (p: Payment) =>
      p.month === currentMonthStr ||
      p.month?.includes(`${currentMonth.toString().padStart(2, "0")}/`),
  );

  // Cálculos financeiros
  const totalRevenue = currentMonthPayments
    .filter((p: Payment) => p.status === "Pago")
    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

  const pendingAmount = currentMonthPayments
    .filter((p: Payment) => p.status === "Pendente")
    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

  const overdueAmount = currentMonthPayments
    .filter((p: Payment) => p.status === "Atrasado")
    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

  const totalExpected = currentMonthPayments.reduce(
    (sum: number, p: Payment) => sum + (p.amount || 0),
    0,
  );

  const paidCount = currentMonthPayments.filter(
    (p: Payment) => p.status === "Pago",
  ).length;
  const pendingCount = currentMonthPayments.filter(
    (p: Payment) => p.status === "Pendente",
  ).length;
  const overdueCount = currentMonthPayments.filter(
    (p: Payment) => p.status === "Atrasado",
  ).length;

  // Taxas e percentuais
  const collectionRate =
    totalExpected > 0 ? (totalRevenue / totalExpected) * 100 : 0;
  const defaultRate =
    currentMonthPayments.length > 0
      ? (overdueCount / currentMonthPayments.length) * 100
      : 0;

  // Meta mensal (assumindo R$ 150 por aluno)
  const monthlyTarget = studentsArray.length * 150;
  const targetProgress =
    monthlyTarget > 0 ? (totalRevenue / monthlyTarget) * 100 : 0;

  // Estatísticas principais
  const stats = [
    {
      title: "Total de Alunos",
      value: studentsArray.length.toString(),
      diff: "+12%",
      icon: IconUsers,
      color: "blue",
      description: "Alunos cadastrados",
    },
    {
      title: "Rotas Ativas",
      value: routesArray
        .filter(
          (route: Route) =>
            route.status === "EmAndamento" || route.status === "Planejada",
        )
        .length.toString(),
      diff: "+2",
      icon: IconRoute,
      color: "green",
      description: "Rotas em operação",
    },
    {
      title: "Receita do Mês",
      value: `R$ ${totalRevenue.toFixed(0)}`,
      diff: `${targetProgress.toFixed(1)}%`,
      icon: IconCash,
      color: totalRevenue >= monthlyTarget * 0.8 ? "green" : "orange",
      description: "Arrecadação atual",
    },
    {
      title: "Taxa de Cobrança",
      value: `${collectionRate.toFixed(1)}%`,
      diff:
        collectionRate >= 90
          ? "Excelente"
          : collectionRate >= 80
            ? "Bom"
            : "Atenção",
      icon: IconChartPie,
      color:
        collectionRate >= 90
          ? "green"
          : collectionRate >= 80
            ? "yellow"
            : "red",
      description: "Eficiência de cobrança",
    },
  ];

  // Pagamentos em atraso (top 5)
  const overduePayments = paymentsArray
    .filter((p: Payment) => p.status === "Atrasado")
    .slice(0, 5);

  // Filtrar notificações recentes
  const recentNotifications = notificationsArray.slice(0, 4);

  // Rotas de hoje
  const today = new Date().toISOString().split("T")[0];
  const todayRoutes = routesArray
    .filter((route: Route) => route.date === today)
    .slice(0, 3);

  if (
    notificationsLoading ||
    routesLoading ||
    paymentsLoading ||
    studentsLoading
  ) {
    return (
      <Stack align="center" justify="center" h="50vh">
        <IconRefresh size="2rem" className="animate-spin" />
        <Text>Carregando dashboard...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Dashboard Administrativo</Title>
          <Text c="dimmed" size="sm">
            Visão geral do sistema -{" "}
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </div>
        <Tooltip label="Atualizar dados">
          <ActionIcon
            variant="light"
            size="lg"
            onClick={() => window.location.reload()}
          >
            <IconRefresh size="1.2rem" />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Cards de estatísticas principais */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              withBorder
              padding="lg"
              radius="md"
              shadow="sm"
            >
              <Group justify="space-between" mb="xs">
                <div style={{ flex: 1 }}>
                  <Text c="dimmed" size="sm" fw={500} tt="uppercase">
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl" mt="xs">
                    {stat.value}
                  </Text>
                  <Group gap="xs" mt="xs">
                    <Text c={stat.color} size="sm" fw={500}>
                      {stat.diff}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {stat.description}
                    </Text>
                  </Group>
                </div>
                <ThemeIcon
                  color={stat.color}
                  variant="light"
                  size={50}
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
        {/* Resumo financeiro detalhado */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder padding="lg" radius="md" shadow="sm">
            <Group justify="space-between" mb="md">
              <Title order={3}>
                Resumo Financeiro -{" "}
                {new Date().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </Title>
              <Badge variant="light" color="blue" size="lg">
                {currentMonthPayments.length} cobranças
              </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
              <div>
                <Group gap="xs" mb="xs">
                  <IconCash size="1rem" color="green" />
                  <Text size="sm" c="dimmed">
                    Recebido
                  </Text>
                </Group>
                <Text size="xl" fw={700} c="green">
                  R$ {totalRevenue.toFixed(2)}
                </Text>
                <Text size="xs" c="dimmed">
                  {paidCount} pagamentos
                </Text>
              </div>

              <div>
                <Group gap="xs" mb="xs">
                  <IconClock size="1rem" color="orange" />
                  <Text size="sm" c="dimmed">
                    Pendente
                  </Text>
                </Group>
                <Text size="xl" fw={700} c="orange">
                  R$ {pendingAmount.toFixed(2)}
                </Text>
                <Text size="xs" c="dimmed">
                  {pendingCount} pagamentos
                </Text>
              </div>

              <div>
                <Group gap="xs" mb="xs">
                  <IconAlertTriangle size="1rem" color="red" />
                  <Text size="sm" c="dimmed">
                    Em Atraso
                  </Text>
                </Group>
                <Text size="xl" fw={700} c="red">
                  R$ {overdueAmount.toFixed(2)}
                </Text>
                <Text size="xs" c="dimmed">
                  {overdueCount} pagamentos
                </Text>
              </div>

              <div>
                <Group gap="xs" mb="xs">
                  <IconTrendingUp size="1rem" color="blue" />
                  <Text size="sm" c="dimmed">
                    Meta Mensal
                  </Text>
                </Group>
                <Text size="xl" fw={700} c="blue">
                  R$ {monthlyTarget.toFixed(2)}
                </Text>
                <Text size="xs" c="dimmed">
                  {targetProgress.toFixed(1)}% atingido
                </Text>
              </div>
            </SimpleGrid>

            <Divider mb="md" />

            {/* Indicadores visuais */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Taxa de Cobrança
                </Text>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    {
                      value: collectionRate,
                      color:
                        collectionRate >= 90
                          ? "green"
                          : collectionRate >= 80
                            ? "yellow"
                            : "red",
                    },
                  ]}
                  label={
                    <Text
                      c={
                        collectionRate >= 90
                          ? "green"
                          : collectionRate >= 80
                            ? "yellow"
                            : "red"
                      }
                      fw={700}
                      ta="center"
                      size="lg"
                    >
                      {collectionRate.toFixed(1)}%
                    </Text>
                  }
                />
                <Text size="xs" c="dimmed" ta="center" mt="xs">
                  Meta: 95%
                </Text>
              </div>

              <div>
                <Text size="sm" fw={500} mb="xs">
                  Progresso da Meta
                </Text>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    {
                      value: Math.min(targetProgress, 100),
                      color:
                        targetProgress >= 100
                          ? "green"
                          : targetProgress >= 80
                            ? "blue"
                            : "orange",
                    },
                  ]}
                  label={
                    <Text
                      c={
                        targetProgress >= 100
                          ? "green"
                          : targetProgress >= 80
                            ? "blue"
                            : "orange"
                      }
                      fw={700}
                      ta="center"
                      size="lg"
                    >
                      {targetProgress.toFixed(0)}%
                    </Text>
                  }
                />
                <Text size="xs" c="dimmed" ta="center" mt="xs">
                  R$ {(monthlyTarget - totalRevenue).toFixed(0)} restante
                </Text>
              </div>

              <div>
                <Text size="sm" fw={500} mb="xs">
                  Taxa de Inadimplência
                </Text>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    {
                      value: Math.min(defaultRate, 100),
                      color:
                        defaultRate <= 5
                          ? "green"
                          : defaultRate <= 10
                            ? "yellow"
                            : "red",
                    },
                  ]}
                  label={
                    <Text
                      c={
                        defaultRate <= 5
                          ? "green"
                          : defaultRate <= 10
                            ? "yellow"
                            : "red"
                      }
                      fw={700}
                      ta="center"
                      size="lg"
                    >
                      {defaultRate.toFixed(1)}%
                    </Text>
                  }
                />
                <Text size="xs" c="dimmed" ta="center" mt="xs">
                  Meta: máx. 5%
                </Text>
              </div>
            </SimpleGrid>
          </Card>
        </Grid.Col>

        {/* Pagamentos em atraso */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder padding="lg" radius="md" shadow="sm" h="100%">
            <Group justify="space-between" mb="md">
              <Text fw={500} size="lg">
                Pagamentos em Atraso
              </Text>
              <Badge variant="light" color="red">
                {overdueCount} total
              </Badge>
            </Group>
            <Stack gap="sm">
              {overduePayments.length > 0 ? (
                overduePayments.map((payment: Payment) => (
                  <Paper
                    key={payment.id}
                    p="sm"
                    withBorder
                    radius="sm"
                    bg="red.0"
                  >
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {payment.studentId
                            ? getStudentName(payment.studentId)
                            : "Aluno não identificado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {payment.month} • R${" "}
                          {(payment.amount || 0).toFixed(2)}
                        </Text>
                      </div>
                      <Badge color="red" variant="light" size="xs">
                        Atrasado
                      </Badge>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  Nenhum pagamento em atraso! 🎉
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Notificações recentes */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg" radius="md" shadow="sm" h="100%">
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
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {notification.message}
                        </Text>
                      </div>
                      <Text size="xs" c="dimmed">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString(
                              "pt-BR",
                            )
                          : "Hoje"}
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

        {/* Rotas de hoje */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg" radius="md" shadow="sm" h="100%">
            <Group justify="space-between" mb="md">
              <Text fw={500} size="lg">
                Rotas de Hoje
              </Text>
              <Group gap="xs">
                <IconCalendar size="1rem" />
                <Text size="sm" c="dimmed">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Text>
              </Group>
            </Group>
            <Stack gap="sm">
              {todayRoutes.length > 0 ? (
                todayRoutes.map((route: Route) => (
                  <Paper key={route.id} p="sm" withBorder radius="sm">
                    <Group justify="space-between" align="center">
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {route.destination || `Rota #${route.id}`}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Motorista: {route.driverName || "N/A"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Saída: {route.departureTime || "N/A"}
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
                        {route.status || "Indefinido"}
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
    </Stack>
  );
}
