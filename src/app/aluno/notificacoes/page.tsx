'use client';

import { useState } from 'react';
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
} from '@mantine/core';
import {
  IconBell,
  IconBellOff,
  IconCheck,
  IconTrash,
  IconAlertCircle,
  IconInfoCircle,
  IconSettings,
  IconMarkdown,
} from '@tabler/icons-react';

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: 'Alteração de horário',
    message: 'A rota das 7h30 foi alterada para 7h45 devido ao trânsito. Por favor, ajuste seu horário de chegada ao ponto de embarque.',
    type: 'warning',
    read: false,
    createdAt: '2024-01-24T07:00:00',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Pagamento confirmado',
    message: 'Seu pagamento da mensalidade de janeiro foi confirmado. Obrigado!',
    type: 'success',
    read: true,
    createdAt: '2024-01-23T14:30:00',
    priority: 'normal',
  },
  {
    id: 3,
    title: 'Lembrete: Mensalidade vencendo',
    message: 'Sua mensalidade de fevereiro vence em 3 dias (05/02). Não esqueça de efetuar o pagamento.',
    type: 'info',
    read: false,
    createdAt: '2024-01-22T09:00:00',
    priority: 'normal',
  },
  {
    id: 4,
    title: 'Nova rota disponível',
    message: 'Agora temos uma nova rota para o Campus Oeste com saídas às 8h e 14h. Confira os detalhes na seção de rotas.',
    type: 'info',
    read: true,
    createdAt: '2024-01-20T16:45:00',
    priority: 'low',
  },
  {
    id: 5,
    title: 'Manutenção programada',
    message: 'O sistema ficará indisponível no domingo das 2h às 6h para manutenção. Planeje-se!',
    type: 'warning',
    read: true,
    createdAt: '2024-01-18T10:15:00',
    priority: 'normal',
  },
  {
    id: 6,
    title: 'Bem-vindo ao InterUniBus!',
    message: 'Seja bem-vindo ao nosso sistema de transporte universitário. Explore todas as funcionalidades disponíveis.',
    type: 'success',
    read: true,
    createdAt: '2024-01-15T08:00:00',
    priority: 'low',
  },
];

export default function AlunoNotificacoesPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      case 'info': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <IconCheck size="1rem" />;
      case 'warning': return <IconAlertCircle size="1rem" />;
      case 'error': return <IconAlertCircle size="1rem" />;
      case 'info': return <IconInfoCircle size="1rem" />;
      default: return <IconBell size="1rem" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'normal': return 'blue';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'normal': return 'Normal';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = !typeFilter || notification.type === typeFilter;
    const matchesRead = !readFilter || 
      (readFilter === 'read' && notification.read) ||
      (readFilter === 'unread' && !notification.read);
    return matchesType && matchesRead;
  });

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (notificationId: number) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
                <Text size="sm" c="dimmed" mb="xs">Total</Text>
                <Text size="xl" fw={700}>{notifications.length}</Text>
              </div>
              <IconBell size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Não Lidas</Text>
                <Text size="xl" fw={700} c="orange">{unreadCount}</Text>
              </div>
              <IconBellOff size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Lidas</Text>
                <Text size="xl" fw={700} c="green">{notifications.length - unreadCount}</Text>
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
                { value: 'success', label: 'Sucesso' },
                { value: 'warning', label: 'Aviso' },
                { value: 'error', label: 'Erro' },
                { value: 'info', label: 'Informação' },
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
                { value: 'read', label: 'Lidas' },
                { value: 'unread', label: 'Não lidas' },
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
              <Text size="lg" c="dimmed">Nenhuma notificação encontrada</Text>
              <Text size="sm" c="dimmed" ta="center">
                Não há notificações que correspondam aos filtros selecionados.
              </Text>
            </Stack>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              withBorder 
              padding="md"
              style={{ 
                backgroundColor: notification.read ? undefined : '#f8fafc',
                borderLeft: notification.read ? undefined : '4px solid #3b82f6'
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Group align="flex-start" style={{ flex: 1 }}>
                  <div style={{ color: getTypeColor(notification.type) }}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="sm">
                        {notification.title}
                      </Text>
                      <Group gap="xs">
                        <Badge 
                          color={getPriorityColor(notification.priority)} 
                          variant="light" 
                          size="xs"
                        >
                          {getPriorityLabel(notification.priority)}
                        </Badge>
                        {!notification.read && (
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
                        {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      
                      <Group gap="xs">
                        {!notification.read && (
                          <Button 
                            size="xs" 
                            variant="light"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marcar como lida
                          </Button>
                        )}
                        <ActionIcon 
                          variant="subtle" 
                          color="red" 
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
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
          <Text fw={500} size="lg">Preferências de Notificação</Text>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>Receber notificações sobre:</Text>
              <Text size="sm">✓ Alterações de horário</Text>
              <Text size="sm">✓ Confirmações de pagamento</Text>
              <Text size="sm">✓ Lembretes de vencimento</Text>
              <Text size="sm">✓ Novas rotas disponíveis</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>Canais de notificação:</Text>
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
            Para alterar suas preferências de notificação, entre em contato com o suporte 
            ou acesse as configurações do seu perfil.
          </Text>
        </Alert>
      </Card>
    </Stack>
  );
}
