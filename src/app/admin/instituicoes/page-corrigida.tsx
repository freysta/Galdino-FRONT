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
  IconEye,
  IconDots,
  IconTrash,
  IconBuilding,
  IconMapPin,
  IconPhone,
  IconAlertCircle,
} from "@tabler/icons-react";

import {
  useInstitutions,
  useCreateInstitution,
  useUpdateInstitution,
  useDeleteInstitution,
  type Institution,
} from "@/hooks/useApi";

export default function InstituicoesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);

  // Usar a API real
  const { data: institutions = [], isLoading, error } = useInstitutions();
  const createMutation = useCreateInstitution();
  const updateMutation = useUpdateInstitution();
  const deleteMutation = useDeleteInstitution();

  // Garantir que institutions é um array
  const institutionsArray = Array.isArray(institutions) ? institutions : [];

  const filteredInstitutions = institutionsArray.filter(
    (institution: Institution) =>
      institution.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.cidade?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution);
    open();
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    if (confirm("Tem certeza que deseja excluir esta instituição?")) {
      try {
        await deleteMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Instituição excluída com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir instituição",
          color: "red",
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingInstitution(null);
    open();
  };

  const handleSave = async (formData: FormData) => {
    try {
      const institutionData = {
        nome: formData.get("nome") as string,
        cidade: formData.get("cidade") as string,
        endereco: (formData.get("endereco") as string) || undefined,
        telefone: (formData.get("telefone") as string) || undefined,
        cep: (formData.get("cep") as string) || undefined,
      };

      if (editingInstitution?.id) {
        await updateMutation.mutateAsync({
          id: editingInstitution.id,
          data: institutionData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Instituição atualizada com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(institutionData);
        notifications.show({
          title: "Sucesso",
          message: "Instituição criada com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingInstitution(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar instituição",
        color: "red",
      });
    }
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInstitutions = filteredInstitutions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando instituições...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar instituições</Text>
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
          <Title order={1}>Gerenciar Instituições</Title>
          <Text c="dimmed" mt="xs">
            Cadastro e controle das instituições de ensino
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleAddNew}
          disabled={isOperationLoading}
        >
          Adicionar Instituição
        </Button>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total de Instituições
                </Text>
                <Text size="xl" fw={700}>
                  {institutionsArray.length}
                </Text>
              </div>
              <IconBuilding size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Cidades Atendidas
                </Text>
                <Text size="xl" fw={700}>
                  {new Set(institutionsArray.map((i) => i.cidade)).size}
                </Text>
              </div>
              <IconMapPin size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por nome ou cidade..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed" ta="right">
              {filteredInstitutions.length} registro(s) encontrado(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de instituições */}
      <Card withBorder padding="md">
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Cidade</Table.Th>
                <Table.Th>Endereço</Table.Th>
                <Table.Th>Contato</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedInstitutions.length > 0 ? (
                paginatedInstitutions.map((institution: Institution) => (
                  <Table.Tr key={institution.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{institution.nome}</Text>
                        <Text size="xs" c="dimmed">
                          ID: {institution.id}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue">
                        {institution.cidade}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {institution.endereco || "Não informado"}
                      </Text>
                      {institution.cep && (
                        <Text size="xs" c="dimmed">
                          CEP: {institution.cep}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {institution.telefone ? (
                        <Group gap="xs">
                          <IconPhone size="0.8rem" />
                          <Text size="sm">{institution.telefone}</Text>
                        </Group>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Não informado
                        </Text>
                      )}
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
                            onClick={() => handleEdit(institution)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size="0.9rem" />}
                            onClick={() => handleDelete(institution.id!)}
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
                  <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                    <Text c="dimmed">
                      {searchTerm
                        ? "Nenhuma instituição encontrada"
                        : "Nenhuma instituição cadastrada"}
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

      {/* Modal de adicionar/editar instituição */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          editingInstitution ? "Editar Instituição" : "Adicionar Instituição"
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
                  label="Nome da Instituição"
                  placeholder="Ex: Universidade Federal..."
                  name="nome"
                  required
                  defaultValue={editingInstitution?.nome}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  name="cidade"
                  required
                  defaultValue={editingInstitution?.cidade}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="CEP"
                  placeholder="00000-000"
                  name="cep"
                  defaultValue={editingInstitution?.cep}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Endereço Completo"
                  placeholder="Rua, número, bairro..."
                  name="endereco"
                  defaultValue={editingInstitution?.endereco}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  name="telefone"
                  defaultValue={editingInstitution?.telefone}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingInstitution ? "Salvar" : "Adicionar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
