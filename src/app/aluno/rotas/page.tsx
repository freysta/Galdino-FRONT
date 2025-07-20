"use client";

import { useState } from "react";
import {
  Title,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Grid,
  Alert,
  Timeline,
  ThemeIcon,
  Divider,
  Loader,
} from "@mantine/core";
import {
  IconClock,
  IconMapPin,
  IconUsers,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconCar,
  IconPhone,
} from "@tabler/icons-react";

import {
  useRoutes,
  useDrivers,
  useBoardingPoints,
  type Route,
  type Driver,
  type BoardingPoint,
} from "@/hooks/useApi";

interface RouteStep {
  time: string;
  location: string;
  description: string;
  status: string;
}

export default function AlunoRotasPage() {
  // Usar a API real com React Query
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: drivers, isLoading: driversLoading } = useDrivers();
  const { data: boardingPoints, isLoading: boardingPointsLoading } =
    useBoardingPoints();

  // Filtrar rotas ativas e futuras
  const today = new Date().toISOString().split("T")[0];
  const activeRoutes =
    routes?.filter(
      (route: Route) => route.status === "Ativo" || route.status === "Agendada",
    ) || [];

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(
    activeRoutes[0] || null,
  );

  // Separar rotas de hoje e futuras
  const todayRoutes = activeRoutes.filter(
    (route: Route) => route.date === today,
  );
  const futureRoutes = activeRoutes
    .filter((route: Route) => route.date && route.date > today)
    .slice(0, 5); // Limitar a 5 próximas rotas

  // Encontrar dados do motorista da rota selecionada
  const selectedRouteDriver = selectedRoute?.driver
    ? drivers?.find((driver: Driver) => driver.name === selectedRoute.driver)
    : null;

  // Simular pontos de embarque da rota (pode ser expandido com relação real)
  const routeSteps =
    boardingPoints?.slice(0, 4).map((point: BoardingPoint, index: number) => ({
      time: `${7 + index}:${30 + index * 10}`,
      location: point.name,
      description:
        index === 0
          ? "Embarque - Chegue 10 minutos antes"
          : index === boardingPoints.length - 1
            ? "Destino final"
            : "Parada intermediária",
      status: "pending",
    })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "green";
      case "Agendada":
        return "orange";
      case "Cancelada":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Ativo":
        return "Confirmada";
      case "Agendada":
        return "Agendada";
      case "Cancelada":
        return "Cancelada";
      default:
        return status || "Desconhecido";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ativo":
        return <IconCheck size="0.8rem" />;
      case "Agendada":
        return <IconClock size="0.8rem" />;
      case "Cancelada":
        return <IconAlertCircle size="0.8rem" />;
      default:
        return null;
    }
  };

  if (routesLoading || driversLoading || boardingPointsLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando rotas...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Minhas Rotas</Title>
          <Text c="dimmed">Acompanhe suas viagens e horários</Text>
        </div>
      </Group>

      {/* Alerta importante */}
      <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
        <Text size="sm">
          <strong>Lembre-se:</strong> Chegue ao ponto de embarque pelo menos 10
          minutos antes do horário. Em caso de atraso, entre em contato com o
          motorista.
        </Text>
      </Alert>

      <Grid>
        {/* Rotas de hoje */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="md">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Rotas de Hoje -{" "}
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Text>

              {todayRoutes.length === 0 ? (
                <Alert icon={<IconInfoCircle size="1rem" />} color="gray">
                  <Text size="sm">Nenhuma rota programada para hoje.</Text>
                </Alert>
              ) : (
                <Stack gap="md">
                  {todayRoutes.map((route: Route) => (
                    <Card
                      key={route.id}
                      withBorder
                      radius="sm"
                      padding="md"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedRoute?.id === route.id
                            ? "#f0f9ff"
                            : undefined,
                        borderColor:
                          selectedRoute?.id === route.id
                            ? "#3b82f6"
                            : undefined,
                      }}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <Group justify="space-between" align="flex-start">
                        <div style={{ flex: 1 }}>
                          <Group justify="space-between" mb="xs">
                            <Text fw={500} size="sm">
                              {route.destination ||
                                route.name ||
                                "Destino não informado"}
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
                                <Text size="sm" c="dimmed">
                                  {route.departureTime || route.time || "N/A"}
                                </Text>
                              </Group>
                              <Group gap="xs">
                                <IconMapPin size="0.8rem" />
                                <Text size="sm" c="dimmed">
                                  {route.origin || "Ponto de embarque"}
                                </Text>
                              </Group>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Group gap="xs" mb="xs">
                                <IconCar size="0.8rem" />
                                <Text size="sm" c="dimmed">
                                  {route.vehicle || "Veículo não informado"}
                                </Text>
                              </Group>
                              <Group gap="xs">
                                <IconUsers size="0.8rem" />
                                <Text size="sm" c="dimmed">
                                  {route.enrolled || 0}/{route.capacity || 0}{" "}
                                  lugares
                                </Text>
                              </Group>
                            </Grid.Col>
                          </Grid>
                        </div>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>

            {/* Próximas rotas */}
            {futureRoutes.length > 0 && (
              <Card withBorder padding="lg">
                <Text fw={500} size="lg" mb="md">
                  Próximas Rotas
                </Text>
                <Stack gap="sm">
                  {futureRoutes.map((route: Route) => (
                    <Card key={route.id} withBorder radius="sm" padding="sm">
                      <Group justify="space-between">
                        <div>
                          <Text fw={500} size="sm">
                            {route.destination ||
                              route.name ||
                              "Destino não informado"}
                          </Text>
                          <Group gap="md" mt="xs">
                            <Group gap="xs">
                              <IconClock size="0.7rem" />
                              <Text size="xs" c="dimmed">
                                {route.date
                                  ? new Date(route.date).toLocaleDateString(
                                      "pt-BR",
                                    )
                                  : "Data não informada"}{" "}
                                - {route.departureTime || route.time || "N/A"}
                              </Text>
                            </Group>
                            <Group gap="xs">
                              <IconMapPin size="0.7rem" />
                              <Text size="xs" c="dimmed">
                                {route.origin || "Ponto de embarque"}
                              </Text>
                            </Group>
                          </Group>
                        </div>
                        <Badge
                          color={getStatusColor(route.status)}
                          variant="light"
                          size="sm"
                        >
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
            <Text fw={500} size="lg" mb="md">
              Detalhes da Rota
            </Text>

            {!selectedRoute ? (
              <Alert icon={<IconInfoCircle size="1rem" />} color="gray">
                <Text size="sm">Selecione uma rota para ver os detalhes.</Text>
              </Alert>
            ) : (
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Destino
                  </Text>
                  <Text fw={500}>
                    {selectedRoute.destination ||
                      selectedRoute.name ||
                      "Destino não informado"}
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Horário de Saída
                  </Text>
                  <Group gap="xs">
                    <IconClock size="0.8rem" />
                    <Text fw={500}>
                      {selectedRoute.departureTime ||
                        selectedRoute.time ||
                        "N/A"}
                    </Text>
                  </Group>
                </div>

                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Ponto de Embarque
                  </Text>
                  <Group gap="xs">
                    <IconMapPin size="0.8rem" />
                    <Text fw={500}>
                      {selectedRoute.origin ||
                        "Ponto de embarque não informado"}
                    </Text>
                  </Group>
                </div>

                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Motorista
                  </Text>
                  <Text fw={500}>
                    {selectedRoute.driver || "Motorista não atribuído"}
                  </Text>
                  {selectedRouteDriver?.phone && (
                    <Group gap="xs" mt="xs">
                      <IconPhone size="0.8rem" />
                      <Text size="sm" c="dimmed">
                        {selectedRouteDriver.phone}
                      </Text>
                    </Group>
                  )}
                </div>

                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Veículo
                  </Text>
                  <Group gap="xs">
                    <IconCar size="0.8rem" />
                    <Text fw={500}>
                      {selectedRoute.vehicle || "Veículo não informado"}
                    </Text>
                  </Group>
                </div>

                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Capacidade
                  </Text>
                  <Text fw={500}>
                    {selectedRoute.enrolled || 0}/{selectedRoute.capacity || 0}{" "}
                    passageiros
                  </Text>
                </div>

                {routeSteps.length > 0 && (
                  <>
                    <Divider />

                    <div>
                      <Text size="sm" c="dimmed" mb="md">
                        Trajeto da Rota
                      </Text>
                      <Timeline active={0} bulletSize={20} lineWidth={2}>
                        {routeSteps.map((step: RouteStep, index: number) => (
                          <Timeline.Item
                            key={index}
                            bullet={
                              <ThemeIcon
                                size={18}
                                variant="filled"
                                color="blue"
                                radius="xl"
                              >
                                <Text size="xs" fw={700}>
                                  {index + 1}
                                </Text>
                              </ThemeIcon>
                            }
                            title={
                              <Group gap="xs">
                                <Text size="sm" fw={500}>
                                  {step.location}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {step.time}
                                </Text>
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
                  </>
                )}

                {selectedRoute.status === "Agendada" && (
                  <Alert icon={<IconAlertCircle size="1rem" />} color="orange">
                    <Text size="sm">
                      Esta rota ainda não foi confirmada. Aguarde a confirmação
                      do motorista.
                    </Text>
                  </Alert>
                )}
              </Stack>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
