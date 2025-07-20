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
  ActionIcon,
  Menu,
  Text,
  Alert,
  Grid,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
  IconBuilding,
  IconPhone,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  useInstitutions,
  useCreateInstitution,
  useUpdateInstitution,
  useDeleteInstitution,
} from "@/hooks/useApi";
import { Institution } from "@/services/api";

interface InstitutionForm {
  nome: string;
  cidade: string;
  endereco?: string;
  telefone?: string;
  cep?: string;
}

export default function InstitutionsPage() {
  const [opened, setOpened] = useState(false);
  const [editingInstitution, setEditingInstitution] =
    useState<Institution | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<InstitutionForm>({
    nome: "",
    cidade: "",
    endereco: "",
    telefone: "",
    cep: "",
  });

  // Usar React Query hooks
  const { data: institutions = [], isLoading, error } = useInstitutions();
  const createInstitutionMutation = useCreateInstitution();
  const updateInstitutionMutation = useUpdateInstitution();
  const deleteInstitutionMutation = useDeleteInstitution();

  // Garantir que institutions é um array
  const institutionsArray = Array.isArray(institutions) ? institutions : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cidade) {
      notifications.show({
        title: "Erro",
        message: "Nome e cidade são obrigatórios",
        color: "red",
      });
      return;
    }

    try {
      if (editingInstitution) {
        await updateInstitutionMutation.mutateAsync({
          id: editingInstitution.id!,
          data: formData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Instituição atualizada com sucesso",
          color: "green",
        });
      } else {
        await createInstitutionMutation.mutateAsync(formData as Institution);
        notifications.show({
          title: "Sucesso",
          message: "Instituição criada com sucesso",
          color: "green",
        });
      }
      handleCloseModal();
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar instituição",
        color: "red",
      });
    }
  };

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution);
    setFormData({
      nome: institution.nome || "",
      cidade: institution.cidade || "",
      endereco: institution.endereco || "",
      telefone: institution.telefone || "",
      cep: institution.cep || "",
    });
    setOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta instituição?")) {
      try {
        await deleteInstitutionMutation.mutateAsync(id);
        notifications.show({
          title: "Sucesso",
          message: "Instituição excluída com sucesso",
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

  const handleCloseModal = () => {
    setOpened(false);
    setEditingInstitution(null);
    setFormData({
      nome: "",
      cidade: "",
      endereco: "",
      telefone: "",
      cep: "",
    });
  };

  const isOperationLoading =
    createInstitutionMutation.isPending ||
    updateInstitutionMutation.isPending ||
    deleteInstitutionMutation.isPending;

  const filteredInstitutions = institutionsArray.filter(
    (institution: Institution) =>
      institution.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.cidade?.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <p className="text-red-600 mb-4">Erro ao carregar instituições</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Instituições
      </Title>

      <Paper shadow="sm" p="md" withBorder>
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Buscar por nome ou cidade..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpened(true)}
            disabled={isOperationLoading}
          >
            Nova Instituição
          </Button>
        </Group>

        <div style={{ position: "relative", minHeight: 400 }}>
          {filteredInstitutions.length === 0 && (
            <Alert color="gray" mt="md">
              {searchQuery
                ? "Nenhuma instituição encontrada"
                : "Nenhuma instituição cadastrada"}
            </Alert>
          )}

          {filteredInstitutions.length > 0 && (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Cidade</Table.Th>
                  <Table.Th>Telefone</Table.Th>
                  <Table.Th style={{ width: 80 }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredInstitutions.map((institution: Institution) => (
                  <Table.Tr key={institution.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <div>
                          <Text fw={500}>
                            {institution.nome || "Nome não informado"}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {institution.endereco || "Endereço não informado"}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text>
                        {institution.cidade || "Cidade não informada"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        CEP: {institution.cep || "Não informado"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">
                          {institution.telefone || "Não informado"}
                        </Text>
                      </Group>
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
                            onClick={() => handleEdit(institution)}
                          >
                            Editar
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDelete(institution.id!)}
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
        title={editingInstitution ? "Editar Instituição" : "Nova Instituição"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome da Instituição"
              placeholder="Ex: Universidade Federal"
              required
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />

            <TextInput
              label="Cidade"
              placeholder="Ex: São Paulo"
              required
              value={formData.cidade}
              onChange={(e) =>
                setFormData({ ...formData, cidade: e.target.value })
              }
            />

            <TextInput
              label="Endereço"
              placeholder="Ex: Rua Principal, 123"
              value={formData.endereco}
              onChange={(e) =>
                setFormData({ ...formData, endereco: e.target.value })
              }
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Telefone"
                  placeholder="(00) 0000-0000"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="CEP"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: e.target.value })
                  }
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={handleCloseModal}
                disabled={isOperationLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingInstitution ? "Atualizar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
