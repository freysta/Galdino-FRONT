"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  Text,
  LoadingOverlay,
  Alert,
  Select,
  Textarea,
  Card,
  Timeline,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconCheck,
  IconDots,
  IconAlertTriangle,
  IconCar,
  IconMapPin,
  IconClock,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useDrivers,
  useRoutes,
  EmergencyType,
  EmergencyStatus,
  type Emergency,
  formatDate,
} from "@/hooks/useApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface EmergencyForm {
  type: EmergencyType;
  description: string;
  location: string;
  routeId: number;
  driverId: number;
}

export default function EmergenciesPage() {
  const [opened, setOpened] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    EmergencyStatus | undefined
  >();
  const queryClient = useQueryClient();

  const { data: emergencies, isLoading } = useQuery({
    queryKey: ["emergencies", statusFilter],
    queryFn: () => api.getEmergencies(statusFilter),
  });

  const { data: drivers } = useDrivers();
  const { data: routes } = useRoutes();

  const createMutation = useMutation({
    mutationFn: (
      data: Omit<
        Emergency,
        "id" | "createdAt" | "updatedAt" | "reportedAt" | "status"
      >,
    ) =>
      api.createEmergency({
        ...data,
        status: EmergencyStatus.Aberta,
        reportedAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      notifications.show({
        title: "Sucesso",
        message: "Emergência registrada com sucesso",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Erro ao registrar emergência",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Emergency> }) =>
      api.updateEmergency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      notifications.show({
        title: "Sucesso",
        message: "Emergência atualizada com sucesso",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Erro ao atualizar emergência",
        color: "red",
      });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (id: number) => api.resolveEmergency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
      notifications.show({
        title: "Sucesso",
        message: "Emergência resolvida com sucesso",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Erro ao resolver emergência",
        color: "red",
      });
    },
  });

  const form = useForm<EmergencyForm>({
    initialValues: {
      type: EmergencyType.Outros,
      description: "",
      location: "",
      routeId: 0,
      driverId: 0,
    },
    validate: {
      description: (value) => (!value ? "Descrição é obrigatória" : null),
      location: (value) => (!value ? "Localização é obrigatória" : null),
      routeId: (value) => (!value ? "Rota é obrigatória" : null),
      driverId: (value) => (!value ? "Motorista é obrigatório" : null),
    },
  });

  const handleSubmit = async (values: EmergencyForm) => {
    try {
      await createMutation.mutateAsync(values);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar emergência:", error);
    }
  };

  const handleResolve = async (id: number) => {
    if (
      window.confirm(
        "Tem certeza que deseja marcar esta emergência como resolvida?",
      )
    ) {
      try {
        await resolveMutation.mutateAsync(id);
      } catch (error) {
        console.error("Erro ao resolver emergência:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpened(false);
    form.reset();
  };

  const filteredEmergencies = emergencies?.filter(
    (emergency) =>
      emergency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadgeColor = (status: EmergencyStatus) => {
    switch (status) {
      case EmergencyStatus.Aberta:
        return "red";
      case EmergencyStatus.EmAtendimento:
        return "orange";
      case EmergencyStatus.Resolvida:
        return "green";
      case EmergencyStatus.Cancelada:
        return "gray";
      default:
        return "blue";
    }
  };

  const getTypeBadgeColor = (type: EmergencyType) => {
    switch (type) {
      case EmergencyType.Acidente:
        return "red";
      case EmergencyType.Pane:
        return "orange";
      case EmergencyType.ProblemaMedico:
        return "violet";
      case EmergencyType.Outros:
        return "gray";
      default:
        return "blue";
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Gerenciar Emergências
      </Title>

      <Paper shadow="sm" p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <TextInput
              placeholder="Buscar por descrição ou localização..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Filtrar por status"
              data={[
                { value: EmergencyStatus.Aberta, label: "Aberta" },
                {
                  value: EmergencyStatus.EmAtendimento,
                  label: "Em Atendimento",
                },
                { value: EmergencyStatus.Resolvida, label: "Resolvida" },
                { value: EmergencyStatus.Cancelada, label: "Cancelada" },
              ]}
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as EmergencyStatus | undefined)
              }
              clearable
              style={{ width: 200 }}
            />
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            color="red"
          >
            Registrar Emergência
          </Button>
        </Group>

        <div style={{ position: "relative", minHeight: 400 }}>
          <LoadingOverlay visible={isLoading} />

          {!isLoading && filteredEmergencies?.length === 0 && (
            <Alert color="gray" mt="md">
              Nenhuma emergência encontrada
            </Alert>
          )}

          {filteredEmergencies && filteredEmergencies.length > 0 && (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Descrição</Table.Th>
                  <Table.Th>Localização</Table.Th>
                  <Table.Th>Motorista/Rota</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Data</Table.Th>
                  <Table.Th style={{ width: 80 }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredEmergencies.map((emergency) => (
                  <Table.Tr key={emergency.id}>
                    <Table.Td>
                      <Badge color={getTypeBadgeColor(emergency.type)}>
                        {emergency.type}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {emergency.description}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconMapPin size={14} />
                        <Text size="sm">{emergency.location}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        <Group gap="xs">
                          <IconUser size={14} />
                          <Text size="sm">Motorista #{emergency.driverId}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconCar size={14} />
                          <Text size="sm">Rota #{emergency.routeId}</Text>
                        </Group>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusBadgeColor(emergency.status)}>
                        {emergency.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        <Text size="sm">
                          {formatDate(emergency.reportedAt)}
                        </Text>
                        {emergency.resolvedAt && (
                          <Text size="xs" c="dimmed">
                            Resolvida: {formatDate(emergency.resolvedAt)}
                          </Text>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconAlertTriangle size={14} />}
                            onClick={() => setSelectedEmergency(emergency)}
                          >
                            Ver Detalhes
                          </Menu.Item>
                          {emergency.status !== EmergencyStatus.Resolvida && (
                            <Menu.Item
                              color="green"
                              leftSection={<IconCheck size={14} />}
                              onClick={() => handleResolve(emergency.id)}
                            >
                              Marcar como Resolvida
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
      </Paper>

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title="Registrar Nova Emergência"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Tipo de Emergência"
              placeholder="Selecione o tipo"
              required
              data={[
                { value: EmergencyType.Acidente, label: "Acidente" },
                { value: EmergencyType.Pane, label: "Pane" },
                {
                  value: EmergencyType.ProblemaMedico,
                  label: "Problema Médico",
                },
                { value: EmergencyType.Outros, label: "Outros" },
              ]}
              {...form.getInputProps("type")}
            />

            <Textarea
              label="Descrição"
              placeholder="Descreva a emergência em detalhes..."
              required
              rows={4}
              {...form.getInputProps("description")}
            />

            <TextInput
              label="Localização"
              placeholder="Ex: Km 45 da Rodovia BR-101"
              required
              {...form.getInputProps("location")}
            />

            <Select
              label="Motorista"
              placeholder="Selecione o motorista"
              required
              data={
                drivers?.map((driver) => ({
                  value: driver.id.toString(),
                  label: driver.name,
                })) || []
              }
              {...form.getInputProps("driverId")}
              onChange={(value) =>
                form.setFieldValue("driverId", Number(value))
              }
            />

            <Select
              label="Rota"
              placeholder="Selecione a rota"
              required
              data={
                routes?.map((route) => ({
                  value: route.id.toString(),
                  label: `Rota #${route.id} - ${route.destination}`,
                })) || []
              }
              {...form.getInputProps("routeId")}
              onChange={(value) => form.setFieldValue("routeId", Number(value))}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="red"
                loading={createMutation.isPending}
              >
                Registrar Emergência
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={!!selectedEmergency}
        onClose={() => setSelectedEmergency(null)}
        title="Detalhes da Emergência"
        size="lg"
      >
        {selectedEmergency && (
          <Stack>
            <Card withBorder>
              <Stack>
                <Group justify="space-between">
                  <Badge
                    color={getTypeBadgeColor(selectedEmergency.type)}
                    size="lg"
                  >
                    {selectedEmergency.type}
                  </Badge>
                  <Badge
                    color={getStatusBadgeColor(selectedEmergency.status)}
                    size="lg"
                  >
                    {selectedEmergency.status}
                  </Badge>
                </Group>

                <div>
                  <Text fw={500} mb="xs">
                    Descrição
                  </Text>
                  <Text>{selectedEmergency.description}</Text>
                </div>

                <div>
                  <Text fw={500} mb="xs">
                    Localização
                  </Text>
                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text>{selectedEmergency.location}</Text>
                  </Group>
                </div>

                <Group grow>
                  <div>
                    <Text fw={500} mb="xs">
                      Motorista
                    </Text>
                    <Text>ID: {selectedEmergency.driverId}</Text>
                  </div>
                  <div>
                    <Text fw={500} mb="xs">
                      Rota
                    </Text>
                    <Text>ID: {selectedEmergency.routeId}</Text>
                  </div>
                </Group>

                <Timeline
                  active={
                    selectedEmergency.status === EmergencyStatus.Resolvida
                      ? 2
                      : 1
                  }
                >
                  <Timeline.Item
                    bullet={<IconAlertTriangle size={12} />}
                    title="Emergência Reportada"
                  >
                    <Text size="sm" c="dimmed">
                      {formatDate(selectedEmergency.reportedAt)}
                    </Text>
                  </Timeline.Item>
                  {selectedEmergency.resolvedAt && (
                    <Timeline.Item
                      bullet={<IconCheck size={12} />}
                      title="Emergência Resolvida"
                      lineVariant="dashed"
                    >
                      <Text size="sm" c="dimmed">
                        {formatDate(selectedEmergency.resolvedAt)}
                      </Text>
                    </Timeline.Item>
                  )}
                </Timeline>
              </Stack>
            </Card>

            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setSelectedEmergency(null)}
              >
                Fechar
              </Button>
              {selectedEmergency.status !== EmergencyStatus.Resolvida && (
                <Button
                  color="green"
                  leftSection={<IconCheck size={16} />}
                  onClick={() => {
                    handleResolve(selectedEmergency.id);
                    setSelectedEmergency(null);
                  }}
                  loading={resolveMutation.isPending}
                >
                  Marcar como Resolvida
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
