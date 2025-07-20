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
  IconRoute,
  IconClock,
  IconMapPin,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

import {
  useRoutes,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  type Route,
} from "@/hooks/useApi";

export default function RotasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const { data: routes = [], isLoading, error } = useRoutes();
  const createMutation = useCreateRoute();
  const updateMutation = useUpdateRoute();
  const deleteMutation = useDeleteRoute();

  const routesArray = Array.isArray(routes) ? routes : [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "planejada":
      case "scheduled":
        return "blue";
      case "emandamento":
      case "in_progress":
        return "orange";
      case "concluida":
      case "completed":
        return "green";
      case "cancelada":
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "planejada":
      case "scheduled":
        return "Planejada";
      case "emandamento":
      case "in_progress":
        return "Em Andamento";
      case "concluida":
      case "completed":
        return "Concluída";
      case "cancelada":
      case "cancelled":
        return "Cancelada";
      default:
        return status || "Desconhecido";
    }
  };

  const filteredRoutes = routesArray.filter((route: Route) => {
    const matchesSearch =
      route.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    open();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta rota?")) {
      try {
        await deleteMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Rota excluída com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir rota",
          color: "red",
        });
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const routeData = {
        date: formData.get("date") as string,
        destination: formData.get("destination") as
          | "Ida"
          | "Volta"
          | "Circular",
        departureTime: formData.get("departureTime") as string,
        status: formData.get("status") as
          | "Planejada"
          | "EmAndamento"
          | "Concluida"
          | "Cancelada",
        driverId: parseInt(formData.get("driverId") as string) || 1,
      };

      if (editingRoute?.id) {
        await updateMutation.mutateAsync({
          id: editingRoute.id,
          data: routeData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Rota atualizada com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(routeData);
        notifications.show({
          title: "Sucesso",
          message: "Rota criada com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingRoute(null);
    } catch (error) {
      console.error("Erro ao salvar rota:", error);
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar rota. Verifique os dados e tente novamente.",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setEditingRoute(null);
    open();
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalRoutes = routesArray.length;
  const scheduledRoutes = routesArray.filter(
    (r: Route) =>
      r.status?.toLowerCase() === "planejada" ||
      r.status?.toLowerCase() === "scheduled",
  ).length;
  const inProgressRoutes = routesArray.filter(
    (r: Route) =>
      r.status?.toLowerCase() === "emandamento" ||
      r.status?.toLowerCase() === "in_progress",
  ).length;
  const completedRoutes = routesArray.filter(
    (r: Route) =>
      r.status?.toLowerCase() === "concluida" ||
      r.status?.toLowerCase() === "completed",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando rotas...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar rotas</Text>
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
          <Title order={1}>Gerenciar Rotas</Title>
          <Text c="dimmed" mt="xs">
            Planejamento e controle das rotas
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Nova Rota
        </Button>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total de Rotas
                </Text>
                <Text size="xl" fw={700}>
                  {totalRoutes}
                </Text>
              </div>
              <IconRoute size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Planejadas
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {scheduledRoutes}
                </Text>
              </div>
              <IconClock size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Em Andamento
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {inProgressRoutes}
                </Text>
              </div>
              <IconMapPin size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Concluídas
                </Text>
                <Text size="xl" fw={700} c="green">
                  {completedRoutes}
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
              placeholder="Buscar por destino ou motorista..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
              data={[
                { value: "Planejada", label: "Planejada" },
                { value: "EmAndamento", label: "Em Andamento" },
                { value: "Concluida", label: "Concluída" },
                { value: "Cancelada", label: "Cancelada" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredRoutes.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de rotas */}
      <Card withBorder padding="md">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rota</Table.Th>
                <Table.Th>Data/Hora</Table.Th>
                <Table.Th>Motorista</Table.Th>
                <Table.Th>Destino</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((route: Route) => (
                  <Table.Tr key={route.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>
                          {route.name || `Rota #${route.id}`}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ID: {route.id || "N/A"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm">
                          {route.date
                            ? new Date(route.date).toLocaleDateString("pt-BR")
                            : "Não informado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {route.departureTime || "Não informado"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {route.driverName || "Não atribuído"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          route.destination === "Ida"
                            ? "blue"
                            : route.destination === "Volta"
                              ? "green"
                              : "orange"
                        }
                        variant="light"
                      >
                        {route.destination || "Não informado"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(route.status || "")}
                        variant="light"
                      >
                        {getStatusLabel(route.status || "")}
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
                          <Menu.Item
                            leftSection={<IconEdit size="0.9rem" />}
                            onClick={() => handleEdit(route)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDelete(route.id!)}
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
                        ? "Nenhuma rota encontrada"
                        : "Nenhuma rota cadastrada"}
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

      {/* Modal de adicionar/editar rota */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingRoute ? "Editar Rota" : "Nova Rota"}
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
                <TextInput
                  label="Nome da Rota"
                  placeholder="Digite o nome da rota"
                  name="name"
                  defaultValue={editingRoute?.name}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Data"
                  placeholder="YYYY-MM-DD"
                  name="date"
                  type="date"
                  required
                  defaultValue={editingRoute?.date}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Horário de Partida"
                  placeholder="HH:MM"
                  name="departureTime"
                  required
                  defaultValue={editingRoute?.departureTime}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Destino"
                  placeholder="Selecione o destino"
                  name="destination"
                  data={[
                    { value: "Ida", label: "Ida" },
                    { value: "Volta", label: "Volta" },
                    { value: "Circular", label: "Circular" },
                  ]}
                  required
                  defaultValue={editingRoute?.destination}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  name="status"
                  data={[
                    { value: "Planejada", label: "Planejada" },
                    { value: "EmAndamento", label: "Em Andamento" },
                    { value: "Concluida", label: "Concluída" },
                    { value: "Cancelada", label: "Cancelada" },
                  ]}
                  required
                  defaultValue={editingRoute?.status}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="ID do Motorista"
                  placeholder="Digite o ID do motorista"
                  name="driverId"
                  type="number"
                  required
                  defaultValue={editingRoute?.driverId}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingRoute ? "Salvar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
