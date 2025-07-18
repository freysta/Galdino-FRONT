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
  Alert,
  Textarea,
} from "@mantine/core";
// import { DateInput, TimeInput } from '@mantine/dates';
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconDots,
  IconClock,
  IconMapPin,
  IconUsers,
  IconAlertCircle,
  IconCar,
} from "@tabler/icons-react";

import { useRoutes, useApiOperations, apiOperations } from "@/hooks/useApiData";
import { Route } from "@/services/api";

export default function RotasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  // Usar a API real
  const { data: routes, loading, error, refetch } = useRoutes();
  const { execute, loading: operationLoading } = useApiOperations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "blue";
      case "in_progress":
        return "orange";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Agendada";
      case "in_progress":
        return "Em andamento";
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  };

  const filteredRoutes =
    routes?.filter((route: Route) => {
      const matchesSearch =
        (route.destination &&
          typeof route.destination === "string" &&
          route.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (route.origin &&
          typeof route.origin === "string" &&
          route.origin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (route.driver &&
          typeof route.driver === "string" &&
          route.driver.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (route.name &&
          typeof route.name === "string" &&
          route.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !statusFilter || route.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    open();
  };

  const handleDeleteClick = (route: Route) => {
    setRouteToDelete(route);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (routeToDelete?.id) {
      try {
        await execute(() => apiOperations.routes.delete(routeToDelete.id!));
        setRouteToDelete(null);
        closeDeleteModal();
        refetch();
      } catch (error) {
        alert("Erro ao excluir rota");
      }
    }
  };

  const handleAddNew = () => {
    setEditingRoute(null);
    open();
  };

  const handleSave = async (routeData: Partial<Route>) => {
    try {
      if (editingRoute?.id) {
        await execute(() =>
          apiOperations.routes.update(editingRoute.id!, routeData),
        );
      } else {
        await execute(() => apiOperations.routes.create(routeData as Route));
      }
      close();
      setEditingRoute(null);
      refetch();
    } catch (error) {
      alert("Erro ao salvar rota");
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Gerenciar Rotas</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
          Adicionar Rota
        </Button>
      </Group>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por destino, origem ou motorista..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
              data={[
                { value: "scheduled", label: "Agendada" },
                { value: "in_progress", label: "Em andamento" },
                { value: "completed", label: "Concluída" },
                { value: "cancelled", label: "Cancelada" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredRoutes.length} rota(s) encontrada(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de rotas */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rota</Table.Th>
              <Table.Th>Data/Hora</Table.Th>
              <Table.Th>Motorista/Veículo</Table.Th>
              <Table.Th>Ocupação</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedRoutes.map((route) => (
              <Table.Tr key={route.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>
                      {route.destination || route.name || "Sem nome"}
                    </Text>
                    <Group gap="xs" mt="xs">
                      <IconMapPin size="0.8rem" />
                      <Text size="xs" c="dimmed">
                        De: {route.origin || "N/A"}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      R$ {route.price ? route.price.toFixed(2) : "0.00"}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <Text size="sm">
                      {route.date
                        ? new Date(route.date).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </Text>
                    <Group gap="xs">
                      <IconClock size="0.8rem" />
                      <Text size="sm">
                        {route.time || route.departureTime || "N/A"}
                      </Text>
                    </Group>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={500}>
                      {route.driver || "Não atribuído"}
                    </Text>
                    <Group gap="xs" mt="xs">
                      <IconCar size="0.8rem" />
                      <Text size="xs" c="dimmed">
                        {route.vehicle || "Não atribuído"}
                      </Text>
                    </Group>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconUsers size="0.8rem" />
                    <Text size="sm">
                      {route.enrolled || 0}/{route.capacity || 0}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {route.capacity
                      ? Math.round(
                          ((route.enrolled || 0) / route.capacity) * 100,
                        )
                      : 0}
                    % ocupado
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(route.status)} variant="light">
                    {getStatusLabel(route.status)}
                  </Badge>
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
                        onClick={() => handleEdit(route)}
                      >
                        Editar
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size="0.9rem" />}
                        onClick={() => handleDeleteClick(route)}
                      >
                        Cancelar
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

      {/* Modal de adicionar/editar rota */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingRoute ? "Editar Rota" : "Adicionar Rota"}
        size="lg"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Destino"
                placeholder="Ex: Campus Norte - UNIFESP"
                required
                defaultValue={editingRoute?.destination}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Origem"
                placeholder="Ex: Terminal Rodoviário"
                required
                defaultValue={editingRoute?.origin}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data"
                placeholder="DD/MM/AAAA"
                required
                defaultValue={editingRoute?.date}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Horário"
                placeholder="HH:MM"
                required
                defaultValue={editingRoute?.time}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Motorista"
                placeholder="Selecione um motorista"
                data={[
                  { value: "carlos", label: "Carlos Santos Silva" },
                  { value: "maria", label: "Maria Oliveira Costa" },
                  { value: "joao", label: "João Pereira Lima" },
                  { value: "ana", label: "Ana Paula Rodrigues" },
                ]}
                required
                defaultValue={editingRoute?.driver}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Veículo"
                placeholder="Selecione um veículo"
                data={[
                  { value: "onibus-001", label: "Ônibus 001 (40 lugares)" },
                  { value: "onibus-002", label: "Ônibus 002 (35 lugares)" },
                  { value: "onibus-003", label: "Ônibus 003 (40 lugares)" },
                  { value: "van-001", label: "Van 001 (15 lugares)" },
                ]}
                required
                defaultValue={editingRoute?.vehicle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Preço (R$)"
                placeholder="15.00"
                required
                defaultValue={editingRoute?.price?.toString()}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                data={[
                  { value: "scheduled", label: "Agendada" },
                  { value: "in_progress", label: "Em andamento" },
                  { value: "completed", label: "Concluída" },
                  { value: "cancelled", label: "Cancelada" },
                ]}
                required
                defaultValue={editingRoute?.status}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Pontos de embarque"
                placeholder="Digite os pontos de embarque separados por vírgula"
                defaultValue={editingRoute?.boardingPoints?.join(", ")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>
              {editingRoute ? "Salvar" : "Adicionar"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar cancelamento"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            <Text size="sm">
              Tem certeza que deseja cancelar a rota{" "}
              <strong>
                {routeToDelete?.destination || routeToDelete?.name}
              </strong>
              do dia {routeToDelete?.date}? Esta ação não pode ser desfeita.
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              Cancelar Rota
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
