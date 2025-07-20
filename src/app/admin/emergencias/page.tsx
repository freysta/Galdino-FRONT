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
  ActionIcon,
  Modal,
  Select,
  Grid,
  Text,
  Table,
  Pagination,
  Menu,
  Textarea,
  Alert,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconDots,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

import {
  useEmergencies,
  useCreateEmergency,
  useUpdateEmergency,
  useDeleteEmergency,
  useDrivers,
  useRoutes,
  formatDate,
  type Emergency,
} from "@/hooks/useApi";

export default function EmergenciasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEmergency, setEditingEmergency] = useState<Emergency | null>(
    null,
  );

  // Usar a API real
  const { data: emergencies, isLoading, error } = useEmergencies();
  const { data: drivers } = useDrivers();
  const { data: routes } = useRoutes();
  const createMutation = useCreateEmergency();
  const updateMutation = useUpdateEmergency();
  const deleteMutation = useDeleteEmergency();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta":
        return "red";
      case "Em Atendimento":
        return "yellow";
      case "Resolvida":
        return "green";
      case "Cancelada":
        return "gray";
      default:
        return "blue";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Acidente":
        return "red";
      case "Pane":
        return "orange";
      case "Problema Médico":
        return "violet";
      case "Outros":
        return "gray";
      default:
        return "blue";
    }
  };

  const filteredEmergencies = (emergencies || []).filter(
    (emergency: Emergency) => {
      const matchesSearch =
        emergency.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        emergency.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || emergency.status === statusFilter;
      return matchesSearch && matchesStatus;
    },
  );

  const handleEdit = (emergency: Emergency) => {
    setEditingEmergency(emergency);
    open();
  };

  const handleAddNew = () => {
    setEditingEmergency(null);
    open();
  };

  const handleSave = async (formData: FormData) => {
    try {
      const emergencyData = {
        type: formData.get("type") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        status: formData.get("status") as string,
        reportedAt: new Date().toISOString(),
      };

      if (editingEmergency) {
        await updateMutation.mutateAsync({
          id: editingEmergency.id!,
          data: emergencyData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Emergência atualizada com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(emergencyData);
        notifications.show({
          title: "Sucesso",
          message: "Emergência registrada com sucesso!",
          color: "green",
        });
      }
      close();
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar emergência. Tente novamente.",
        color: "red",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta emergência?")) {
      try {
        await deleteMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Emergência excluída com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir emergência. Tente novamente.",
          color: "red",
        });
      }
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { status: "Resolvida", resolvedAt: new Date().toISOString() },
      });
      notifications.show({
        title: "Sucesso",
        message: "Emergência marcada como resolvida!",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao resolver emergência. Tente novamente.",
        color: "red",
      });
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEmergencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmergencies = filteredEmergencies.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando emergências...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertTriangle size="1rem" />} color="red">
        <Text size="sm">
          Erro ao carregar emergências. Tente recarregar a página.
        </Text>
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Gerenciar Emergências</Title>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          color="red"
        >
          Registrar Emergência
        </Button>
      </Group>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por descrição ou localização..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
              data={[
                { value: "Aberta", label: "Aberta" },
                { value: "Em Atendimento", label: "Em Atendimento" },
                { value: "Resolvida", label: "Resolvida" },
                { value: "Cancelada", label: "Cancelada" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredEmergencies.length} emergência(s) encontrada(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de emergências */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Descrição</Table.Th>
              <Table.Th>Localização</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Data</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedEmergencies.map((emergency: Emergency) => (
              <Table.Tr key={emergency.id}>
                <Table.Td>
                  <Badge color={getTypeColor(emergency.type)} variant="light">
                    {emergency.type}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={2}>
                    {emergency.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{emergency.location}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={getStatusColor(emergency.status)}
                    variant="light"
                  >
                    {emergency.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(emergency.reportedAt)}</Text>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots size="1rem" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size="0.9rem" />}>
                        Visualizar
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size="0.9rem" />}
                        onClick={() => handleEdit(emergency)}
                      >
                        Editar
                      </Menu.Item>
                      {emergency.status !== "Resolvida" && (
                        <Menu.Item
                          color="green"
                          leftSection={<IconCheck size="0.9rem" />}
                          onClick={() => handleResolve(emergency.id!)}
                        >
                          Marcar como Resolvida
                        </Menu.Item>
                      )}
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size="0.9rem" />}
                        onClick={() => handleDelete(emergency.id!)}
                      >
                        Excluir
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
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

      {/* Modal de adicionar/editar emergência */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingEmergency ? "Editar Emergência" : "Registrar Emergência"}
        size="lg"
      >
        <Stack gap="md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave(formData);
            }}
          >
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Tipo de Emergência"
                  placeholder="Selecione o tipo"
                  name="type"
                  data={[
                    { value: "Acidente", label: "Acidente" },
                    { value: "Pane", label: "Pane" },
                    { value: "Problema Médico", label: "Problema Médico" },
                    { value: "Outros", label: "Outros" },
                  ]}
                  required
                  defaultValue={editingEmergency?.type}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Descrição"
                  placeholder="Descreva a emergência em detalhes..."
                  name="description"
                  required
                  rows={4}
                  defaultValue={editingEmergency?.description}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Localização"
                  placeholder="Ex: Km 45 da Rodovia BR-101"
                  name="location"
                  required
                  defaultValue={editingEmergency?.location}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Motorista (Opcional)"
                  placeholder="Selecione o motorista"
                  name="driverId"
                  data={
                    drivers?.map((driver) => ({
                      value: driver.id?.toString(),
                      label: driver.name,
                    })) || []
                  }
                  defaultValue={editingEmergency?.id?.toString()}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Rota (Opcional)"
                  placeholder="Selecione a rota"
                  name="routeId"
                  data={
                    routes?.map((route) => ({
                      value: route.id?.toString(),
                      label:
                        route.name || `${route.origin} - ${route.destination}`,
                    })) || []
                  }
                  defaultValue={editingEmergency?.id?.toString()}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  name="status"
                  data={[
                    { value: "Aberta", label: "Aberta" },
                    { value: "Em Atendimento", label: "Em Atendimento" },
                    { value: "Resolvida", label: "Resolvida" },
                    { value: "Cancelada", label: "Cancelada" },
                  ]}
                  required
                  defaultValue={editingEmergency?.status || "Aberta"}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="red"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingEmergency ? "Salvar" : "Registrar"}
              </Button>
            </Group>
          </form>
        </Stack>
      </Modal>
    </Stack>
  );
}
