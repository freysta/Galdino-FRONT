"use client";

import { useState } from "react";
import {
  Title,
  Button,
  TextInput,
  Group,
  Stack,
  Card,
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
  IconPhone,
  IconMail,
  IconAlertCircle,
} from "@tabler/icons-react";
import {
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from "@/hooks/useApi";
import { Driver } from "@/services/api";
import { notifications } from "@mantine/notifications";

export default function MotoristasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  // Usar React Query
  const { data: drivers = [], isLoading, error } = useDrivers();
  const createDriverMutation = useCreateDriver();
  const updateDriverMutation = useUpdateDriver();
  const deleteDriverMutation = useDeleteDriver();

  // Garantir que drivers é um array
  const driversArray = Array.isArray(drivers) ? drivers : [];

  const filteredDrivers = driversArray.filter((driver: Driver) => {
    const matchesSearch =
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.cnh && driver.cnh.includes(searchTerm));
    const matchesStatus =
      !statusFilter ||
      driver.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    open();
  };

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (driverToDelete?.id) {
      try {
        await deleteDriverMutation.mutateAsync(driverToDelete.id);
        notifications.show({
          title: "Sucesso",
          message: "Motorista excluído com sucesso!",
          color: "green",
        });
        setDriverToDelete(null);
        closeDeleteModal();
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir motorista",
          color: "red",
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingDriver(null);
    open();
  };

  const handleSave = async (driverData: Partial<Driver>) => {
    try {
      if (editingDriver?.id) {
        await updateDriverMutation.mutateAsync({
          id: editingDriver.id,
          data: driverData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Motorista atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createDriverMutation.mutateAsync(driverData as Driver);
        notifications.show({
          title: "Sucesso",
          message: "Motorista criado com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingDriver(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar motorista",
        color: "red",
      });
    }
  };

  const isOperationLoading =
    createDriverMutation.isPending ||
    updateDriverMutation.isPending ||
    deleteDriverMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(
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
          <p className="text-red-600 mb-4">Erro ao carregar motoristas</p>
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
        <Title order={1}>Gerenciar Motoristas</Title>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Adicionar Motorista
        </Button>
      </Group>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por nome, email ou CNH..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
              data={[
                { value: "ativo", label: "Ativo" },
                { value: "inativo", label: "Inativo" },
                { value: "suspenso", label: "Suspenso" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredDrivers.length} motorista(s) encontrado(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de motoristas */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Motorista</Table.Th>
              <Table.Th>Contato</Table.Th>
              <Table.Th>CNH</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedDrivers.length > 0 ? (
              paginatedDrivers.map((driver: Driver) => (
                <Table.Tr key={driver.id}>
                  <Table.Td>
                    <div>
                      <Text fw={500}>
                        {driver.name || "Nome não informado"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        CPF: {driver.cpf || "Não informado"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Desde{" "}
                        {driver.createdAt &&
                        typeof driver.createdAt === "string"
                          ? new Date(driver.createdAt).toLocaleDateString(
                              "pt-BR",
                            )
                          : "N/A"}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <IconMail size="0.8rem" />
                        <Text size="sm">{driver.email || "Não informado"}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size="0.8rem" />
                        <Text size="sm">{driver.phone || "Não informado"}</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" ff="monospace">
                        {driver.cnh || "Não informado"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Venc:{" "}
                        {driver.licenseExpiry &&
                        typeof driver.licenseExpiry === "string"
                          ? new Date(driver.licenseExpiry).toLocaleDateString(
                              "pt-BR",
                            )
                          : "N/A"}
                      </Text>
                    </div>
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
                          onClick={() => handleEdit(driver)}
                        >
                          Editar
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size="0.9rem" />}
                          onClick={() => handleDeleteClick(driver)}
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
                      ? "Nenhum motorista encontrado"
                      : "Nenhum motorista cadastrado"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
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

      {/* Modal de adicionar/editar motorista */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingDriver ? "Editar Motorista" : "Adicionar Motorista"}
        size="lg"
      >
        <DriverModalComponent
          driver={editingDriver}
          onSave={handleSave}
          onClose={close}
          loading={isOperationLoading}
        />
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar exclusão"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            <Text size="sm">
              Tem certeza que deseja excluir o motorista{" "}
              <strong>{driverToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={deleteDriverMutation.isPending}
            >
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

interface DriverModalProps {
  driver: Driver | null;
  onSave: (data: Partial<Driver>) => void;
  onClose: () => void;
  loading: boolean;
}

function DriverModalComponent({
  driver,
  onSave,
  onClose,
  loading,
}: DriverModalProps) {
  const [formData, setFormData] = useState({
    name: driver?.name || "",
    email: driver?.email || "",
    phone: driver?.phone || "",
    cpf: driver?.cpf || "",
    cnh: driver?.cnh || "",
    licenseExpiry: driver?.licenseExpiry || "",
    birthDate: driver?.birthDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Nome completo"
              placeholder="Digite o nome completo"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Email"
              placeholder="email@exemplo.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="CPF"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: e.target.value })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="CNH"
              placeholder="00000000000"
              value={formData.cnh}
              onChange={(e) =>
                setFormData({ ...formData, cnh: e.target.value })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Data de Nascimento"
              placeholder="YYYY-MM-DD"
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Vencimento da CNH"
              placeholder="YYYY-MM-DD"
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) =>
                setFormData({ ...formData, licenseExpiry: e.target.value })
              }
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {driver ? "Salvar" : "Adicionar"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
