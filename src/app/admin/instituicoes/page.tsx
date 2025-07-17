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
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
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
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
    },
    validate: {
      name: (value) => (!value ? "Nome é obrigatório" : null),
      address: (value) => (!value ? "Endereço é obrigatório" : null),
      city: (value) => (!value ? "Cidade é obrigatória" : null),
      state: (value) => (!value ? "Estado é obrigatório" : null),
      zipCode: (value) => (!value ? "CEP é obrigatório" : null),
      phone: (value) => (!value ? "Telefone é obrigatório" : null),
      email: (value) => {
        if (!value) return "E-mail é obrigatório";
        if (!/^\S+@\S+$/.test(value)) return "E-mail inválido";
        return null;
      },
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
      name: institution.name,
      address: institution.address,
      city: institution.city,
      state: institution.state,
      zipCode: institution.zipCode,
      phone: institution.phone,
      email: institution.email,
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
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.city.toLowerCase().includes(searchQuery.toLowerCase()),
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
                  <Table.Th>Cidade/Estado</Table.Th>
                  <Table.Th>Contato</Table.Th>
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
                          <Text fw={500}>{institution.name}</Text>
                          <Text size="sm" c="dimmed">
                            {institution.address}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text>
                        {institution.city}/{institution.state}
                      </Text>
                      <Text size="sm" c="dimmed">
                        CEP: {institution.zipCode}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{institution.phone}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Text size="sm">{institution.email}</Text>
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
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Endereço"
              placeholder="Ex: Rua Principal, 123"
              required
              {...form.getInputProps("address")}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  required
                  {...form.getInputProps("city")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Estado"
                  placeholder="Ex: SP"
                  required
                  maxLength={2}
                  {...form.getInputProps("state")}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="CEP"
                  placeholder="00000-000"
                  required
                  {...form.getInputProps("zipCode")}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Telefone"
                  placeholder="(00) 0000-0000"
                  required
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="E-mail"
                  placeholder="contato@instituicao.edu.br"
                  required
                  {...form.getInputProps("email")}
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
