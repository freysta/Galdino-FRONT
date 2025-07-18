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
  LoadingOverlay,
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
  IconMail,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useInstitutions,
  useCreateInstitution,
  useUpdateInstitution,
  useDeleteInstitution,
} from "@/hooks/useApiData";
import type { Institution } from "@/services/api";

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
  const { data: institutions, isLoading } = useInstitutions();
  const createMutation = useCreateInstitution();
  const updateMutation = useUpdateInstitution();
  const deleteMutation = useDeleteInstitution();

  const form = useForm<InstitutionForm>({
    initialValues: {
      nome: "",
      cidade: "",
      endereco: "",
      telefone: "",
      cep: "",
    },
    validate: {
      nome: (value) => (!value ? "Nome é obrigatório" : null),
      cidade: (value) => (!value ? "Cidade é obrigatória" : null),
    },
  });

  const handleSubmit = async (values: InstitutionForm) => {
    try {
      if (editingInstitution) {
        await updateMutation.mutateAsync({
          id: editingInstitution.id,
          data: values,
        });
        notifications.show({
          title: "Sucesso",
          message: "Instituição atualizada com sucesso",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(values);
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
    form.setValues({
      nome: institution.nome,
      cidade: institution.cidade,
      endereco: institution.endereco || "",
      telefone: institution.telefone || "",
      cep: institution.cep || "",
    });
    setOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta instituição?")) {
      try {
        await deleteMutation.mutateAsync(id);
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
    form.reset();
  };

  const filteredInstitutions = institutions?.filter(
    (institution) =>
      institution.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.cidade.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          >
            Nova Instituição
          </Button>
        </Group>

        <div style={{ position: "relative", minHeight: 400 }}>
          <LoadingOverlay visible={isLoading} />

          {!isLoading && filteredInstitutions?.length === 0 && (
            <Alert color="gray" mt="md">
              Nenhuma instituição encontrada
            </Alert>
          )}

          {filteredInstitutions && filteredInstitutions.length > 0 && (
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
                {filteredInstitutions.map((institution) => (
                  <Table.Tr key={institution.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <div>
                          <Text fw={500}>{institution.nome}</Text>
                          <Text size="sm" c="dimmed">
                            {institution.endereco || "Endereço não informado"}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text>{institution.cidade}</Text>
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
                            onClick={() => handleDelete(institution.id)}
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Nome da Instituição"
              placeholder="Ex: Universidade Federal"
              required
              {...form.getInputProps("nome")}
            />

            <TextInput
              label="Cidade"
              placeholder="Ex: São Paulo"
              required
              {...form.getInputProps("cidade")}
            />

            <TextInput
              label="Endereço"
              placeholder="Ex: Rua Principal, 123"
              {...form.getInputProps("endereco")}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Telefone"
                  placeholder="(00) 0000-0000"
                  {...form.getInputProps("telefone")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="CEP"
                  placeholder="00000-000"
                  {...form.getInputProps("cep")}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingInstitution ? "Atualizar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
