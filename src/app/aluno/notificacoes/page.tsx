"use client";

import { useState } from "react";
import {
  Title,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Button,
  Grid,
  ActionIcon,
  Select,
  Divider,
  Alert,
  Loader,
} from "@mantine/core";
import {
  IconBell,
  IconBellOff,
  IconCheck,
  IconTrash,
  IconAlertCircle,
  IconInfoCircle,
  IconSettings,
  IconMarkdown,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import {
  useNotifications,
  useMarkNotificationAsRead,
  type Notification,
} from "@/hooks/useApi";

export default function AlunoNotificacoesPage() {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<string | null>(null);

  // Usar React Query hooks
  const { data: notificationsData = [], isLoading, error } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  // Garantir que é um array
  const allNotifications = Array.isArray(notificationsData)
    ? notificationsData
    : [];

  // Filtrar notificações para o aluno (simulado - pode ser expandido com filtro por usuário)
  const studentNotifications = allNotifications.filter(
    (notification: Notification) =>
      notification.recipient === "Aluno" ||
      notification.recipient === "Todos" ||
      !notification.recipient,
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "green";
      case "warning":
        return "orange";
      case "error":
        return "red";
      case "info":
        return "blue";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <IconCheck size="1rem" />;
      case "warning":
        return <IconAlertCircle size="1rem" />;
      case "error":
        return <IconAlertCircle size="1rem" />;
      case "info":
        return <IconInfoCircle size="1rem" />;
      default:
        return <IconBell size="1rem" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "red";
      case "Normal":
        return "blue";
      case "Baixa":
        return "gray";
      default:
        return "gray";
    }
  };

  const filteredNotifications = studentNotifications.filter(
    (notification: Notification) => {
      const matchesType = !typeFilter || notification.type === typeFilter;
      const matchesRead =
        !readFilter ||
        (readFilter === "read" && notification.isRead) ||
        (readFilter === "unread" && !notification.isRead);
      return matchesType && matchesRead;
    },
  );

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
        message: "Erro ao marcar notificação como lida",
        color: "red",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = studentNotifications.filter(
        (n: Notification) => !n.isRead,
      );

      const promises = unreadNotifications.map((notification: Notification) =>
        markAsReadMutation.mutateAsync(notification.id!),
      );

      await Promise.all(promises);

      notifications.show({
        title: "Sucesso",
        message: "Todas as notificações foram marcadas como lidas!",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao marcar todas as notificações como lidas",
        color: "red",
      });
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (confirm("Tem certeza que deseja excluir esta notificação?")) {
      try {
        // Simular exclusão - em produção, implementar hook específico
        notifications.show({
          title: "Funcionalidade em desenvolvimento",
          message: "A exclusão de notificações estará disponível em breve.",
          color: "blue",
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

  const unreadCount = studentNotifications.filter(
    (n: Notification) => !n.isRead,
  ).length;

  const isOperationLoading = markAsReadMutation.isPending;

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando notificações...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} color="red">
        <Text size="sm">
          Erro ao carregar notificações. Tente recarregar a página.
        </Text>
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Notificações</Title>
          <Text c="dimmed">
            Acompanhe as últimas atualizações e informações importantes
          </Text>
        </div>
        <Group>
          <Button leftSection={<IconSettings size="1rem" />} variant="light">
            Configurações
          </Button>
          {unreadCount > 0 && (
            <Button
              leftSection={<IconMarkdown size="1rem" />}
              onClick={handleMarkAllAsRead}
              loading={isOperationLoading}
            >
              Marcar todas como lidas
            </Button>
          )}
        </Group>
      </Group>

      {/* Resumo */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Total
                </Text>
                <Text size="xl" fw={700}>
                  {studentNotifications.length}
                </Text>
              </div>
              <IconBell size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Não Lidas
                </Text>
                <Text size="xl" fw={700} c="orange">
                  {unreadCount}
                </Text>
              </div>
              <IconBellOff size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Lidas
                </Text>
                <Text size="xl" fw={700} c="green">
                  {studentNotifications.length - unreadCount}
                </Text>
              </div>
              <IconCheck size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por tipo"
              data={[
                { value: "success", label: "Sucesso" },
                { value: "warning", label: "Aviso" },
                { value: "error", label: "Erro" },
                { value: "info", label: "Informação" },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
              data={[
                { value: "read", label: "Lidas" },
                { value: "unread", label: "Não lidas" },
              ]}
              value={readFilter}
              onChange={setReadFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text size="sm" c="dimmed">
              {filteredNotifications.length} notificação(ões) encontrada(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Lista de notificações */}
      <Stack gap="md">
        {filteredNotifications.length === 0 ? (
          <Card withBorder padding="xl">
            <Stack align="center" gap="md">
              <IconBell size="3rem" color="gray" />
              <Text size="lg" c="dimmed">
                Nenhuma notificação encontrada
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Não há notificações que correspondam aos filtros selecionados.
              </Text>
            </Stack>
          </Card>
        ) : (
          filteredNotifications.map((notification: Notification) => (
            <Card
              key={notification.id}
              withBorder
              padding="md"
              style={{
                backgroundColor: notification.isRead ? undefined : "#f8fafc",
                borderLeft: notification.isRead
                  ? undefined
                  : "4px solid #3b82f6",
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Group align="flex-start" style={{ flex: 1 }}>
                  <div
                    style={{ color: getTypeColor(notification.type || "info") }}
                  >
                    {getTypeIcon(notification.type || "info")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="sm">
                        {notification.title}
                      </Text>
                      <Group gap="xs">
                        {notification.status && (
                          <Badge
                            color={getPriorityColor(notification.status)}
                            variant="light"
                            size="xs"
                          >
                            {notification.status}
                          </Badge>
                        )}
                        {!notification.isRead && (
                          <Badge color="blue" variant="filled" size="xs">
                            Nova
                          </Badge>
                        )}
                      </Group>
                    </Group>

                    <Text size="sm" c="dimmed" mb="md">
                      {notification.message}
                    </Text>

                    <Group justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "Data não disponível"}
                      </Text>

                      <Group gap="xs">
                        {!notification.isRead && (
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => handleMarkAsRead(notification.id!)}
                            loading={isOperationLoading}
                          >
                            Marcar como lida
                          </Button>
                        )}
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(notification.id!)}
                          loading={isOperationLoading}
                        >
                          <IconTrash size="0.8rem" />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </div>
                </Group>
              </Group>
            </Card>
          ))
        )}
      </Stack>

      {/* Configurações de notificação */}
      <Card withBorder padding="lg">
        <Group mb="md">
          <IconSettings size="1.2rem" color="blue" />
          <Text fw={500} size="lg">
            Preferências de Notificação
          </Text>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Receber notificações sobre:
              </Text>
              <Text size="sm">✓ Alterações de horário</Text>
              <Text size="sm">✓ Confirmações de pagamento</Text>
              <Text size="sm">✓ Lembretes de vencimento</Text>
              <Text size="sm">✓ Novas rotas disponíveis</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Canais de notificação:
              </Text>
              <Text size="sm">✓ Sistema (aqui no app)</Text>
              <Text size="sm">✓ Email</Text>
              <Text size="sm">✗ SMS</Text>
              <Text size="sm">✗ WhatsApp</Text>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
          <Text size="sm">
            Para alterar suas preferências de notificação, entre em contato com
            o suporte ou acesse as configurações do seu perfil.
          </Text>
        </Alert>
      </Card>
    </Stack>
  );
}
