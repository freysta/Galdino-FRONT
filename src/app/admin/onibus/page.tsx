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
  NumberInput,
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
  IconBus,
  IconUsers,
  IconCalendar,
  IconAlertCircle,
} from "@tabler/icons-react";

import {
  useBuses,
  useCreateBus,
  useUpdateBus,
  useDeleteBus,
  type Bus,
  type BusStatus,
} from "@/hooks/useApi";

export default function OnibusPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  const { data: buses = [], isLoading, error } = useBuses();
  const createMutation = useCreateBus();
  const updateMutation = useUpdateBus();
  const deleteMutation = useDeleteBus();

  const busesArray = Array.isArray(buses) ? buses : [];

  const filteredBuses = busesArray.filter((bus: Bus) => {
    const matchesSearch =
      bus.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.modelo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || bus.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    open();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este ônibus?")) {
      try {
        await deleteMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Ônibus excluído com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir ônibus",
          color: "red",
        });
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const busData = {
        placa: formData.get("placa") as string,
        modelo: formData.get("modelo") as string,
        ano: parseInt(formData.get("ano") as string),
        capacidade: parseInt(formData.get("capacidade") as string),
        status: formData.get("status") as BusStatus,
      };

      if (editingBus?.id) {
        await updateMutation.mutateAsync({
          id: editingBus.id,
          data: busData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Ônibus atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(busData);
        notifications.show({
          title: "Sucesso",
          message: "Ônibus criado com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingBus(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar ônibus",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setEditingBus(null);
    open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "green";
      case "Manutenção":
        return "orange";
      case "Inativo":
        return "red";
      default:
        return "gray";
    }
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBuses = filteredBuses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalBuses = busesArray.length;
  const activeBuses = busesArray.filter(
    (b: Bus) => b.status === "Ativo",
  ).length;
  const maintenanceBuses = busesArray.filter(
    (b: Bus) => b.status === "Manutenção",
  ).length;
  const inactiveBuses = busesArray.filter(
    (b: Bus) => b.status === "Inativo",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando ônibus...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar ônibus</Text>
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
          <Title order={1}>Gerenciar Ônibus</Title>
          <Text c="dimmed" mt="xs">
            Controle da frota de veículos
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Novo Ônibus
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total de Ônibus
                </Text>
                <Text size="xl" fw={700}>
                  {totalBuses}
                </Text>
              </div>
              <IconBus size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Ativos
                </Text>
                <Text size="xl" fw={700} c="green">
                  {activeBuses}
                </Text>
              </div>
              <IconUsers size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Manutenção
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {maintenanceBuses}
                </Text>
              </div>
              <IconCalendar size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Inativos
                </Text>
                <Text size="xl" fw={700} c="red">
                  {inactiveBuses}
                </Text>
              </div>
              <IconBus size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por placa ou modelo..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
              data={[
                { value: "Ativo", label: "Ativo" },
                { value: "Manutenção", label: "Manutenção" },
                { value: "Inativo", label: "Inativo" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredBuses.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder padding="md">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Veículo</Table.Th>
                <Table.Th>Especificações</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedBuses.length > 0 ? (
                paginatedBuses.map((bus: Bus) => (
                  <Table.Tr key={bus.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>
                          {bus.placa || "Placa não informada"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ID: {bus.id || "N/A"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap="xs">
                        <Text size="sm">
                          {bus.modelo || "Modelo não informado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Ano: {bus.ano || "N/A"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Capacidade: {bus.capacidade || 0} lugares
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(bus.status || "")}
                        variant="light"
                      >
                        {bus.status || "Indefinido"}
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
                            onClick={() => handleEdit(bus)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDelete(bus.id!)}
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
                  <Table.Td colSpan={4} style={{ textAlign: "center" }}>
                    <Text c="dimmed">
                      {searchTerm || statusFilter
                        ? "Nenhum ônibus encontrado"
                        : "Nenhum ônibus cadastrado"}
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
        title={editingBus ? "Editar Ônibus" : "Novo Ônibus"}
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
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Placa"
                  placeholder="ABC-1234"
                  name="placa"
                  required
                  defaultValue={editingBus?.placa}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  name="status"
                  data={[
                    { value: "Ativo", label: "Ativo" },
                    { value: "Manutenção", label: "Manutenção" },
                    { value: "Inativo", label: "Inativo" },
                  ]}
                  required
                  defaultValue={editingBus?.status}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Modelo"
                  placeholder="Ex: Mercedes-Benz OF 1721"
                  name="modelo"
                  required
                  defaultValue={editingBus?.modelo}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Ano"
                  placeholder="2020"
                  name="ano"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  required
                  defaultValue={editingBus?.ano}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Capacidade"
                  placeholder="40"
                  name="capacidade"
                  min={1}
                  max={100}
                  required
                  defaultValue={editingBus?.capacidade}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingBus ? "Salvar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
