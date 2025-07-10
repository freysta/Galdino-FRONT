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
} from '@tabler/icons-react';

// Mock data
const mockStudents = [
  {
    id: 1,
    name: 'Ana Silva Santos',
    email: 'ana.silva@email.com',
    phone: '(11) 99999-1111',
    cpf: '123.456.789-01',
    paymentStatus: 'paid',
    route: 'Campus Norte',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@email.com',
    phone: '(11) 99999-2222',
    cpf: '234.567.890-12',
    paymentStatus: 'pending',
    route: 'Campus Sul',
    joinDate: '2024-01-10',
  },
  {
    id: 3,
    name: 'Mariana Costa Oliveira',
    email: 'mariana.costa@email.com',
    phone: '(11) 99999-3333',
    cpf: '345.678.901-23',
    paymentStatus: 'overdue',
    route: 'Centro',
    joinDate: '2023-12-20',
  },
  {
    id: 4,
    name: 'Pedro Henrique Souza',
    email: 'pedro.souza@email.com',
    phone: '(11) 99999-4444',
    cpf: '456.789.012-34',
    paymentStatus: 'paid',
    route: 'Campus Norte',
    joinDate: '2024-01-08',
  },
  {
    id: 5,
    name: 'Juliana Ferreira',
    email: 'juliana.ferreira@email.com',
    phone: '(11) 99999-5555',
    cpf: '567.890.123-45',
    paymentStatus: 'paid',
    route: 'Campus Sul',
    joinDate: '2024-01-12',
  },
];

export default function AlunosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Atrasado';
      default: return 'Desconhecido';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.cpf.includes(searchTerm);
    const matchesStatus = !statusFilter || student.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    open();
  };

  const handleDelete = (studentId: number) => {
    // Confirmation modal can be implemented here if needed
    setStudents(students.filter(s => s.id !== studentId));
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    open();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Gerenciar Alunos</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
          Adicionar Aluno
        </Button>
      </Group>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por nome, email ou CPF..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status do pagamento"
              data={[
                { value: 'paid', label: 'Pago' },
                { value: 'pending', label: 'Pendente' },
                { value: 'overdue', label: 'Atrasado' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredStudents.length} aluno(s) encontrado(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de alunos */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Contato</Table.Th>
              <Table.Th>CPF</Table.Th>
              <Table.Th>Rota</Table.Th>
              <Table.Th>Status Pagamento</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedStudents.map((student) => (
              <Table.Tr key={student.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{student.name}</Text>
                    <Text size="xs" c="dimmed">
                      Desde {new Date(student.joinDate).toLocaleDateString('pt-BR')}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <Group spacing="xs">
                      <IconMail size="0.8rem" />
                      <Text size="sm">{student.email}</Text>
                    </Group>
                    <Group spacing="xs">
                      <IconPhone size="0.8rem" />
                      <Text size="sm">{student.phone}</Text>
                    </Group>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ff="monospace">{student.cpf}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="blue">
                    {student.route}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(student.paymentStatus)} variant="light">
                    {getStatusLabel(student.paymentStatus)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group spacing="xs" noWrap>
                    <ActionIcon color="blue" variant="light" onClick={() => handleEdit(student)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon color="red" variant="light" onClick={() => handleDelete(student.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                    <ActionIcon color="gray" variant="light">
                      <IconEye size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {totalPages > 1 && (
          <Group position="center" mt="md">
            <Pagination page={currentPage} onChange={setCurrentPage} total={totalPages} />
          </Group>
        )}
      </Card>

      {/* Modal de adicionar/editar aluno */}
      <Modal opened={opened} onClose={close} title={editingStudent ? "Editar Aluno" : "Adicionar Aluno"} size="lg">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Nome completo"
                placeholder="Digite o nome completo"
                required
                defaultValue={editingStudent?.name}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Email"
                placeholder="email@exemplo.com"
                required
                defaultValue={editingStudent?.email}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Telefone"
                placeholder="(11) 99999-9999"
                required
                defaultValue={editingStudent?.phone}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="CPF"
                placeholder="000.000.000-00"
                required
                defaultValue={editingStudent?.cpf}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Rota"
                placeholder="Selecione uma rota"
                data={[
                  { value: 'campus-norte', label: 'Campus Norte' },
                  { value: 'campus-sul', label: 'Campus Sul' },
                  { value: 'centro', label: 'Centro' },
                ]}
                required
                defaultValue={editingStudent?.route}
              />
            </Grid.Col>
          </Grid>
          
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>
              {editingStudent ? 'Salvar' : 'Adicionar'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
