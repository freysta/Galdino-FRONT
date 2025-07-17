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
  NumberInput,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconBus,
  IconCalendar,
  IconTool,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useBuses,
  useCreateBus,
  useUpdateBus,
  useDeleteBus,
  BusStatus,
  type Bus,
  formatDate,
} from "@/hooks/useApi";

interface BusForm {
  plate: string;
  model: string;
  year: number;
  capacity: number;
  status: BusStatus;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export default function BusesPage() {
  const [opened, setOpened] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BusStatus | undefined>();

  const { data: buses, isLoading } = useBuses(statusFilter);

  const createMutation = useCreateBus();
  const updateMutation = useUpdateBus();
  const deleteMutation = useDeleteBus();

  const form = useForm<BusForm>({
    initialValues: {
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      capacity: 40,
      status: BusStatus.Ativo,
      lastMaintenance: "",
      nextMaintenance: "",
    },
    validate: {
      plate: (value) => (!value ? "Placa é obrigatória" : null),
      model: (value) => (!value ? "Modelo é obrigatório" : null),
      year: (value) => {
        const currentYear = new Date().getFullYear();
        if (!value) return "Ano é obrigatório";
        if (value < 1990 || value > currentYear + 1) return "Ano inválido";
        return null;
      },
      capacity: (value) => {
        if (!value) return "Capacidade é obrigatória";
        if (value < 1 || value > 100)
          return "Capacidade deve ser entre 1 e 100";
        return null;
      },
    },
  });

  const handleSubmit = async (values: BusForm) => {
    try {
      const busData = {
        ...values,
        lastMaintenance: values.lastMaintenance || undefined,
        nextMaintenance: values.nextMaintenance || undefined,
      };

      if (editingBus) {
        await updateMutation.mutateAsync({
          id: editingBus.id,
          data: busData,
        });
      } else {
        await createMutation.mutateAsync(busData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar ônibus:", error);
    }
  };

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    form.setValues({
      plate: bus.plate,
      model: bus.model,
      year: bus.year,
      capacity: bus.capacity,
      status: bus.status,
      lastMaintenance: bus.lastMaintenance || "",
      nextMaintenance: bus.nextMaintenance || "",
    });
    setOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este ônibus?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Erro ao excluir ônibus:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpened(false);
    setEditingBus(null);
    form.reset();
  };

  const filteredBuses = buses?.filter(
    (bus) =>
      bus.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.model.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadgeColor = (status: BusStatus) => {
    switch (status) {
      case BusStatus.Ativo:
        return "green";
      case BusStatus.Manutencao:
        return "orange";
      case BusStatus.Inativo:
        return "red";
      default:
        return "gray";
    }
  };

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
                { value: BusStatus.Ativo, label: "Ativo" },
                { value: BusStatus.Manutencao, label: "Manutenção" },
                { value: BusStatus.Inativo, label: "Inativo" },
              ]}
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as BusStatus | undefined)
              }
              clearable
              style={{ width: 200 }}
            />
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
          >
            Novo Ônibus
          </Button>
        </Group>

        <div style={{ position: "relative", minHeight: 400 }}>
          <LoadingOverlay visible={isLoading} />

          {!isLoading && filteredBuses?.length === 0 && (
            <Alert color="gray" mt="md">
              Nenhum ônibus encontrado
            </Alert>
          )}

          {filteredBuses && filteredBuses.length > 0 && (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Veículo</Table.Th>
                  <Table.Th>Capacidade</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Manutenção</Table.Th>
                  <Table.Th style={{ width: 80 }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredBuses.map((bus) => (
                  <Table.Tr key={bus.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <IconBus size={20} />
                        <div>
                          <Text fw={500}>{bus.plate}</Text>
                          <Text size="sm" c="dimmed">
                            {bus.model} - {bus.year}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text>{bus.capacity} lugares</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusBadgeColor(bus.status)}>
                        {bus.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        {bus.lastMaintenance && (
                          <Group gap="xs">
                            <IconTool size={14} />
                            <Text size="sm">
                              Última: {formatDate(bus.lastMaintenance)}
                            </Text>
                          </Group>
                        )}
                        {bus.nextMaintenance && (
                          <Group gap="xs">
                            <IconCalendar size={14} />
                            <Text size="sm" c="orange">
                              Próxima: {formatDate(bus.nextMaintenance)}
                            </Text>
                          </Group>
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
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleEdit(bus)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDelete(bus.id)}
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Placa"
              placeholder="ABC-1234"
              required
              {...form.getInputProps("plate")}
            />

            <TextInput
              label="Modelo"
              placeholder="Ex: Mercedes-Benz OF 1721"
              required
              {...form.getInputProps("model")}
            />

            <NumberInput
              label="Ano"
              placeholder="2024"
              required
              min={1990}
              max={new Date().getFullYear() + 1}
              {...form.getInputProps("year")}
            />

            <NumberInput
              label="Capacidade"
              placeholder="40"
              required
              min={1}
              max={100}
              {...form.getInputProps("capacity")}
            />

            <Select
              label="Status"
              placeholder="Selecione o status"
              required
              data={[
                { value: BusStatus.Ativo, label: "Ativo" },
                { value: BusStatus.Manutencao, label: "Manutenção" },
                { value: BusStatus.Inativo, label: "Inativo" },
              ]}
              {...form.getInputProps("status")}
            />

            <TextInput
              label="Última Manutenção (opcional)"
              placeholder="YYYY-MM-DD"
              {...form.getInputProps("lastMaintenance")}
            />

            <TextInput
              label="Próxima Manutenção (opcional)"
              placeholder="YYYY-MM-DD"
              {...form.getInputProps("nextMaintenance")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingBus ? "Atualizar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
