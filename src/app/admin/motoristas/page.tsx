'use client';

import { useState } from 'react';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconDots,
  IconPhone,
  IconMail,
  IconCar,
  IconAlertCircle,
} from '@tabler/icons-react';

// Mock data
const mockDrivers = [
  {
    id: 1,
    name: 'Carlos Santos Silva',
    email: 'carlos.santos@email.com',
    phone: '(11) 98888-1111',
    cnh: '12345678901',
    cnhCategory: 'D',
    status: 'active',
    vehicle: 'Ônibus 001',
    experience: '5 anos',
    joinDate: '2023-06-15',
  },
  {
    id: 2,
    name: 'Maria Oliveira Costa',
    email: 'maria.oliveira@email.com',
    phone: '(11) 98888-2222',
    cnh: '23456789012',
    cnhCategory: 'D',
    status: 'active',
    vehicle: 'Ônibus 002',
    experience: '8 anos',
    joinDate: '2023-03-10',
  },
  {
    id: 3,
    name: 'João Pereira Lima',
    email: 'joao.pereira@email.com',
    phone: '(11) 98888-3333',
    cnh: '34567890123',
    cnhCategory: 'D',
    status: 'inactive',
    vehicle: 'Não atribuído',
    experience: '3 anos',
    joinDate: '2023-09-20',
  },
  {
    id: 4,
    name: 'Ana Paula Rodrigues',
    email: 'ana.rodrigues@email.com',
    phone: '(11) 98888-4444',
    cnh: '45678901234',
    cnhCategory: 'D',
    status: 'active',
    vehicle: 'Ônibus 003',
    experience: '6 anos',
    joinDate: '2023-01-08',
  },
];

export default function MotoristasPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [drivers, setDrivers] = useState(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [driverToDelete, setDriverToDelete] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'suspended': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return 'Desconhecido';
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.cnh.includes(searchTerm);
    const matchesStatus = !statusFilter || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (driver: any) => {
    setEditingDriver(driver);
    open();
  };

  const handleDeleteClick = (driver: any) => {
    setDriverToDelete(driver);
    openDeleteModal();
  };

  const handleDeleteConfirm = () => {
    if (driverToDelete) {
      setDrivers(drivers.filter(d => d.id !== driverToDelete.id));
      setDriverToDelete(null);
      closeDeleteModal();
    }
  };

  const handleAddNew = () => {
    setEditingDriver(null);
    open();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Gerenciar Motoristas</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
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
                { value: 'active', label: 'Ativo' },
                { value: 'inactive', label: 'Inativo' },
                { value: 'suspended', label: 'Suspenso' },
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
              <Table.Th>Veículo</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedDrivers.map((driver) => (
              <Table.Tr key={driver.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{driver.name}</Text>
                    <Text size="xs" c="dimmed">
                      {driver.experience} de experiência
                    </Text>
                    <Text size="xs" c="dimmed">
                      Desde {new Date(driver.joinDate).toLocaleDateString('pt-BR')}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconMail size="0.8rem" />
                      <Text size="sm">{driver.email}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconPhone size="0.8rem" />
                      <Text size="sm">{driver.phone}</Text>
                    </Group>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm" ff="monospace">{driver.cnh}</Text>
                    <Badge size="xs" variant="light" color="blue">
                      Categoria {driver.cnhCategory}
                    </Badge>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconCar size="0.8rem" />
                    <Text size="sm">{driver.vehicle}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(driver.status)} variant="light">
                    {getStatusLabel(driver.status)}
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

      {/* Modal de adicionar/editar motorista */}
      <Modal opened={opened} onClose={close} title={editingDriver ? "Editar Motorista" : "Adicionar Motorista"} size="lg">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Nome completo"
                placeholder="Digite o nome completo"
                required
                defaultValue={editingDriver?.name}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Email"
                placeholder="email@exemplo.com"
                required
                defaultValue={editingDriver?.email}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Telefone"
                placeholder="(11) 99999-9999"
                required
                defaultValue={editingDriver?.phone}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="CNH"
                placeholder="00000000000"
                required
                defaultValue={editingDriver?.cnh}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Categoria CNH"
                placeholder="Selecione a categoria"
                data={[
                  { value: 'D', label: 'Categoria D' },
                  { value: 'E', label: 'Categoria E' },
                ]}
                required
                defaultValue={editingDriver?.cnhCategory}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Veículo"
                placeholder="Selecione um veículo"
                data={[
                  { value: 'onibus-001', label: 'Ônibus 001' },
                  { value: 'onibus-002', label: 'Ônibus 002' },
                  { value: 'onibus-003', label: 'Ônibus 003' },
                  { value: 'van-001', label: 'Van 001' },
                ]}
                defaultValue={editingDriver?.vehicle}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                data={[
                  { value: 'active', label: 'Ativo' },
                  { value: 'inactive', label: 'Inativo' },
                  { value: 'suspended', label: 'Suspenso' },
                ]}
                required
                defaultValue={editingDriver?.status}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Experiência"
                placeholder="Ex: 5 anos"
                defaultValue={editingDriver?.experience}
              />
            </Grid.Col>
          </Grid>
          
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>
              {editingDriver ? 'Salvar' : 'Adicionar'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirmar exclusão">
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            <Text size="sm">
              Tem certeza que deseja excluir o motorista <strong>{driverToDelete?.name}</strong>? 
              Esta ação não pode ser desfeita.
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
