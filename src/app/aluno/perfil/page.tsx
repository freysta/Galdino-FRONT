"use client";

import { useState } from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
} from "@tabler/icons-react";

import { useStudents, useRoutes, useAttendance } from "@/hooks/useApiData";
import { Student, Route, Attendance } from "@/services/api";

export default function AlunoPerfilPage() {
  const [opened, { open, close }] = useDisclosure(false);

  // Usar a API real
  const { data: students, loading: studentsLoading } = useStudents();
  const { data: routes, loading: routesLoading } = useRoutes();
  const { data: attendance, loading: attendanceLoading } = useAttendance();

  // Simular o aluno logado (primeiro da lista)
  const currentStudent = students?.[0] || null;

  // Encontrar a rota do aluno
  const studentRoute = routes?.find(
    (route: Route) =>
      route.name === currentStudent?.route ||
      route.destination === currentStudent?.route,
  );

  // Calcular estatísticas do aluno
  const studentAttendance =
    attendance?.filter(
      (att: Attendance) => att.studentId === currentStudent?.id,
    ) || [];

  const totalTrips = studentAttendance.length;
  const presentTrips = studentAttendance.filter(
    (att: Attendance) => att.status === "Presente",
  ).length;
  const attendanceRate =
    totalTrips > 0 ? Math.round((presentTrips / totalTrips) * 100) : 0;

  // Calcular dias como aluno (simulado)
  const joinDate = new Date();
  joinDate.setDate(joinDate.getDate() - 30); // 30 dias atrás
  const daysAsStudent = Math.ceil(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "green";
      case "Inativo":
        return "red";
      case "Suspenso":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Ativo":
        return "Ativo";
      case "Inativo":
        return "Inativo";
      case "Suspenso":
        return "Suspenso";
      default:
        return "Ativo";
    }
  };

  if (studentsLoading || routesLoading || attendanceLoading) {
    return <div>Carregando perfil...</div>;
  }

  if (!currentStudent) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} color="red">
        <Text size="sm">
          Não foi possível carregar os dados do perfil. Tente novamente mais
          tarde.
        </Text>
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Meu Perfil</Title>
          <Text c="dimmed">Visualize e gerencie suas informações pessoais</Text>
        </div>
        <Button leftSection={<IconEdit size="1rem" />} onClick={open}>
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
                <Text fw={500} size="lg">
                  Dados Pessoais
                </Text>
                <Badge color={getStatusColor("Ativo")} variant="light">
                  {getStatusLabel("Ativo")}
                </Badge>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconUser size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Nome Completo
                    </Text>
                  </Group>
                  <Text fw={500}>{currentStudent.name}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconIdBadge size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      CPF
                    </Text>
                  </Group>
                  <Text fw={500} ff="monospace">
                    {currentStudent.cpf || "Não informado"}
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconMail size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Email
                    </Text>
                  </Group>
                  <Text fw={500}>{currentStudent.email}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconPhone size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Telefone
                    </Text>
                  </Group>
                  <Text fw={500}>
                    {currentStudent.phone || "Não informado"}
                  </Text>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Group gap="xs" mb="xs">
                    <IconMapPin size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Endereço
                    </Text>
                  </Group>
                  <Text fw={500}>
                    {currentStudent.address || "Endereço não informado"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {currentStudent.city || "Cidade não informada"}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Informações do transporte */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Informações do Transporte
              </Text>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconRoute size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Rota Atual
                    </Text>
                  </Group>
                  <Text fw={500}>
                    {currentStudent.route || "Rota não atribuída"}
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconCalendar size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Turno
                    </Text>
                  </Group>
                  <Text fw={500}>
                    {currentStudent.shift || "Não informado"}
                  </Text>
                </Grid.Col>

                {currentStudent.course && (
                  <Grid.Col span={12}>
                    <Group gap="xs" mb="xs">
                      <IconUser size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Curso
                      </Text>
                    </Group>
                    <Text fw={500}>{currentStudent.course}</Text>
                  </Grid.Col>
                )}
              </Grid>
            </Card>

            {/* Informações da rota */}
            {studentRoute && (
              <Card withBorder padding="lg">
                <Text fw={500} size="lg" mb="md">
                  Detalhes da Rota
                </Text>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs" mb="xs">
                      <IconMapPin size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Origem
                      </Text>
                    </Group>
                    <Text fw={500}>
                      {studentRoute.origin || "Não informado"}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs" mb="xs">
                      <IconMapPin size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Destino
                      </Text>
                    </Group>
                    <Text fw={500}>
                      {studentRoute.destination || "Não informado"}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs" mb="xs">
                      <IconCalendar size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Horário de Saída
                      </Text>
                    </Group>
                    <Text fw={500}>
                      {studentRoute.departureTime ||
                        studentRoute.time ||
                        "Não informado"}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs" mb="xs">
                      <IconUser size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Motorista
                      </Text>
                    </Group>
                    <Text fw={500}>
                      {studentRoute.driver || "Não atribuído"}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Card>
            )}
          </Stack>
        </Grid.Col>

        {/* Sidebar com foto e estatísticas */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Foto do perfil */}
            <Card withBorder padding="lg">
              <Stack align="center" gap="md">
                <div style={{ position: "relative" }}>
                  <Avatar size={120} radius="xl">
                    {currentStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </Avatar>
                  <ActionIcon
                    variant="filled"
                    radius="xl"
                    size="sm"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <IconCamera size="0.8rem" />
                  </ActionIcon>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text fw={500}>{currentStudent.name}</Text>
                  <Text size="sm" c="dimmed">
                    Aluno - {currentStudent.route || "Sem rota"}
                  </Text>
                </div>
              </Stack>
            </Card>

            {/* Estatísticas */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Estatísticas
              </Text>

              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed">
                    Tempo como aluno
                  </Text>
                  <Text fw={500}>{daysAsStudent} dias</Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Viagens realizadas
                  </Text>
                  <Text fw={500}>{totalTrips} viagens</Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Taxa de presença
                  </Text>
                  <Text
                    fw={500}
                    c={
                      attendanceRate >= 90
                        ? "green"
                        : attendanceRate >= 70
                          ? "orange"
                          : "red"
                    }
                  >
                    {attendanceRate}%
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Presenças confirmadas
                  </Text>
                  <Text fw={500}>
                    {presentTrips} de {totalTrips}
                  </Text>
                </div>
              </Stack>
            </Card>

            {/* Status da conta */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Status da Conta
              </Text>

              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm">Status</Text>
                  <Badge color="green" variant="light">
                    Ativo
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Text size="sm">Notificações</Text>
                  <Badge color="green" variant="light">
                    Ativo
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Text size="sm">Pagamentos</Text>
                  <Badge color="green" variant="light">
                    Em dia
                  </Badge>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Informações importantes */}
      <Card withBorder padding="lg">
        <Group mb="md">
          <IconInfoCircle size="1.2rem" color="blue" />
          <Text fw={500} size="lg">
            Informações Importantes
          </Text>
        </Group>

        <Alert color="blue" mb="md">
          <Text size="sm">
            Para alterar suas informações pessoais, utilize o botão "Solicitar
            Alteração" acima. Todas as mudanças passam por aprovação da
            administração.
          </Text>
        </Alert>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Documentos necessários para alterações:
              </Text>
              <Text size="sm">• RG ou CNH (frente e verso)</Text>
              <Text size="sm">• CPF</Text>
              <Text size="sm">• Comprovante de residência</Text>
              <Text size="sm">• Comprovante de matrícula</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Contatos para suporte:
              </Text>
              <Text size="sm">📧 suporte@transporte.com</Text>
              <Text size="sm">📞 (11) 3333-4444</Text>
              <Text size="sm">💬 WhatsApp: (11) 99999-0000</Text>
              <Text size="sm">🕒 Seg-Sex: 8h às 18h</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Modal de solicitação de alteração */}
      <Modal
        opened={opened}
        onClose={close}
        title="Solicitar Alteração de Dados"
        size="lg"
      >
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
            <Text size="sm">
              Descreva quais informações você gostaria de alterar. Nossa equipe
              entrará em contato para solicitar a documentação necessária.
            </Text>
          </Alert>

          <TextInput label="Seu nome" value={currentStudent.name} disabled />

          <TextInput label="Seu email" value={currentStudent.email} disabled />

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
