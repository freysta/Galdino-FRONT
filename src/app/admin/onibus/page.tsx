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
  Alert,
  Select,
  NumberInput,
  Grid,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconBus,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  useBuses,
  useCreateBus,
  useUpdateBus,
  useDeleteBus,
} from "@/hooks/useApi";
import { Bus } from "@/services/api";

interface BusForm {
  placa: string;
  modelo: string;
  ano: number;
  capacidade: number;
  status: "Ativo" | "Manutenção" | "Inativo";
}

export default function BusesPage() {
  const [opened, setOpened] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusForm>({
    placa: "",
    modelo: "",
    ano: new Date().getFullYear(),
    capacidade: 40,
    status: "Ativo",
  });

  // Usar React Query hooks
  const { data: buses = [], isLoading, error } = useBuses();
  const createBusMutation = useCreateBus();
  const updateBusMutation = useUpdateBus();
  const deleteBusMutation = useDeleteBus();

  // Garantir que buses é um array
  const busesArray = Array.isArray(buses) ? buses : [];

  const validateForm = () => {
    if (!formData.placa) {
      notifications.show({
        title: "Erro",
        message: "Placa é obrigatória",
        color: "red",
      });
      return false;
    }
    if (!formData.modelo) {
      notifications.show({
        title: "Erro",
        message: "Modelo é obrigatório",
        color: "red",
      });
      return false;
    }
    if (
      !formData.ano ||
      formData.ano < 1990 ||
      formData.ano > new Date().getFullYear() + 1
    ) {
      notifications.show({
        title: "Erro",
        message: "Ano inválido",
        color: "red",
      });
      return false;
    }
    if (
      !formData.capacidade ||
      formData.capacidade < 1 ||
      formData.capacidade > 100
    ) {
      notifications.show({
        title: "Erro",
        message: "Capacidade deve ser entre 1 e 100",
        color: "red",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingBus) {
        await updateBusMutation.mutateAsync({
          id: editingBus.id!,
          data: formData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Ônibus atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createBusMutation.mutateAsync(formData as Bus);
        notifications.show({
          title: "Sucesso",
          message: "Ônibus criado com sucesso!",
          color: "green",
        });
      }
      handleCloseModal();
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar ônibus",
        color: "red",
      });
    }
  };

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    setFormData({
      placa: bus.placa || "",
      modelo: bus.modelo || "",
      ano: bus.ano || new Date().getFullYear(),
      capacidade: bus.capacidade || 40,
      status: bus.status || "Ativo",
    });
    setOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este ônibus?")) {
      try {
        await deleteBusMutation.mutateAsync(id);
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

  const handleCloseModal = () => {
    setOpened(false);
    setEditingBus(null);
    setFormData({
      placa: "",
      modelo: "",
      ano: new Date().getFullYear(),
      capacidade: 40,
      status: "Ativo",
    });
  };

  const isOperationLoading =
    createBusMutation.isPending ||
    updateBusMutation.isPending ||
    deleteBusMutation.isPending;

  const filteredBuses = busesArray.filter((bus: Bus) => {
    const matchesSearch =
      bus.placa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.modelo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || bus.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
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
          <p className="text-red-600 mb-4">Erro ao carregar ônibus</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Gerenciar Ônibus
      </Title>

      <Paper shadow="sm" p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <TextInput
              placeholder="Buscar por placa ou modelo..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ width: 300 }}
            />
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
              style={{ width: 200 }}
            />
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            disabled={isOperationLoading}
          >
            Novo Ônibus
          </Button>
        </Group>

        <div style={{ position: "relative", minHeight: 400 }}>
          {filteredBuses.length === 0 && (
            <Alert color="gray" mt="md">
              {searchQuery || statusFilter
                ? "Nenhum ônibus encontrado"
                : "Nenhum ônibus cadastrado"}
            </Alert>
          )}

          {filteredBuses.length > 0 && (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Veículo</Table.Th>
                  <Table.Th>Capacidade</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th style={{ width: 80 }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredBuses.map((bus: Bus) => (
                  <Table.Tr key={bus.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <IconBus size={20} />
                        <div>
                          <Text fw={500}>
                            {bus.placa || "Placa não informada"}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {bus.modelo || "Modelo não informado"} -{" "}
                            {bus.ano || "N/A"}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text>{bus.capacidade || 0} lugares</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusBadgeColor(bus.status || "")}>
                        {bus.status || "Indefinido"}
                      </Badge>
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
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleEdit(bus)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDelete(bus.id!)}
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
          )}
        </div>
      </Paper>

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={editingBus ? "Editar Ônibus" : "Novo Ônibus"}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Placa"
              placeholder="ABC-1234"
              required
              value={formData.placa}
              onChange={(e) =>
                setFormData({ ...formData, placa: e.target.value })
              }
            />

            <TextInput
              label="Modelo"
              placeholder="Ex: Mercedes-Benz OF 1721"
              required
              value={formData.modelo}
              onChange={(e) =>
                setFormData({ ...formData, modelo: e.target.value })
              }
            />

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Ano"
                  required
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  value={formData.ano}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      ano: Number(value) || new Date().getFullYear(),
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Capacidade"
                  required
                  min={1}
                  max={100}
                  value={formData.capacidade}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      capacidade: Number(value) || 40,
                    })
                  }
                />
              </Grid.Col>
            </Grid>

            <Select
              label="Status"
              placeholder="Selecione o status"
              required
              data={[
                { value: "Ativo", label: "Ativo" },
                { value: "Manutenção", label: "Manutenção" },
                { value: "Inativo", label: "Inativo" },
              ]}
              value={formData.status}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  status:
                    (value as "Ativo" | "Manutenção" | "Inativo") || "Ativo",
                })
              }
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={handleCloseModal}
                disabled={isOperationLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingBus ? "Atualizar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
