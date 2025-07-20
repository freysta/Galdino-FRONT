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
} from "@mantine/core";
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
import { notifications } from "@mantine/notifications";
import {
  useRoutes,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  useDrivers,
  useBuses,
  useInstitutions,
} from "@/hooks/useApi";
import { Route, Driver, Bus, Institution } from "@/services/api";

interface RouteForm {
  name?: string;
  destination: string;
  origin: string;
  date?: string;
  time?: string;
  departureTime: string;
  driver?: string;
  vehicle?: string;
  price?: number;
  capacity?: number;
  status: string;
  boardingPoints?: string[];
}

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
  const [formData, setFormData] = useState<RouteForm>({
    destination: "",
    origin: "",
    departureTime: "",
    status: "scheduled",
  });

  // Usar React Query hooks
  const { data: routes = [], isLoading, error } = useRoutes();
  const { data: drivers = [], isLoading: driversLoading } = useDrivers();
  const { data: buses = [], isLoading: busesLoading } = useBuses();
  const { data: institutions = [], isLoading: institutionsLoading } =
    useInstitutions();
  const createRouteMutation = useCreateRoute();
  const updateRouteMutation = useUpdateRoute();
  const deleteRouteMutation = useDeleteRoute();

  // Garantir que todos são arrays
  const routesArray = Array.isArray(routes) ? routes : [];
  const driversArray = Array.isArray(drivers) ? drivers : [];
  const busesArray = Array.isArray(buses) ? buses : [];
  const institutionsArray = Array.isArray(institutions) ? institutions : [];

  // Preparar dados para selects
  const driversSelectData = driversArray.map((driver: Driver) => ({
    value: driver.id?.toString() || "",
    label: driver.name || `Motorista #${driver.id}`,
  }));

  const busesSelectData = busesArray.map((bus: Bus) => ({
    value: bus.id?.toString() || "",
    label: `${bus.modelo} - ${bus.placa}` || `Ônibus #${bus.id}`,
  }));

  const institutionsSelectData = institutionsArray.map(
    (institution: Institution) => ({
      value: institution.id?.toString() || "",
      label: institution.nome || `Instituição #${institution.id}`,
    }),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planejada":
        return "orange";
      case "EmAndamento":
        return "blue";
      case "Concluida":
        return "green";
      case "Cancelada":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Planejada":
        return "Planejada";
      case "EmAndamento":
        return "Em Andamento";
      case "Concluida":
        return "Concluída";
      case "Cancelada":
        return "Cancelada";
      default:
        return status || "Desconhecido";
    }
  };

  const filteredRoutes = routesArray.filter((route: Route) => {
    const matchesSearch =
      route.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name || "",
      destination: route.destination || "",
      origin: route.origin || "",
      date: route.date || "",
      time: route.time || "",
      departureTime: route.departureTime || "",
      driver: route.driver || "",
      vehicle: route.vehicle || "",
      price: route.price || 0,
      capacity: route.capacity || 0,
      status: route.status || "scheduled",
      boardingPoints: route.boardingPoints || [],
    });
    open();
  };

  const handleDeleteClick = (route: Route) => {
    setRouteToDelete(route);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (routeToDelete?.id) {
      try {
        await deleteRouteMutation.mutateAsync(routeToDelete.id);
        notifications.show({
          title: "Sucesso",
          message: "Rota cancelada com sucesso!",
          color: "green",
        });
        setRouteToDelete(null);
        closeDeleteModal();
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao cancelar rota",
          color: "red",
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingRoute(null);
    setFormData({
      destination: "",
      origin: "",
      departureTime: "",
      status: "scheduled",
    });
    open();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || !formData.departureTime) {
      notifications.show({
        title: "Erro",
        message: "Destino e horário são obrigatórios",
        color: "red",
      });
      return;
    }

    try {
      // Usar estrutura original da API que funciona
      const routeData = {
        date: formData.date || new Date().toISOString().split("T")[0],
        destination: formData.destination as "Ida" | "Volta" | "Circular",
        departureTime: formData.departureTime,
        status: (() => {
          switch (formData.status) {
            case "scheduled":
              return "Planejada";
            case "in_progress":
              return "EmAndamento";
            case "completed":
              return "Concluida";
            case "cancelled":
              return "Cancelada";
            default:
              return "Planejada";
          }
        })() as "Planejada" | "EmAndamento" | "Concluida" | "Cancelada",
        driverId: parseInt(formData.driver || "1"),
      };

      if (editingRoute?.id) {
        await updateRouteMutation.mutateAsync({
          id: editingRoute.id,
          data: routeData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Rota atualizada com sucesso!",
          color: "green",
        });
      } else {
        await createRouteMutation.mutateAsync(routeData);
        notifications.show({
          title: "Sucesso",
          message: "Rota criada com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingRoute(null);
      // Resetar formData após salvar
      setFormData({
        destination: "",
        origin: "",
        departureTime: "",
        status: "scheduled",
      });
    } catch (error) {
      console.error("Erro ao salvar rota:", error);
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar rota. Verifique os dados e tente novamente.",
        color: "red",
      });
    }
  };

  const isOperationLoading =
    createRouteMutation.isPending ||
    updateRouteMutation.isPending ||
    deleteRouteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar rotas</p>
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
        <Title order={1}>Gerenciar Rotas</Title>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
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
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredRoutes.length} rota(s) encontrada(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de rotas */}
      <Card withBorder padding="md">
        {filteredRoutes.length === 0 ? (
          <Alert color="gray" mt="md">
            {searchTerm || statusFilter
              ? "Nenhuma rota encontrada"
              : "Nenhuma rota cadastrada"}
          </Alert>
        ) : (
          <>
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
                {paginatedRoutes.map((route: Route) => (
                  <Table.Tr key={route.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500} size="sm">
                          Rota {route.destination || route.tipo_rota || "Ida"}
                        </Text>
                        <Group gap="xs" mt="xs">
                          <IconMapPin size="0.8rem" color="gray" />
                          <Text size="xs" c="dimmed">
                            {route.destination === "Ida"
                              ? "Campus → Cidade"
                              : route.destination === "Volta"
                                ? "Cidade → Campus"
                                : route.destination === "Circular"
                                  ? "Rota Circular"
                                  : "Trajeto"}
                          </Text>
                        </Group>
                        {route.observacoes && (
                          <Text size="xs" c="blue" mt="xs">
                            {route.observacoes}
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>
                          {(() => {
                            const dateValue = route.date || route.data_rota;
                            if (dateValue) {
                              return new Date(dateValue).toLocaleDateString(
                                "pt-BR",
                              );
                            }
                            return new Date().toLocaleDateString("pt-BR");
                          })()}
                        </Text>
                        <Group gap="xs">
                          <IconClock size="0.8rem" color="blue" />
                          <Text size="sm" c="blue">
                            {route.departureTime ||
                              route.horario_saida ||
                              "08:00"}
                          </Text>
                          {route.horario_chegada && (
                            <>
                              <Text size="xs" c="dimmed">
                                →
                              </Text>
                              <Text size="sm" c="green">
                                {route.horario_chegada}
                              </Text>
                            </>
                          )}
                        </Group>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {route.driverName ||
                            driversArray.find(
                              (d) =>
                                d.id ===
                                (route.driverId || route.fk_id_motorista),
                            )?.name ||
                            "Motorista não atribuído"}
                        </Text>
                        <Group gap="xs" mt="xs">
                          <IconCar size="0.8rem" color="orange" />
                          <Text size="xs" c="dimmed">
                            {route.vehicle ||
                              busesArray.find(
                                (b) => b.id === route.fk_id_onibus,
                              )?.modelo ||
                              "Veículo não atribuído"}
                          </Text>
                        </Group>
                        {route.km_percorrido && (
                          <Text size="xs" c="dimmed" mt="xs">
                            {route.km_percorrido} km
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconUsers size="0.8rem" color="green" />
                        <Text size="sm">
                          {route.enrolled || 0}/
                          {route.capacity ||
                            busesArray.find((b) => b.id === route.fk_id_onibus)
                              ?.capacidade ||
                            40}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {(() => {
                          const capacity =
                            route.capacity ||
                            busesArray.find((b) => b.id === route.fk_id_onibus)
                              ?.capacidade ||
                            40;
                          const enrolled = route.enrolled || 0;
                          return Math.round((enrolled / capacity) * 100);
                        })()}
                        % ocupado
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(route.status)}
                        variant="light"
                      >
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
          </>
        )}
      </Card>

      {/* Modal de adicionar/editar rota */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingRoute ? "Editar Rota" : "Adicionar Rota"}
        size="lg"
      >
        <form onSubmit={handleSave}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Tipo de Rota"
                  placeholder="Selecione o tipo"
                  required
                  data={[
                    { value: "Ida", label: "Ida" },
                    { value: "Volta", label: "Volta" },
                    { value: "Circular", label: "Circular" },
                  ]}
                  value={formData.destination}
                  onChange={(value) =>
                    setFormData({ ...formData, destination: value || "" })
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Instituição"
                  placeholder="Selecione uma instituição"
                  required
                  data={institutionsSelectData}
                  value={formData.origin}
                  onChange={(value) =>
                    setFormData({ ...formData, origin: value || "" })
                  }
                  searchable
                  disabled={institutionsLoading}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Data"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Horário de Saída"
                  placeholder="HH:MM"
                  type="time"
                  required
                  value={formData.departureTime}
                  onChange={(e) =>
                    setFormData({ ...formData, departureTime: e.target.value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Horário de Chegada"
                  placeholder="HH:MM"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Motorista"
                  placeholder="Selecione um motorista"
                  required
                  data={driversSelectData}
                  value={formData.driver}
                  onChange={(value) =>
                    setFormData({ ...formData, driver: value || "" })
                  }
                  searchable
                  disabled={driversLoading}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Ônibus"
                  placeholder="Selecione um ônibus"
                  required
                  data={busesSelectData}
                  value={formData.vehicle}
                  onChange={(value) =>
                    setFormData({ ...formData, vehicle: value || "" })
                  }
                  searchable
                  disabled={busesLoading}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="KM Percorrido"
                  placeholder="0"
                  type="number"
                  step="0.1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
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
                  value={formData.status}
                  onChange={(value) =>
                    setFormData({ ...formData, status: value || "Planejada" })
                  }
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={close}
                disabled={isOperationLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingRoute ? "Salvar" : "Adicionar"}
              </Button>
            </Group>
          </Stack>
        </form>
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
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={deleteRouteMutation.isPending}
            >
              Cancelar Rota
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
