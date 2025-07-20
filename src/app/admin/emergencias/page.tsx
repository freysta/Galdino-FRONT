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
  IconAlertCircle,
  IconClock,
} from "@tabler/icons-react";

// Como não temos hooks específicos para emergências, vou usar dados mock
// Em um sistema real, você implementaria useEmergencies, etc.
interface Emergency {
  id: number;
  type: string;
  description: string;
  location: string;
  status: string;
  reportedAt: string;
  resolvedAt?: string;
}

export default function EmergenciasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEmergency, setEditingEmergency] = useState<Emergency | null>(
    null,
  );

  // Mock data - em um sistema real, isso viria da API
  const [emergencies] = useState<Emergency[]>([
    {
      id: 1,
      type: "Acidente",
      description: "Colisão leve entre ônibus e carro particular",
      location: "Av. Principal, próximo ao shopping",
      status: "Resolvida",
      reportedAt: "2024-01-15T08:30:00Z",
      resolvedAt: "2024-01-15T09:15:00Z",
    },
    {
      id: 2,
      type: "Pane",
      description: "Problema no motor do ônibus",
      location: "Rua das Flores, 123",
      status: "Em Atendimento",
      reportedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: 3,
      type: "Problema Médico",
      description: "Passageiro passou mal durante a viagem",
      location: "Terminal Central",
      status: "Aberta",
      reportedAt: "2024-01-17T10:45:00Z",
    },
  ]);

  const isLoading = false;
  const error = null;

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

  const filteredEmergencies = emergencies.filter((emergency: Emergency) => {
    const matchesSearch =
      emergency.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emergency.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || emergency.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (emergency: Emergency) => {
    setEditingEmergency(emergency);
    open();
  };

  const handleAddNew = () => {
    setEditingEmergency(null);
    open();
  };

  const handleSave = async () => {
    try {
      // Simular salvamento
      notifications.show({
        title: "Sucesso",
        message: editingEmergency
          ? "Emergência atualizada com sucesso!"
          : "Emergência registrada com sucesso!",
        color: "green",
      });
      close();
      setEditingEmergency(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar emergência. Tente novamente.",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir esta emergência?")) {
      try {
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

  const handleResolve = async () => {
    try {
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

  const totalEmergencies = emergencies.length;
  const openEmergencies = emergencies.filter(
    (e) => e.status === "Aberta",
  ).length;
  const inProgressEmergencies = emergencies.filter(
    (e) => e.status === "Em Atendimento",
  ).length;
  const resolvedEmergencies = emergencies.filter(
    (e) => e.status === "Resolvida",
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
            Controle e acompanhamento de situações de emergência
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          color="red"
        >
          Registrar Emergência
        </Button>
      </Group>

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
                        color={getTypeColor(emergency.type)}
                        variant="light"
                      >
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
                      <Text size="sm">
                        {new Date(emergency.reportedAt).toLocaleDateString(
                          "pt-BR",
                        )}
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
                              onClick={() => handleResolve()}
                            >
                              Marcar como Resolvida
                            </Menu.Item>
                          )}
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDelete()}
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
                        : "Nenhuma emergência registrada"}
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

      <Modal
        opened={opened}
        onClose={close}
        title={editingEmergency ? "Editar Emergência" : "Registrar Emergência"}
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
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
              <Button type="submit" color="red">
                {editingEmergency ? "Salvar" : "Registrar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
