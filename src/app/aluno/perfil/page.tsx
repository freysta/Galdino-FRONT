'use client';

import { useState } from 'react';
import {
  Title,
  Group,
  Stack,
  Card,
  Text,
  Button,
  Grid,
  TextInput,
  Alert,
  Divider,
  Badge,
  Avatar,
  ActionIcon,
  Modal,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconUser,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconIdBadge,
  IconRoute,
  IconCalendar,
  IconInfoCircle,
  IconCamera,
  IconSend,
} from '@tabler/icons-react';

// Mock data
const studentData = {
  id: 1,
  name: 'Ana Silva Santos',
  email: 'ana.silva@email.com',
  phone: '(11) 99999-1111',
  cpf: '123.456.789-01',
  address: {
    street: 'Rua das Flores, 123',
    neighborhood: 'Vila Nova',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  route: 'Campus Norte',
  joinDate: '2024-01-15',
  status: 'active',
  emergencyContact: {
    name: 'Maria Silva Santos',
    relationship: 'Mãe',
    phone: '(11) 98888-1111',
  },
  preferences: {
    notifications: true,
    emailUpdates: true,
    smsReminders: false,
  },
};

export default function AlunoPerfilPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [student] = useState(studentData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditRequest = () => {
    open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'suspended': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return 'Desconhecido';
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Meu Perfil</Title>
          <Text c="dimmed">
            Visualize e gerencie suas informações pessoais
          </Text>
        </div>
        <Button leftSection={<IconEdit size="1rem" />} onClick={handleEditRequest}>
          Solicitar Alteração
        </Button>
      </Group>

      <Grid>
        {/* Informações básicas */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            {/* Dados pessoais */}
            <Card withBorder padding="lg">
              <Group justify="space-between" mb="md">
                <Text fw={500} size="lg">Dados Pessoais</Text>
                <Badge color={getStatusColor(student.status)} variant="light">
                  {getStatusLabel(student.status)}
                </Badge>
              </Group>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconUser size="0.9rem" />
                    <Text size="sm" c="dimmed">Nome Completo</Text>
                  </Group>
                  <Text fw={500}>{student.name}</Text>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconIdBadge size="0.9rem" />
                    <Text size="sm" c="dimmed">CPF</Text>
                  </Group>
                  <Text fw={500} ff="monospace">{student.cpf}</Text>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconMail size="0.9rem" />
                    <Text size="sm" c="dimmed">Email</Text>
                  </Group>
                  <Text fw={500}>{student.email}</Text>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconPhone size="0.9rem" />
                    <Text size="sm" c="dimmed">Telefone</Text>
                  </Group>
                  <Text fw={500}>{student.phone}</Text>
                </Grid.Col>
                
                <Grid.Col span={12}>
                  <Group gap="xs" mb="xs">
                    <IconMapPin size="0.9rem" />
                    <Text size="sm" c="dimmed">Endereço</Text>
                  </Group>
                  <Text fw={500}>
                    {student.address.street}, {student.address.neighborhood}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {student.address.city} - {student.address.state}, CEP: {student.address.zipCode}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Informações do transporte */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">Informações do Transporte</Text>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconRoute size="0.9rem" />
                    <Text size="sm" c="dimmed">Rota Atual</Text>
                  </Group>
                  <Text fw={500}>{student.route}</Text>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconCalendar size="0.9rem" />
                    <Text size="sm" c="dimmed">Data de Cadastro</Text>
                  </Group>
                  <Text fw={500}>
                    {new Date(student.joinDate).toLocaleDateString('pt-BR')}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Contato de emergência */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">Contato de Emergência</Text>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group gap="xs" mb="xs">
                    <IconUser size="0.9rem" />
                    <Text size="sm" c="dimmed">Nome</Text>
                  </Group>
                  <Text fw={500}>{student.emergencyContact.name}</Text>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group gap="xs" mb="xs">
                    <IconUser size="0.9rem" />
                    <Text size="sm" c="dimmed">Parentesco</Text>
                  </Group>
                  <Text fw={500}>{student.emergencyContact.relationship}</Text>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group gap="xs" mb="xs">
                    <IconPhone size="0.9rem" />
                    <Text size="sm" c="dimmed">Telefone</Text>
                  </Group>
                  <Text fw={500}>{student.emergencyContact.phone}</Text>
                </Grid.Col>
              </Grid>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Sidebar com foto e preferências */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Foto do perfil */}
            <Card withBorder padding="lg">
              <Stack align="center" gap="md">
                <div style={{ position: 'relative' }}>
                  <Avatar size={120} radius="xl">
                    {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </Avatar>
                  <ActionIcon
                    variant="filled"
                    radius="xl"
                    size="sm"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <IconCamera size="0.8rem" />
                  </ActionIcon>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text fw={500}>{student.name}</Text>
                  <Text size="sm" c="dimmed">Aluno - {student.route}</Text>
                </div>
              </Stack>
            </Card>

            {/* Preferências */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">Preferências</Text>
              
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm">Notificações no sistema</Text>
                  <Badge color={student.preferences.notifications ? 'green' : 'red'} variant="light">
                    {student.preferences.notifications ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm">Atualizações por email</Text>
                  <Badge color={student.preferences.emailUpdates ? 'green' : 'red'} variant="light">
                    {student.preferences.emailUpdates ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm">Lembretes por SMS</Text>
                  <Badge color={student.preferences.smsReminders ? 'green' : 'red'} variant="light">
                    {student.preferences.smsReminders ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Group>
              </Stack>
            </Card>

            {/* Estatísticas rápidas */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">Estatísticas</Text>
              
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed">Tempo como aluno</Text>
                  <Text fw={500}>
                    {Math.ceil((new Date().getTime() - new Date(student.joinDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed">Viagens realizadas</Text>
                  <Text fw={500}>47 viagens</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed">Taxa de presença</Text>
                  <Text fw={500} c="green">94%</Text>
                </div>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Informações importantes */}
      <Card withBorder padding="lg">
        <Group mb="md">
          <IconInfoCircle size="1.2rem" color="blue" />
          <Text fw={500} size="lg">Informações Importantes</Text>
        </Group>
        
        <Alert color="blue" mb="md">
          <Text size="sm">
            Para alterar suas informações pessoais, utilize o botão "Solicitar Alteração" acima. 
            Todas as mudanças passam por aprovação da administração.
          </Text>
        </Alert>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>Documentos necessários para alterações:</Text>
              <Text size="sm">• RG ou CNH (frente e verso)</Text>
              <Text size="sm">• CPF</Text>
              <Text size="sm">• Comprovante de residência</Text>
              <Text size="sm">• Comprovante de matrícula</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>Contatos para suporte:</Text>
              <Text size="sm">📧 suporte@interunibus.com</Text>
              <Text size="sm">📞 (11) 3333-4444</Text>
              <Text size="sm">💬 WhatsApp: (11) 99999-0000</Text>
              <Text size="sm">🕒 Seg-Sex: 8h às 18h</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Modal de solicitação de alteração */}
      <Modal opened={opened} onClose={close} title="Solicitar Alteração de Dados" size="lg">
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
            <Text size="sm">
              Descreva quais informações você gostaria de alterar. Nossa equipe entrará em contato 
              para solicitar a documentação necessária.
            </Text>
          </Alert>

          <TextInput
            label="Seu nome"
            value={student.name}
            disabled
          />

          <TextInput
            label="Seu email"
            value={student.email}
            disabled
          />

          <Textarea
            label="Quais informações você gostaria de alterar?"
            placeholder="Descreva detalhadamente as alterações que você precisa fazer..."
            rows={4}
            required
          />

          <Textarea
            label="Justificativa (opcional)"
            placeholder="Explique o motivo da alteração..."
            rows={3}
          />

          <Divider />

          <Group justify="flex-end">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button leftSection={<IconSend size="1rem" />} onClick={close}>
              Enviar Solicitação
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
