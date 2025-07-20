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
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
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
  IconBell,
  IconBellOff,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";

import {
  useNotifications,
  useMarkNotificationAsRead,
  type Notification,
} from "@/hooks/useApi";

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
  const { data: notificationsData = [], isLoading, error } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  // Garantir que é um array
  const allNotifications = Array.isArray(notificationsData)
    ? notificationsData
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "info":
        return "blue";
      case "warning":
        return "yellow";
      case "urgent":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "info":
        return "Informação";
      case "warning":
        return "Aviso";
      case "urgent":
        return "Urgente";
      default:
        return "Desconhecido";
    }
  };

  const filteredNotifications = allNotifications.filter(
    (notification: Notification) => {
      const matchesSearch =
        (notification.title &&
          notification.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (notification.message &&
          notification.message
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesStatus = !statusFilter || notification.type === statusFilter;
      return matchesSearch && matchesStatus;
    },
  );

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    open();
  };

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete?.id) {
      try {
        // Simular exclusão - na API real seria implementado
        console.log("Excluindo notificação:", notificationToDelete.id);
        setNotificationToDelete(null);
        closeDeleteModal();
        notifications.show({
          title: "Sucesso",
          message: "Notificação excluída com sucesso!",
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Erro",
          message: "Erro ao excluir notificação",
          color: "red",
        });
      }
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      notifications.show({
        title: "Sucesso",
        message: "Notificação marcada como lida!",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao marcar como lida",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setEditingNotification(null);
    setRecipientType("all");
    open();
  };

  const handleSave = async (formData: FormData) => {
    try {
      const notificationData = {
        title: formData.get("title") as string,
        message: formData.get("message") as string,
        type: formData.get("type") as string,
        targetType: recipientType,
        targetIds: recipientType === "all" ? [] : [1], // Simular IDs
      };

      if (editingNotification?.id) {
        // Simular atualização
        console.log("Atualizando notificação:", notificationData);
      } else {
        await createMutation.mutateAsync(notificationData);
      }

      notifications.show({
        title: "Sucesso",
        message: `Notificação ${editingNotification ? "atualizada" : "criada"} com sucesso!`,
        color: "green",
      });
      close();
      setEditingNotification(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar notificação",
        color: "red",
      });
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalNotifications = allNotifications.length;
  const unreadNotifications = allNotifications.filter(
    (n: Notification) => !n.isRead,
  ).length;
  const urgentNotifications = allNotifications.filter(
    (n: Notification) => n.type === "urgent",
  ).length;
  const infoNotifications = allNotifications.filter(
    (n: Notification) => n.type === "info",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando notificações...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar notificações</Text>
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
          <Title order={1}>Gerenciar Notificações</Title>
          <Text c="dimmed" mt="xs">
            Envie e gerencie notificações para usuários do sistema
          </Text>
        </div>
        <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
          Nova Notificação
        </Button>
      </Group>

      {/* Cards de estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total
                </Text>
                <Text size="xl" fw={700}>
                  {totalNotifications}
                </Text>
              </div>
              <IconBell size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Não Lidas
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {unreadNotifications}
                </Text>
              </div>
              <IconBellOff size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Urgentes
                </Text>
                <Text size="xl" fw={700} c="red">
                  {urgentNotifications}
                </Text>
              </div>
              <IconAlertCircle size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Informações
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {infoNotifications}
                </Text>
              </div>
              <IconInfoCircle size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Buscar por título ou mensagem..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Tipo"
              data={[
                { value: "info", label: "Informação" },
                { value: "warning", label: "Aviso" },
                { value: "urgent", label: "Urgente" },
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
        <div className="overflow-x-auto">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Notificação</Table.Th>
                <Table.Th>Destinatário</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((notification: Notification) => (
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
                        <IconUsers size="0.8rem" />
                        <Text size="sm">Todos os usuários</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(notification.type || "")}
                        variant="light"
                      >
                        {getStatusLabel(notification.type || "")}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={notification.isRead ? "green" : "gray"}
                        variant="light"
                      >
                        {notification.isRead ? "Lida" : "Não lida"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString(
                              "pt-BR",
                            )
                          : new Date().toLocaleDateString("pt-BR")}
                      </Text>
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
                          <Menu.Item
                            color="blue"
                            leftSection={<IconCheck size="0.9rem" />}
                            onClick={() => handleMarkAsRead(notification.id!)}
                          >
                            Marcar como lida
                          </Menu.Item>
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
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} style={{ textAlign: "center" }}>
                    <Text c="dimmed">
                      {searchTerm || statusFilter
                        ? "Nenhuma notificação encontrada"
                        : "Nenhuma notificação cadastrada"}
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

      {/* Modal de adicionar/editar notificação */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingNotification ? "Editar Notificação" : "Nova Notificação"}
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
                  label="Título"
                  placeholder="Digite o título da notificação"
                  name="title"
                  required
                  defaultValue={editingNotification?.title}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Mensagem"
                  placeholder="Digite a mensagem da notificação"
                  name="message"
                  required
                  rows={4}
                  defaultValue={editingNotification?.message}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Tipo"
                  placeholder="Selecione o tipo"
                  name="type"
                  data={[
                    { value: "info", label: "Informação" },
                    { value: "warning", label: "Aviso" },
                    { value: "urgent", label: "Urgente" },
                  ]}
                  required
                  defaultValue={editingNotification?.type}
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
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button
                type="submit"
                leftSection={<IconSend size="1rem" />}
                loading={createMutation.isPending}
              >
                {editingNotification ? "Salvar" : "Enviar"}
              </Button>
            </Group>
          </Stack>
        </form>
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
