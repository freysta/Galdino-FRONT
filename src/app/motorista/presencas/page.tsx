"use client";

import { useState } from "react";
import {
  Title,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Select,
  Grid,
  Textarea,
  Alert,
  Divider,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconUsers,
  IconCheck,
  IconX,
  IconClock,
  IconMapPin,
  IconAlertCircle,
  IconSend,
  IconRefresh,
} from "@tabler/icons-react";

import {
  useCurrentUser,
  useDriverRoutes,
  useStudentsByRoute,
  useMarkAttendance,
  type Route,
  type Student,
} from "@/hooks/useApi";

export default function PresencasPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [observations, setObservations] = useState<{ [key: number]: string }>(
    {},
  );
  const [attendanceData, setAttendanceData] = useState<{
    [key: number]: "present" | "absent" | null;
  }>({});

  // Usar React Query hooks modernos
  const { data: currentUser } = useCurrentUser();
  const {
    data: routes = [],
    isLoading: routesLoading,
    error: routesError,
  } = useDriverRoutes(currentUser?.id || 0);
  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useStudentsByRoute(parseInt(selectedRoute) || 0);
  const markAttendanceMutation = useMarkAttendance();

  // Garantir que são arrays
  const routesArray = Array.isArray(routes) ? routes : [];
  const studentsArray = Array.isArray(students) ? students : [];

  // Filtrar rotas ativas
  const activeRoutes = routesArray.filter(
    (route: Route) =>
      route.status === "Ativo" ||
      route.status === "Agendada" ||
      route.status === "Planejada",
  );

  const selectedRouteData = activeRoutes.find(
    (r: Route) => r.id?.toString() === selectedRoute,
  );

  // Usar alunos da rota selecionada
  const routeStudents = selectedRoute ? studentsArray : [];

  const handlePresenceChange = (
    studentId: number,
    status: "present" | "absent",
  ) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleObservationChange = (studentId: number, observation: string) => {
    setObservations((prev) => ({
      ...prev,
      [studentId]: observation,
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedRoute) {
      notifications.show({
        title: "Erro",
        message: "Selecione uma rota primeiro",
        color: "red",
      });
      return;
    }

    try {
      // Criar registros de presença para cada aluno
      const attendancePromises = routeStudents.map((student: Student) => {
        const status = attendanceData[student.id!] || "absent";
        const observation = observations[student.id!] || "";

        return markAttendanceMutation.mutateAsync({
          studentId: student.id!,
          routeId: parseInt(selectedRoute),
          status: status === "present" ? "Presente" : "Ausente",
          date: new Date().toISOString().split("T")[0],
          observation,
        });
      });

      await Promise.all(attendancePromises);

      notifications.show({
        title: "Sucesso",
        message: "Presenças confirmadas com sucesso!",
        color: "green",
      });

      // Limpar dados
      setAttendanceData({});
      setObservations({});
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao confirmar presenças",
        color: "red",
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const presentCount = Object.values(attendanceData).filter(
    (status) => status === "present",
  ).length;
  const absentCount = Object.values(attendanceData).filter(
    (status) => status === "absent",
  ).length;
  const pendingCount = routeStudents.length - presentCount - absentCount;

  const getStatusColor = (status: "present" | "absent" | null) => {
    switch (status) {
      case "present":
        return "green";
      case "absent":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: "present" | "absent" | null) => {
    switch (status) {
      case "present":
        return "Presente";
      case "absent":
        return "Ausente";
      default:
        return "Pendente";
    }
  };

  const isOperationLoading = markAttendanceMutation.isPending;

  if (routesLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando dados...</Text>
        </div>
      </div>
    );
  }

  if (routesError || studentsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar dados</Text>
          </Alert>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Confirmar Presença</Title>
          <Text c="dimmed" mt="xs">
            Marque a presença dos alunos em suas rotas
          </Text>
        </div>
        <ActionIcon variant="light" size="lg" onClick={handleRefresh}>
          <IconRefresh size="1.2rem" />
        </ActionIcon>
      </Group>

      {/* Seleção de rota */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Selecione a rota"
              placeholder="Escolha uma rota"
              data={activeRoutes.map((route: Route) => ({
                value: route.id?.toString() || "",
                label: `${route.departureTime || route.time || "N/A"} - ${route.destination || route.name || "Rota sem nome"}`,
              }))}
              value={selectedRoute}
              onChange={(value) => setSelectedRoute(value || "")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {selectedRouteData && (
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Informações da Rota
                </Text>
                <Group gap="md">
                  <Group gap="xs">
                    <IconClock size="0.8rem" />
                    <Text size="sm">
                      {selectedRouteData.departureTime ||
                        selectedRouteData.time ||
                        "N/A"}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMapPin size="0.8rem" />
                    <Text size="sm">
                      {selectedRouteData.origin || "Ponto de partida"}
                    </Text>
                  </Group>
                  <Badge
                    color={
                      selectedRouteData.status === "Ativo" ? "green" : "orange"
                    }
                    variant="light"
                  >
                    {selectedRouteData.status === "Ativo"
                      ? "Em andamento"
                      : "Agendada"}
                  </Badge>
                </Group>
              </div>
            )}
          </Grid.Col>
        </Grid>
      </Card>

      {/* Resumo de presenças */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md" style={{ backgroundColor: "#f0f9ff" }}>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Presentes
                </Text>
                <Text size="xl" fw={700} c="green">
                  {presentCount}
                </Text>
              </div>
              <IconCheck size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md" style={{ backgroundColor: "#fef2f2" }}>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Ausentes
                </Text>
                <Text size="xl" fw={700} c="red">
                  {absentCount}
                </Text>
              </div>
              <IconX size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md" style={{ backgroundColor: "#f9fafb" }}>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Pendentes
                </Text>
                <Text size="xl" fw={700} c="gray">
                  {pendingCount}
                </Text>
              </div>
              <IconUsers size="2rem" color="gray" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Lista de alunos */}
      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            Lista de Alunos
          </Text>
          <Text size="sm" c="dimmed">
            {routeStudents.length} alunos cadastrados
          </Text>
        </Group>

        {!selectedRoute && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="blue" mb="md">
            <Text size="sm">
              Selecione uma rota para visualizar os alunos e confirmar as
              presenças.
            </Text>
          </Alert>
        )}

        {selectedRoute && routeStudents.length === 0 && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="gray" mb="md">
            <Text size="sm">Nenhum aluno encontrado para esta rota.</Text>
          </Alert>
        )}

        <Stack gap="md">
          {routeStudents.map((student: Student) => (
            <Card key={student.id} withBorder radius="sm" padding="md">
              <Grid align="center">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <div>
                    <Text fw={500}>{student.name || "Nome não informado"}</Text>
                    <Group gap="xs" mt="xs">
                      <IconMapPin size="0.8rem" />
                      <Text size="sm" c="dimmed">
                        {student.address || "Endereço não informado"}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {student.phone || "Telefone não informado"}
                    </Text>
                  </div>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Group gap="xs">
                    <Button
                      size="sm"
                      variant={
                        attendanceData[student.id!] === "present"
                          ? "filled"
                          : "light"
                      }
                      color="green"
                      leftSection={<IconCheck size="0.8rem" />}
                      onClick={() =>
                        handlePresenceChange(student.id!, "present")
                      }
                      disabled={isOperationLoading}
                    >
                      Presente
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        attendanceData[student.id!] === "absent"
                          ? "filled"
                          : "light"
                      }
                      color="red"
                      leftSection={<IconX size="0.8rem" />}
                      onClick={() =>
                        handlePresenceChange(student.id!, "absent")
                      }
                      disabled={isOperationLoading}
                    >
                      Ausente
                    </Button>
                  </Group>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 2 }}>
                  <Badge
                    color={getStatusColor(attendanceData[student.id!] || null)}
                    variant="light"
                  >
                    {getStatusLabel(attendanceData[student.id!] || null)}
                  </Badge>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Textarea
                    placeholder="Observações..."
                    size="sm"
                    rows={2}
                    value={observations[student.id!] || ""}
                    onChange={(e) =>
                      handleObservationChange(student.id!, e.target.value)
                    }
                    disabled={isOperationLoading}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </Stack>

        {selectedRoute && routeStudents.length > 0 && (
          <>
            <Divider my="lg" />

            {pendingCount > 0 && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                color="orange"
                mb="md"
              >
                <Text size="sm">
                  Ainda há {pendingCount} aluno(s) com presença pendente.
                  Confirme a presença de todos antes de finalizar.
                </Text>
              </Alert>
            )}

            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => {
                  setAttendanceData({});
                  setObservations({});
                }}
                disabled={isOperationLoading}
              >
                Limpar
              </Button>
              <Button
                leftSection={<IconSend size="1rem" />}
                onClick={handleSubmitAttendance}
                disabled={pendingCount > 0 || isOperationLoading}
                loading={isOperationLoading}
              >
                Confirmar Presenças
              </Button>
            </Group>
          </>
        )}
      </Card>
    </Stack>
  );
}
