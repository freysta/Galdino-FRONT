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
  Radio,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconDots,
  IconAlertCircle,
  IconSend,
  IconUsers,
  IconUser,
} from "@tabler/icons-react";

import {
  useNotifications,
  useApiOperations,
  apiOperations,
} from "@/hooks/useApiData";
import { Notification } from "@/services/api";

export default function NotificacoesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null);
  const [recipientType, setRecipientType] = useState("all");

  // Usar a API real
  const { data: notifications, loading, error, refetch } = useNotifications();
  const { execute } = useApiOperations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "green";
      case "draft":
        return "gray";
      case "scheduled":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviada";
      case "draft":
        return "Rascunho";
      case "scheduled":
        return "Agendada";
      default:
        return "Desconhecido";
    }
  };

  const filteredNotifications = notifications.filter(
    (notification: Notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notification.recipientLabel &&
          notification.recipientLabel
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesStatus =
        !statusFilter || notification.status === statusFilter;
      return matchesSearch && matchesStatus;
    },
  );

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setRecipientType(notification.recipient || "all");
    open();
  };

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete?.id) {
      try {
        await execute(() =>
          apiOperations.notifications.delete(notificationToDelete.id!),
        );
        setNotificationToDelete(null);
        closeDeleteModal();
        refetch();
      } catch {
        alert("Erro ao excluir notificação");
      }
    }
  };

  const handleSendNotification = async (notificationId: number) => {
    try {
      await execute(() =>
        apiOperations.notifications.update(notificationId, {
          status: "sent",
          sentAt: new Date().toISOString(),
        }),
      );
      refetch();
    } catch {
      alert("Erro ao enviar notificação");
    }
  };

  const handleAddNew = () => {
    setEditingNotification(null);
    setRecipientType("all");
    open();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return <div>Carregando notificações...</div>;
  }

  if (error) {
    return <div>Erro ao carregar notificações</div>;
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Notificações</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
          Nova Notificação
        </Button>
      </Group>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por título, mensagem ou destinatário..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
              data={[
                { value: "sent", label: "Enviada" },
                { value: "draft", label: "Rascunho" },
                { value: "scheduled", label: "Agendada" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">
              {filteredNotifications.length} notificação(ões) encontrada(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de notificações */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Notificação</Table.Th>
              <Table.Th>Destinatário</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Leitura</Table.Th>
              <Table.Th>Data</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedNotifications.map((notification) => (
              <Table.Tr key={notification.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{notification.title}</Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {notification.message}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {notification.recipient === "all" ? (
                      <IconUsers size="0.8rem" />
                    ) : (
                      <IconUser size="0.8rem" />
                    )}
                    <Text size="sm">
                      {notification.recipientLabel || "N/A"}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={getStatusColor(notification.status || "")}
                    variant="light"
                  >
                    {getStatusLabel(notification.status || "")}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {notification.status === "sent" &&
                  notification.readCount &&
                  notification.totalRecipients ? (
                    <div>
                      <Text size="sm">
                        {notification.readCount}/{notification.totalRecipients}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {Math.round(
                          (notification.readCount /
                            notification.totalRecipients) *
                            100,
                        )}
                        % lida
                      </Text>
                    </div>
                  ) : (
                    <Text size="sm" c="dimmed">
                      -
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "N/A"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : ""}
                    </Text>
                  </div>
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
                        onClick={() => handleEdit(notification)}
                      >
                        Editar
                      </Menu.Item>
                      {notification.status === "draft" && (
                        <Menu.Item
                          color="blue"
                          leftSection={<IconSend size="0.9rem" />}
                          onClick={() =>
                            handleSendNotification(notification.id!)
                          }
                        >
                          Enviar
                        </Menu.Item>
                      )}
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size="0.9rem" />}
                        onClick={() => handleDeleteClick(notification)}
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

      {/* Modal de adicionar/editar notificação */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingNotification ? "Editar Notificação" : "Nova Notificação"}
        size="lg"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Título"
                placeholder="Digite o título da notificação"
                required
                defaultValue={editingNotification?.title}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Mensagem"
                placeholder="Digite a mensagem da notificação"
                required
                rows={4}
                defaultValue={editingNotification?.message}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="sm" fw={500} mb="xs">
                Destinatário
              </Text>
              <Radio.Group value={recipientType} onChange={setRecipientType}>
                <Stack gap="xs">
                  <Radio value="all" label="Todos os usuários" />
                  <Radio value="students" label="Todos os alunos" />
                  <Radio value="drivers" label="Todos os motoristas" />
                  <Radio
                    value="route"
                    label="Usuários de uma rota específica"
                  />
                  <Radio value="student" label="Aluno específico" />
                </Stack>
              </Radio.Group>
            </Grid.Col>

            {recipientType === "route" && (
              <Grid.Col span={12}>
                <Select
                  label="Rota"
                  placeholder="Selecione uma rota"
                  data={[
                    { value: "campus-norte", label: "Campus Norte" },
                    { value: "campus-sul", label: "Campus Sul" },
                    { value: "centro", label: "Centro" },
                  ]}
                  required
                />
              </Grid.Col>
            )}

            {recipientType === "student" && (
              <Grid.Col span={12}>
                <Select
                  label="Aluno"
                  placeholder="Selecione um aluno"
                  data={[
                    { value: "1", label: "Ana Silva Santos" },
                    { value: "2", label: "Carlos Eduardo Lima" },
                    { value: "3", label: "Mariana Costa Oliveira" },
                    { value: "4", label: "Pedro Henrique Souza" },
                    { value: "5", label: "Juliana Ferreira" },
                  ]}
                  required
                />
              </Grid.Col>
            )}

            <Grid.Col span={12}>
              <Select
                label="Ação"
                placeholder="Selecione uma ação"
                data={[
                  { value: "send", label: "Enviar agora" },
                  { value: "draft", label: "Salvar como rascunho" },
                  { value: "schedule", label: "Agendar envio" },
                ]}
                required
                defaultValue="send"
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close} leftSection={<IconSend size="1rem" />}>
              {editingNotification ? "Salvar" : "Enviar"}
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
              Tem certeza que deseja excluir a notificação{" "}
              <strong>{notificationToDelete?.title}</strong>? Esta ação não pode
              ser desfeita.
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
