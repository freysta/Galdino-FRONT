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
  Loader,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";

// Simulando os hooks que não existem ainda
const useEmergencies = () => ({ data: [], isLoading: false, error: null });
const useCreateEmergency = () => ({
  mutateAsync: async () => {},
  isPending: false,
});
const useUpdateEmergency = () => ({
  mutateAsync: async () => {},
  isPending: false,
});
const useDeleteEmergency = () => ({
  mutateAsync: async () => {},
  isPending: false,
});

interface Emergency {
  id?: number;
  type?: string;
  description?: string;
  location?: string;
  status?: string;
  reportedAt?: string;
}

export default function EmergenciasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEmergency, setEditingEmergency] = useState<Emergency | null>(
    null,
  );

  const { data: emergencies = [], isLoading, error } = useEmergencies();
  const createMutation = useCreateEmergency();
  const updateMutation = useUpdateEmergency();
  const deleteMutation = useDeleteEmergency();

  const emergenciesArray = Array.isArray(emergencies) ? emergencies : [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "aberta":
        return "red";
      case "em atendimento":
        return "yellow";
      case "resolvida":
        return "green";
      case "cancelada":
        return "gray";
      default:
        return "blue";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "acidente":
        return "red";
      case "pane":
        return "orange";
      case "problema médico":
        return "violet";
      case "outros":
        return "gray";
      default:
        return "blue";
    }
  };

  const filteredEmergencies = emergenciesArray.filter(
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
          message: "Erro ao excluir emergência",
          color: "red",
        });
      }
    }
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

      if (editingEmergency?.id) {
        await updateMutation.mutateAsync({
          id: editingEmergency.id,
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
      setEditingEmergency(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar emergência",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setEditingEmergency(null);
    open();
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEmergencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmergencies = filteredEmergencies.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalEmergencies = emergenciesArray.length;
  const openEmergencies = emergenciesArray.filter(
    (e: Emergency) => e.status?.toLowerCase() === "aberta",
  ).length;
  const inProgressEmergencies = emergenciesArray.filter(
    (e: Emergency) => e.status?.toLowerCase() === "em atendimento",
  ).length;
  const resolvedEmergencies = emergenciesArray.filter(
    (e: Emergency) => e.status?.toLowerCase() === "resolvida",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando emergências...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar emergências</Text>
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
          <Title order={1}>Gerenciar Emergências</Title>
          <Text c="dimmed" mt="xs">
            Registro e controle de emergências
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
          color="red"
        >
          Nova Emergência
        </Button>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total de Emergências
                </Text>
                <Text size="xl" fw={700}>
                  {totalEmergencies}
                </Text>
              </div>
              <IconAlertTriangle size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Abertas
                </Text>
                <Text size="xl" fw={700} c="red">
                  {openEmergencies}
                </Text>
              </div>
              <IconAlertCircle size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Em Atendimento
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {inProgressEmergencies}
                </Text>
              </div>
              <IconClock size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Resolvidas
                </Text>
                <Text size="xl" fw={700} c="green">
                  {resolvedEmergencies}
                </Text>
              </div>
              <IconCheck size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

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
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
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
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredEmergencies.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de emergências */}
      <Card withBorder padding="md">
        <div className="overflow-x-auto">
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
              {paginatedEmergencies.length > 0 ? (
                paginatedEmergencies.map((emergency: Emergency) => (
                  <Table.Tr key={emergency.id}>
                    <Table.Td>
                      <Badge
                        color={getTypeColor(emergency.type || "")}
                        variant="light"
                      >
                        {emergency.type || "Não informado"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {emergency.description || "Sem descrição"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {emergency.location || "Não informado"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(emergency.status || "")}
                        variant="light"
                      >
                        {emergency.status || "Desconhecido"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {emergency.reportedAt
                          ? new Date(emergency.reportedAt).toLocaleDateString(
                              "pt-BR",
                            )
                          : "Não informado"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDots size="1rem" />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size="0.9rem" />}
                            onClick={() => handleEdit(emergency)}
                          >
                            Editar
                          </Menu.Item>
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
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} style={{ textAlign: "center" }}>
                    <Text c="dimmed">
                      {searchTerm || statusFilter
                        ? "Nenhuma emergência encontrada"
                        : "Nenhuma emergência cadastrada"}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>

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
        title={editingEmergency ? "Editar Emergência" : "Nova Emergência"}
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSave(formData);
          }}
        >
          <Stack gap="md">
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
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading} color="red">
                {editingEmergency ? "Salvar" : "Registrar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
