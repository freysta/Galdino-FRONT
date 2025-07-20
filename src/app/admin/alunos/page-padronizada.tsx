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
  IconUsers,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";

import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  type Student,
} from "@/hooks/useApi";

export default function AlunosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { data: students = [], isLoading, error } = useStudents();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const studentsArray = Array.isArray(students) ? students : [];

  const filteredStudents = studentsArray.filter((student: Student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = !shiftFilter || student.shift === shiftFilter;
    return matchesSearch && matchesShift;
  });

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    open();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await deleteMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Aluno excluído com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir aluno",
          color: "red",
        });
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const studentData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        cpf: formData.get("cpf") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        course: formData.get("course") as string,
        shift: formData.get("shift") as
          | "Manha"
          | "Tarde"
          | "Noite"
          | "Integral",
      };

      if (editingStudent?.id) {
        await updateMutation.mutateAsync({
          id: editingStudent.id,
          data: studentData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Aluno atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(studentData);
        notifications.show({
          title: "Sucesso",
          message: "Aluno criado com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingStudent(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar aluno",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    open();
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalStudents = studentsArray.length;
  const morningStudents = studentsArray.filter(
    (s: Student) => s.shift === "Manha",
  ).length;
  const afternoonStudents = studentsArray.filter(
    (s: Student) => s.shift === "Tarde",
  ).length;
  const nightStudents = studentsArray.filter(
    (s: Student) => s.shift === "Noite",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando alunos...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar alunos</Text>
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
          <Title order={1}>Gerenciar Alunos</Title>
          <Text c="dimmed" mt="xs">
            Cadastro e controle dos alunos
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Novo Aluno
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total de Alunos
                </Text>
                <Text size="xl" fw={700}>
                  {totalStudents}
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
                  Manhã
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {morningStudents}
                </Text>
              </div>
              <IconClock size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Tarde
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {afternoonStudents}
                </Text>
              </div>
              <IconClock size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Noite
                </Text>
                <Text size="xl" fw={700} c="violet">
                  {nightStudents}
                </Text>
              </div>
              <IconClock size="2rem" color="violet" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por nome ou email..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por turno"
              data={[
                { value: "Manha", label: "Manhã" },
                { value: "Tarde", label: "Tarde" },
                { value: "Noite", label: "Noite" },
                { value: "Integral", label: "Integral" },
              ]}
              value={shiftFilter}
              onChange={setShiftFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredStudents.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      <Card withBorder padding="md">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Aluno</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Telefone</Table.Th>
                <Table.Th>Turno</Table.Th>
                <Table.Th>Curso</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student: Student) => (
                  <Table.Tr key={student.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>
                          {student.name || "Nome não informado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ID: {student.id || "N/A"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {student.email || "Email não informado"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{student.phone || "Não informado"}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          student.shift === "Manha"
                            ? "orange"
                            : student.shift === "Tarde"
                              ? "blue"
                              : student.shift === "Noite"
                                ? "violet"
                                : "gray"
                        }
                        variant="light"
                      >
                        {student.shift || "Não informado"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{student.course || "Não informado"}</Text>
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
                            onClick={() => handleEdit(student)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDelete(student.id!)}
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
                      {searchTerm || shiftFilter
                        ? "Nenhum aluno encontrado"
                        : "Nenhum aluno cadastrado"}
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
        title={editingStudent ? "Editar Aluno" : "Novo Aluno"}
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
                  defaultValue={editingStudent?.name}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email"
                  placeholder="email@exemplo.com"
                  name="email"
                  type="email"
                  required
                  defaultValue={editingStudent?.email}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  name="phone"
                  defaultValue={editingStudent?.phone}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="CPF"
                  placeholder="000.000.000-00"
                  name="cpf"
                  defaultValue={editingStudent?.cpf}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Turno"
                  placeholder="Selecione o turno"
                  name="shift"
                  data={[
                    { value: "Manha", label: "Manhã" },
                    { value: "Tarde", label: "Tarde" },
                    { value: "Noite", label: "Noite" },
                    { value: "Integral", label: "Integral" },
                  ]}
                  required
                  defaultValue={editingStudent?.shift}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Endereço"
                  placeholder="Rua, número, bairro"
                  name="address"
                  defaultValue={editingStudent?.address}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Cidade"
                  placeholder="Nome da cidade"
                  name="city"
                  defaultValue={editingStudent?.city}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Curso"
                  placeholder="Nome do curso"
                  name="course"
                  defaultValue={editingStudent?.course}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingStudent ? "Salvar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
