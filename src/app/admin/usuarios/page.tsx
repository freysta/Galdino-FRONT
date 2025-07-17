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
  Loader,
  Center,
  Alert,
  PasswordInput,
  Tabs,
  NumberInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconPhone,
  IconMail,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconUser,
  IconCar,
  IconShield,
  IconSchool,
  IconCalendar,
  IconIdBadge,
} from "@tabler/icons-react";
import {
  useStudents,
  useDrivers,
  useAdmins,
  useCreateStudent,
  useCreateDriver,
  useCreateAdmin,
  useUpdateStudent,
  useUpdateDriver,
  useDeleteStudent,
  useDeleteDriver,
} from "@/hooks/useApi";
import {
  formatDate,
  type Student,
  type Driver,
  type Admin,
} from "@/services/api";

type UserType = "student" | "driver" | "admin";

interface UserWithType extends Partial<Student & Driver & Admin> {
  type: UserType;
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function UsuariosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<UserType>("student");
  const [editingUser, setEditingUser] = useState<UserWithType | null>(null);

  // Hooks para buscar dados
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: drivers, isLoading: driversLoading } = useDrivers();
  const { data: admins, isLoading: adminsLoading } = useAdmins();

  // Hooks para mutations
  const createStudentMutation = useCreateStudent();
  const createDriverMutation = useCreateDriver();
  const createAdminMutation = useCreateAdmin();
  const updateStudentMutation = useUpdateStudent();
  const updateDriverMutation = useUpdateDriver();
  const deleteStudentMutation = useDeleteStudent();
  const deleteDriverMutation = useDeleteDriver();

  // Form para adicionar/editar usuário
  const form = useForm({
    initialValues: {
      // Campos comuns
      name: "",
      email: "",
      password: "",
      phone: "",
      cpf: "",

      // Campos específicos de aluno
      address: "",
      city: "",
      course: "",
      shift: "Manha",
      institution: "",

      // Campos específicos de motorista
      licenseNumber: "",
      licenseExpiry: "",
      birthDate: "",

      // Campos específicos de admin
      accessLevel: 1,
    },
    validate: {
      name: (value: string) =>
        value.length < 2 ? "Nome deve ter pelo menos 2 caracteres" : null,
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Email inválido",
      password: (value: string) => {
        if (!editingUser && value.length < 6) {
          return "Senha deve ter pelo menos 6 caracteres";
        }
        return null;
      },
      phone: (value: string) =>
        value.length < 10 ? "Telefone inválido" : null,
      cpf: (value: string) => {
        if (activeTab !== "admin" && value.length < 11) {
          return "CPF inválido";
        }
        return null;
      },
    },
  });

  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case "student":
        return "Aluno";
      case "driver":
        return "Motorista";
      case "admin":
        return "Gestor";
    }
  };

  const getUserTypeColor = (type: UserType) => {
    switch (type) {
      case "student":
        return "blue";
      case "driver":
        return "green";
      case "admin":
        return "red";
    }
  };

  const getShiftLabel = (shift: string) => {
    const shifts: Record<string, string> = {
      Manha: "Manhã",
      Tarde: "Tarde",
      Noite: "Noite",
      Integral: "Integral",
    };
    return shifts[shift] || shift;
  };

  // Combinar todos os usuários em uma lista única
  const allUsers: UserWithType[] = [
    ...(students?.map((s) => ({ ...s, type: "student" as UserType })) || []),
    ...(drivers?.map((d) => ({ ...d, type: "driver" as UserType })) || []),
    ...(admins?.map((a) => ({
      ...a,
      type: "admin" as UserType,
      id: a.id || 0,
    })) || []),
  ];

  // Filtrar usuários baseado na aba ativa e termo de busca
  const filteredUsers = allUsers.filter((user) => {
    const matchesType = user.type === activeTab;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.cpf && user.cpf.includes(searchTerm));
    return matchesType && matchesSearch;
  });

  const handleAddNew = () => {
    setEditingUser(null);
    form.reset();
    open();
  };

  const handleEdit = (user: UserWithType) => {
    setEditingUser(user);
    form.setValues({
      name: user.name,
      email: user.email,
      password: "", // Não preencher senha ao editar
      phone: user.phone,
      cpf: user.cpf || "",
      address: user.address || "",
      city: user.city || "",
      course: user.course || "",
      shift: user.shift || "Manha",
      institution: user.institution || "",
      licenseNumber: user.cnh || "",
      licenseExpiry: user.licenseExpiry || "",
      birthDate: user.birthDate || "",
      accessLevel: user.accessLevel || 1,
    });
    setActiveTab(user.type);
    open();
  };

  const handleDelete = async (user: UserWithType) => {
    if (confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
      try {
        if (user.type === "student") {
          await deleteStudentMutation.mutateAsync(user.id);
        } else if (user.type === "driver") {
          await deleteDriverMutation.mutateAsync(user.id);
        }
        // Admin não tem delete implementado

        notifications.show({
          title: "Sucesso",
          message: "Usuário excluído com sucesso!",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      } catch (error) {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir usuário. Tente novamente.",
          color: "red",
          icon: <IconX size="1rem" />,
        });
      }
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        if (editingUser.type === "student") {
          await updateStudentMutation.mutateAsync({
            id: editingUser.id,
            data: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              cpf: values.cpf,
              address: values.address,
              city: values.city,
              course: values.course,
              shift: values.shift,
              institution: values.institution,
            },
          });
        } else if (editingUser.type === "driver") {
          await updateDriverMutation.mutateAsync({
            id: editingUser.id,
            data: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              cpf: values.cpf,
              birthDate: values.birthDate,
              cnh: values.licenseNumber,
              licenseExpiry: values.licenseExpiry,
            },
          });
        }
        // Admin não tem update implementado
      } else {
        // Criar novo usuário
        if (activeTab === "student") {
          await createStudentMutation.mutateAsync({
            name: values.name,
            email: values.email,
            phone: values.phone,
            cpf: values.cpf,
            address: values.address,
            city: values.city,
            course: values.course,
            shift: values.shift,
            institution: values.institution,
            paymentStatus: "Pendente",
          });
        } else if (activeTab === "driver") {
          await createDriverMutation.mutateAsync({
            name: values.name,
            email: values.email,
            phone: values.phone,
            cpf: values.cpf,
            birthDate: values.birthDate,
            cnh: values.licenseNumber,
            licenseExpiry: values.licenseExpiry,
          });
        } else if (activeTab === "admin") {
          await createAdminMutation.mutateAsync({
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            accessLevel: values.accessLevel,
          });
        }
      }

      notifications.show({
        title: "Sucesso",
        message: `${getUserTypeLabel(activeTab)} ${editingUser ? "atualizado" : "criado"} com sucesso!`,
        color: "green",
        icon: <IconCheck size="1rem" />,
      });
      close();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar usuário. Tente novamente.",
        color: "red",
        icon: <IconX size="1rem" />,
      });
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const isLoading = studentsLoading || driversLoading || adminsLoading;

  if (isLoading) {
    return (
      <Center h="400px">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Carregando usuários...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Gerenciar Usuários</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
          Adicionar Usuário
        </Button>
      </Group>

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
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed">
              {filteredUsers.length} usuário(s) encontrado(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as UserType)}
      >
        <Tabs.List>
          <Tabs.Tab value="student" leftSection={<IconSchool size="0.8rem" />}>
            Alunos ({students?.length || 0})
          </Tabs.Tab>
          <Tabs.Tab value="driver" leftSection={<IconCar size="0.8rem" />}>
            Motoristas ({drivers?.length || 0})
          </Tabs.Tab>
          <Tabs.Tab value="admin" leftSection={<IconShield size="0.8rem" />}>
            Gestores ({admins?.length || 0})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab} pt="md">
          <Card withBorder padding="md">
            {filteredUsers.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">
                    Nenhum {getUserTypeLabel(activeTab).toLowerCase()}{" "}
                    encontrado
                  </Text>
                  <Button
                    leftSection={<IconPlus size="1rem" />}
                    onClick={handleAddNew}
                  >
                    Adicionar {getUserTypeLabel(activeTab)}
                  </Button>
                </Stack>
              </Center>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nome</Table.Th>
                      <Table.Th>Contato</Table.Th>
                      {activeTab === "student" && (
                        <Table.Th>Curso/Turno</Table.Th>
                      )}
                      {activeTab === "driver" && <Table.Th>CNH</Table.Th>}
                      {activeTab === "admin" && <Table.Th>Nível</Table.Th>}
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedUsers.map((user) => (
                      <Table.Tr key={`${user.type}-${user.id}`}>
                        <Table.Td>
                          <div>
                            <Text fw={500}>{user.name}</Text>
                            <Group gap="xs">
                              <IconIdBadge size="0.8rem" />
                              <Text size="xs" c="dimmed">
                                {user.cpf || `ID: ${user.id}`}
                              </Text>
                            </Group>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap="xs">
                            <Group gap="xs">
                              <IconMail size="0.8rem" />
                              <Text size="sm">{user.email}</Text>
                            </Group>
                            <Group gap="xs">
                              <IconPhone size="0.8rem" />
                              <Text size="sm">{user.phone}</Text>
                            </Group>
                          </Stack>
                        </Table.Td>
                        {activeTab === "student" && (
                          <Table.Td>
                            <Text size="sm">{(user as Student).course}</Text>
                            <Badge size="sm" variant="light">
                              {getShiftLabel((user as Student).shift)}
                            </Badge>
                          </Table.Td>
                        )}
                        {activeTab === "driver" && (
                          <Table.Td>
                            <Text size="sm">{(user as Driver).cnh}</Text>
                            {(user as Driver).licenseExpiry && (
                              <Text size="xs" c="dimmed">
                                Validade:{" "}
                                {formatDate((user as Driver).licenseExpiry)}
                              </Text>
                            )}
                          </Table.Td>
                        )}
                        {activeTab === "admin" && (
                          <Table.Td>
                            <Badge color="red" variant="light">
                              Nível {(user as Admin).accessLevel}
                            </Badge>
                          </Table.Td>
                        )}
                        <Table.Td>
                          <Badge color="green" variant="light">
                            Ativo
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon
                              color="blue"
                              variant="light"
                              onClick={() => handleEdit(user)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            {user.type !== "admin" && (
                              <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => handleDelete(user)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            )}
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
                  <Group justify="center" mt="md">
                    <Pagination
                      value={currentPage}
                      onChange={setCurrentPage}
                      total={totalPages}
                    />
                  </Group>
                )}
              </>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title={`${editingUser ? "Editar" : "Adicionar"} ${getUserTypeLabel(activeTab)}`}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid>
              {/* Campos comuns */}
              <Grid.Col span={12}>
                <TextInput
                  label="Nome completo"
                  placeholder="Digite o nome completo"
                  required
                  {...form.getInputProps("name")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email"
                  placeholder="email@exemplo.com"
                  required
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <PasswordInput
                  label="Senha"
                  placeholder="Digite a senha"
                  required={!editingUser}
                  {...form.getInputProps("password")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  required
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>

              {/* CPF para alunos e motoristas */}
              {activeTab !== "admin" && (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="CPF"
                    placeholder="123.456.789-00"
                    required
                    {...form.getInputProps("cpf")}
                  />
                </Grid.Col>
              )}

              {/* Campos específicos de aluno */}
              {activeTab === "student" && (
                <>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Endereço"
                      placeholder="Rua, número, bairro"
                      required
                      {...form.getInputProps("address")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Cidade"
                      placeholder="Nome da cidade"
                      required
                      {...form.getInputProps("city")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Instituição"
                      placeholder="Nome da instituição"
                      {...form.getInputProps("institution")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Curso"
                      placeholder="Nome do curso"
                      required
                      {...form.getInputProps("course")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Turno"
                      placeholder="Selecione o turno"
                      required
                      data={[
                        { value: "Manha", label: "Manhã" },
                        { value: "Tarde", label: "Tarde" },
                        { value: "Noite", label: "Noite" },
                        { value: "Integral", label: "Integral" },
                      ]}
                      {...form.getInputProps("shift")}
                    />
                  </Grid.Col>
                </>
              )}

              {/* Campos específicos de motorista */}
              {activeTab === "driver" && (
                <>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="CNH"
                      placeholder="12345678901"
                      required
                      {...form.getInputProps("licenseNumber")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Validade da CNH"
                      type="date"
                      required
                      {...form.getInputProps("licenseExpiry")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Data de Nascimento"
                      type="date"
                      required
                      {...form.getInputProps("birthDate")}
                    />
                  </Grid.Col>
                </>
              )}

              {/* Campos específicos de admin */}
              {activeTab === "admin" && (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Nível de Acesso"
                    placeholder="1-5"
                    min={1}
                    max={5}
                    required
                    {...form.getInputProps("accessLevel")}
                  />
                </Grid.Col>
              )}
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  close();
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={
                  createStudentMutation.isPending ||
                  createDriverMutation.isPending ||
                  createAdminMutation.isPending ||
                  updateStudentMutation.isPending ||
                  updateDriverMutation.isPending
                }
              >
                {editingUser ? "Salvar" : "Adicionar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
