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
  IconMapPin,
  IconAlertCircle,
  IconBuilding,
  IconRoad,
} from "@tabler/icons-react";

import {
  useBoardingPoints,
  useCreateBoardingPoint,
  useUpdateBoardingPoint,
  useDeleteBoardingPoint,
  type BoardingPoint,
} from "@/hooks/useApi";

export default function PontosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPoint, setEditingPoint] = useState<BoardingPoint | null>(null);
  const [pointToDelete, setPointToDelete] = useState<BoardingPoint | null>(
    null,
  );

  // Usar React Query hooks modernos
  const { data: boardingPoints = [], isLoading, error } = useBoardingPoints();
  const createMutation = useCreateBoardingPoint();
  const updateMutation = useUpdateBoardingPoint();
  const deleteMutation = useDeleteBoardingPoint();

  // Garantir que boardingPoints é um array
  const boardingPointsArray = Array.isArray(boardingPoints)
    ? boardingPoints
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
      case "active":
        return "green";
      case "Inativo":
      case "inactive":
        return "red";
      case "Manutenção":
      case "maintenance":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "maintenance":
        return "Manutenção";
      case "Ativo":
      case "Inativo":
      case "Manutenção":
        return status;
      default:
        return "Desconhecido";
    }
  };

  const filteredPoints = boardingPointsArray.filter((point: BoardingPoint) => {
    const matchesSearch =
      point.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (point.city &&
        point.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (point.neighborhood &&
        point.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (point.address &&
        point.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || point.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (point: BoardingPoint) => {
    setEditingPoint(point);
    open();
  };

  const handleDeleteClick = (point: BoardingPoint) => {
    setPointToDelete(point);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (pointToDelete?.id) {
      try {
        await deleteMutation.mutateAsync(pointToDelete.id);
        notifications.show({
          title: "Sucesso",
          message: "Ponto de embarque excluído com sucesso!",
          color: "green",
        });
        setPointToDelete(null);
        closeDeleteModal();
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir ponto de embarque",
          color: "red",
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingPoint(null);
    open();
  };

  const handleSave = async (formData: FormData) => {
    try {
      // Estrutura correta para a API BoardingPoint
      const pointData = {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        neighborhood: formData.get("neighborhood") as string,
        status: formData.get("status") as string,
        routes: 1, // Número de rotas (conforme interface da API)
      };

      if (editingPoint?.id) {
        await updateMutation.mutateAsync({
          id: editingPoint.id,
          data: pointData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Ponto de embarque atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(pointData);
        notifications.show({
          title: "Sucesso",
          message: "Ponto de embarque criado com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingPoint(null);
    } catch (error) {
      console.error("Erro ao salvar ponto de embarque:", error);
      notifications.show({
        title: "Erro",
        message:
          "Erro ao salvar ponto de embarque. Verifique os dados e tente novamente.",
        color: "red",
      });
    }
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPoints = filteredPoints.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando pontos de embarque...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar pontos de embarque</Text>
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
          <Title order={1}>Pontos de Embarque</Title>
          <Text c="dimmed" mt="xs">
            Gerencie os pontos de embarque das rotas
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Adicionar Ponto
        </Button>
      </Group>

      {/* Stats */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total
                </Text>
                <Text size="xl" fw={700}>
                  {boardingPointsArray.length}
                </Text>
              </div>
              <IconMapPin size="2rem" color="blue" />
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
                  {
                    boardingPointsArray.filter(
                      (p) => p.status === "Ativo" || p.status === "active",
                    ).length
                  }
                </Text>
              </div>
              <IconBuilding size="2rem" color="green" />
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
                  {
                    boardingPointsArray.filter(
                      (p) => p.status === "Inativo" || p.status === "inactive",
                    ).length
                  }
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
                  Resultados
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {filteredPoints.length}
                </Text>
              </div>
              <IconSearch size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por nome, cidade, bairro ou rua..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
              data={[
                { value: "Ativo", label: "Ativo" },
                { value: "Inativo", label: "Inativo" },
                { value: "Manutenção", label: "Manutenção" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredPoints.length} ponto(s) encontrado(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de pontos */}
      <Card withBorder padding="md">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ponto de Embarque</Table.Th>
                <Table.Th>Localização</Table.Th>
                <Table.Th>Rotas</Table.Th>
                <Table.Th>Capacidade</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedPoints.length > 0 ? (
                paginatedPoints.map((point) => (
                  <Table.Tr key={point.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>
                          {point.name || "Nome não informado"}
                        </Text>
                        <Text size="xs" c="dimmed" mt="xs">
                          ID: {point.id || "N/A"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap="xs">
                        {point.city && (
                          <Group gap="xs">
                            <IconBuilding size="0.8rem" />
                            <Text size="sm">{point.city}</Text>
                          </Group>
                        )}
                        {point.address && (
                          <Group gap="xs">
                            <IconRoad size="0.8rem" />
                            <Text size="sm">{point.address}</Text>
                          </Group>
                        )}
                        {point.neighborhood && (
                          <Text size="xs" c="dimmed">
                            Bairro: {point.neighborhood}
                          </Text>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {point.routes || 0} rota(s)
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        N/A
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(point.status || "inactive")}
                        variant="light"
                      >
                        {getStatusLabel(point.status || "inactive")}
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
                            onClick={() => handleEdit(point)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDeleteClick(point)}
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
                        ? "Nenhum ponto encontrado"
                        : "Nenhum ponto de embarque cadastrado"}
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

      {/* Modal de adicionar/editar ponto */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          editingPoint
            ? "Editar Ponto de Embarque"
            : "Adicionar Ponto de Embarque"
        }
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
                  label="Nome do ponto"
                  placeholder="Ex: Terminal Rodoviário Central"
                  name="name"
                  required
                  defaultValue={editingPoint?.name}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  name="city"
                  required
                  defaultValue={editingPoint?.city}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Bairro"
                  placeholder="Ex: Centro"
                  name="neighborhood"
                  required
                  defaultValue={editingPoint?.neighborhood}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Endereço"
                  placeholder="Ex: Rua do Terminal, 123"
                  name="address"
                  required
                  defaultValue={editingPoint?.address}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  name="status"
                  data={[
                    { value: "Ativo", label: "Ativo" },
                    { value: "Inativo", label: "Inativo" },
                    { value: "Manutenção", label: "Manutenção" },
                  ]}
                  required
                  defaultValue={editingPoint?.status}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Rotas que utilizam este ponto"
                  placeholder="Digite as rotas separadas por vírgula (Ex: Campus Norte, Campus Sul)"
                  name="routes"
                  defaultValue={
                    Array.isArray(editingPoint?.routes)
                      ? editingPoint.routes.join(", ")
                      : editingPoint?.routes || ""
                  }
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingPoint ? "Salvar" : "Adicionar"}
              </Button>
            </Group>
          </Stack>
        </form>
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
              Tem certeza que deseja excluir o ponto de embarque{" "}
              <strong>{pointToDelete?.name}</strong>? Esta ação não pode ser
              desfeita e pode afetar as rotas que utilizam este ponto.
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
