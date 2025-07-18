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
import { useDisclosure } from "@mantine/hooks";
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
  useApiOperations,
  apiOperations,
} from "@/hooks/useApiData";
import { BoardingPoint } from "@/services/api";

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

  // Usar a API real
  const { data: boardingPoints, loading, error, refetch } = useBoardingPoints();
  const { execute, loading: operationLoading } = useApiOperations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
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
      default:
        return "Desconhecido";
    }
  };

  const filteredPoints = boardingPoints.filter((point: BoardingPoint) => {
    const matchesSearch =
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (point.city &&
        point.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (point.neighborhood &&
        point.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (point.street &&
        point.street.toLowerCase().includes(searchTerm.toLowerCase()));
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
        await execute(() =>
          apiOperations.boardingPoints.delete(pointToDelete.id!),
        );
        setPointToDelete(null);
        closeDeleteModal();
        refetch();
      } catch (error) {
        alert("Erro ao excluir ponto de embarque");
      }
    }
  };

  const handleAddNew = () => {
    setEditingPoint(null);
    open();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPoints = filteredPoints.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Pontos de Embarque</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
          Adicionar Ponto
        </Button>
      </Group>

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
                { value: "active", label: "Ativo" },
                { value: "inactive", label: "Inativo" },
                { value: "maintenance", label: "Manutenção" },
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
            {paginatedPoints.map((point) => (
              <Table.Tr key={point.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{point.name}</Text>
                    <Text size="xs" c="dimmed" mt="xs">
                      {point.reference}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconBuilding size="0.8rem" />
                      <Text size="sm">{point.city}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconRoad size="0.8rem" />
                      <Text size="sm">{point.street}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Bairro: {point.neighborhood}
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    {point.routes &&
                      point.routes.map((route: string, index: number) => (
                        <Badge
                          key={index}
                          variant="light"
                          color="blue"
                          size="sm"
                        >
                          {route}
                        </Badge>
                      ))}
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{point.capacity || 0} pessoas</Text>
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
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Nome do ponto"
                placeholder="Ex: Terminal Rodoviário Central"
                required
                defaultValue={editingPoint?.name}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Cidade"
                placeholder="Ex: São Paulo"
                required
                defaultValue={editingPoint?.city}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Bairro"
                placeholder="Ex: Centro"
                required
                defaultValue={editingPoint?.neighborhood}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Endereço"
                placeholder="Ex: Rua do Terminal, 123"
                required
                defaultValue={editingPoint?.street}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Ponto de referência"
                placeholder="Ex: Próximo ao Shopping Center"
                defaultValue={editingPoint?.reference}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Capacidade"
                placeholder="Ex: 50"
                type="number"
                required
                defaultValue={editingPoint?.capacity?.toString()}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                data={[
                  { value: "active", label: "Ativo" },
                  { value: "inactive", label: "Inativo" },
                  { value: "maintenance", label: "Manutenção" },
                ]}
                required
                defaultValue={editingPoint?.status}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Rotas que utilizam este ponto"
                placeholder="Digite as rotas separadas por vírgula (Ex: Campus Norte, Campus Sul)"
                defaultValue={editingPoint?.routes?.join(", ")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>
              {editingPoint ? "Salvar" : "Adicionar"}
            </Button>
          </Group>
        </Stack>
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
            <Button color="red" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
