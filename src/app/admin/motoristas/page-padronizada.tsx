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
  IconCar,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconAlertCircle,
} from "@tabler/icons-react";

import {
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
  type Driver,
} from "@/hooks/useApi";

export default function MotoristasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const { data: drivers = [], isLoading, error } = useDrivers();
  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();
  const deleteMutation = useDeleteDriver();

  const driversArray = Array.isArray(drivers) ? drivers : [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "ativo":
        return "green";
      case "inativo":
        return "red";
      case "suspenso":
        return "orange";
      default:
        return "gray";
    }
  };

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

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este motorista?")) {
      try {
        await deleteMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Motorista excluído com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir motorista",
          color: "red",
        });
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const driverData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        cpf: formData.get("cpf") as string,
        cnh: formData.get("cnh") as string,
        vehicle: formData.get("vehicle") as string,
        licenseExpiry: formData.get("licenseExpiry") as string,
        birthDate: formData.get("birthDate") as string,
        status: formData.get("status") as string,
      };

      if (editingDriver?.id) {
        await updateMutation.mutateAsync({
          id: editingDriver.id,
          data: driverData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Motorista atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(driverData);
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

  const handleAddNew = () => {
    setEditingDriver(null);
    open();
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalDrivers = driversArray.length;
  const activeDrivers = driversArray.filter(
    (d: Driver) => d.status?.toLowerCase() === "ativo",
  ).length;
  const inactiveDrivers = driversArray.filter(
    (d: Driver) => d.status?.toLowerCase() === "inativo",
  ).length;
  const suspendedDrivers = driversArray.filter(
    (d: Driver) => d.status?.toLowerCase() === "suspenso",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando motoristas...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar motoristas</Text>
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
          <Title order={1}>Gerenciar Motoristas</Title>
          <Text c="dimmed" mt="xs">
            Cadastro e controle dos motoristas
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Novo Motorista
        </Button>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total de Motoristas
                </Text>
                <Text size="xl" fw={700}>
                  {totalDrivers}
                </Text>
              </div>
              <IconUsers size="2rem" color="blue" />
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
                  {activeDrivers}
                </Text>
              </div>
              <IconUserCheck size="2rem" color="green" />
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
                  {inactiveDrivers}
                </Text>
              </div>
              <IconUserX size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Suspensos
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {suspendedDrivers}
                </Text>
              </div>
              <IconCar size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

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
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
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
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredDrivers.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de motoristas */}
      <Card withBorder padding="md">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Motorista</Table.Th>
                <Table.Th>Contato</Table.Th>
                <Table.Th>CNH</Table.Th>
                <Table.Th>Veículo</Table.Th>
                <Table.Th>Status</Table.Th>
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
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm">
                          {driver.email || "Email não informado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {driver.phone || "Telefone não informado"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" ff="monospace">
                          {driver.cnh || "Não informado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Venc:{" "}
                          {driver.licenseExpiry
                            ? new Date(driver.licenseExpiry).toLocaleDateString(
                                "pt-BR",
                              )
                            : "N/A"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{driver.vehicle || "Não atribuído"}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(driver.status || "")}
                        variant="light"
                      >
                        {driver.status || "Desconhecido"}
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
                            onClick={() => handleEdit(driver)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDelete(driver.id!)}
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
                        ? "Nenhum motorista encontrado"
                        : "Nenhum motorista cadastrado"}
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

      {/* Modal de adicionar/editar motorista */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingDriver ? "Editar Motorista" : "Novo Motorista"}
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
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  name="name"
                  required
                  defaultValue={editingDriver?.name}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email"
                  placeholder="email@exemplo.com"
                  name="email"
                  type="email"
                  required
                  defaultValue={editingDriver?.email}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  name="phone"
                  defaultValue={editingDriver?.phone}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="CPF"
                  placeholder="000.000.000-00"
                  name="cpf"
                  defaultValue={editingDriver?.cpf}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="CNH"
                  placeholder="00000000000"
                  name="cnh"
                  defaultValue={editingDriver?.cnh}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Data de Nascimento"
                  placeholder="YYYY-MM-DD"
                  name="birthDate"
                  type="date"
                  defaultValue={editingDriver?.birthDate}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Vencimento da CNH"
                  placeholder="YYYY-MM-DD"
                  name="licenseExpiry"
                  type="date"
                  defaultValue={editingDriver?.licenseExpiry}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Veículo"
                  placeholder="Ex: Ônibus 001"
                  name="vehicle"
                  defaultValue={editingDriver?.vehicle}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  name="status"
                  data={[
                    { value: "ativo", label: "Ativo" },
                    { value: "inativo", label: "Inativo" },
                    { value: "suspenso", label: "Suspenso" },
                  ]}
                  required
                  defaultValue={editingDriver?.status}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingDriver ? "Salvar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
