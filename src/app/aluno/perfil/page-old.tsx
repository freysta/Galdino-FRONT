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
  Loader,
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
import { notifications } from "@mantine/notifications";

import {
  useCurrentUser,
  useRoutes,
  useAttendance,
  useUpdateProfile,
  type Route,
  type Attendance,
} from "@/hooks/useApi";

export default function AlunoPerfilPage() {
  const [opened, { open, close }] = useDisclosure(false);

  // Usar dados do usuário logado
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: attendance, isLoading: attendanceLoading } = useAttendance(
    currentUser?.id,
  );
  const updateProfileMutation = useUpdateProfile();

  // Estado para o formulário de solicitação de alteração
  const [formData, setFormData] = useState({
    changes: "",
    justification: "",
  });
  const [formErrors, setFormErrors] = useState<{ changes?: string }>({});

  // Encontrar a rota do aluno baseada no ID do usuário
  const studentRoute = routes?.find((route: Route) => {
    // Assumindo que existe uma relação entre usuário e rota
    // Isso pode precisar ser ajustado baseado na estrutura real da API
    return route.enrolled && route.enrolled > 0;
  });

  // Calcular estatísticas do aluno
  const studentAttendance = Array.isArray(attendance) ? attendance : [];
  const totalTrips = studentAttendance.length;
  const presentTrips = studentAttendance.filter(
    (att: Attendance) => att.status === "Presente",
  ).length;
  const attendanceRate =
    totalTrips > 0 ? Math.round((presentTrips / totalTrips) * 100) : 0;

  // Calcular dias como aluno (baseado na data de criação do usuário)
  const joinDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt)
    : new Date();
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

  const handleSubmitChangeRequest = async (values: typeof form.values) => {
    try {
      // Aqui você pode implementar uma API específica para solicitações de alteração
      // Por enquanto, vamos simular o envio
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notifications.show({
        title: "Solicitação Enviada",
        message:
          "Sua solicitação de alteração foi enviada com sucesso! Nossa equipe entrará em contato em breve.",
        color: "green",
      });

      form.reset();
      close();
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: "Não foi possível enviar sua solicitação. Tente novamente.",
        color: "red",
      });
    }
  };

  if (userLoading || routesLoading || attendanceLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando perfil...</Text>
      </Stack>
    );
  }

  if (!currentUser) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} color="red">
        <Text size="sm">
          Não foi possível carregar os dados do perfil. Faça login novamente.
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
                  <Text fw={500}>{currentUser.name}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconIdBadge size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      ID do Usuário
                    </Text>
                  </Group>
                  <Text fw={500} ff="monospace">
                    #{currentUser.id.toString().padStart(6, "0")}
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconMail size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Email
                    </Text>
                  </Group>
                  <Text fw={500}>{currentUser.email}</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs" mb="xs">
                    <IconPhone size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Telefone
                    </Text>
                  </Group>
                  <Text fw={500}>{currentUser.phone || "Não informado"}</Text>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Group gap="xs" mb="xs">
                    <IconCalendar size="0.9rem" />
                    <Text size="sm" c="dimmed">
                      Membro desde
                    </Text>
                  </Group>
                  <Text fw={500}>
                    {currentUser.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Data não disponível"}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Informações do transporte */}
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Informações do Transporte
              </Text>

              {studentRoute ? (
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs" mb="xs">
                      <IconRoute size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Rota Atual
                      </Text>
                    </Group>
                    <Text fw={500}>
                      {studentRoute.name ||
                        studentRoute.destination ||
                        "Rota sem nome"}
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

                  <Grid.Col span={12}>
                    <Group gap="xs" mb="xs">
                      <IconUser size="0.9rem" />
                      <Text size="sm" c="dimmed">
                        Motorista Responsável
                      </Text>
                    </Group>
                    <Text fw={500}>
                      {studentRoute.driver || "Não atribuído"}
                    </Text>
                  </Grid.Col>
                </Grid>
              ) : (
                <Alert icon={<IconInfoCircle size="1rem" />} color="orange">
                  <Text size="sm">
                    Você ainda não está vinculado a nenhuma rota. Entre em
                    contato com a administração para solicitar sua inclusão em
                    uma rota.
                  </Text>
                </Alert>
              )}
            </Card>
          </Stack>
        </Grid.Col>

        {/* Sidebar com foto e estatísticas */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Foto do perfil */}
            <Card withBorder padding="lg">
              <Stack align="center" gap="md">
                <div style={{ position: "relative" }}>
                  <Avatar size={120} radius="xl" color="blue">
                    {currentUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
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
                    onClick={() => {
                      notifications.show({
                        title: "Funcionalidade em desenvolvimento",
                        message:
                          "A alteração de foto de perfil estará disponível em breve.",
                        color: "blue",
                      });
                    }}
                  >
                    <IconCamera size="0.8rem" />
                  </ActionIcon>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Text fw={500}>{currentUser.name}</Text>
                  <Text size="sm" c="dimmed">
                    {currentUser.role === "aluno" ? "Aluno" : currentUser.role}
                  </Text>
                  <Badge variant="light" color="blue" size="sm" mt="xs">
                    ID: #{currentUser.id.toString().padStart(6, "0")}
                  </Badge>
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
                  <Text fw={500}>
                    {daysAsStudent > 0
                      ? `${daysAsStudent} dias`
                      : "Novo usuário"}
                  </Text>
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
                          : attendanceRate < 50 && totalTrips > 0
                            ? "red"
                            : "gray"
                    }
                  >
                    {totalTrips > 0 ? `${attendanceRate}%` : "N/A"}
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
                  <Text size="sm">Tipo de Usuário</Text>
                  <Badge color="blue" variant="light">
                    {currentUser.role === "aluno" ? "Aluno" : currentUser.role}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Text size="sm">Rota Atribuída</Text>
                  <Badge
                    color={studentRoute ? "green" : "orange"}
                    variant="light"
                  >
                    {studentRoute ? "Sim" : "Não"}
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
              <Text size="sm">📧 suporte@galdino.com</Text>
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
        <form onSubmit={form.onSubmit(handleSubmitChangeRequest)}>
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size="1rem" />} color="blue">
              <Text size="sm">
                Descreva quais informações você gostaria de alterar. Nossa
                equipe entrará em contato para solicitar a documentação
                necessária.
              </Text>
            </Alert>

            <TextInput label="Seu nome" value={currentUser.name} disabled />

            <TextInput label="Seu email" value={currentUser.email} disabled />

            <Textarea
              label="Quais informações você gostaria de alterar?"
              placeholder="Descreva detalhadamente as alterações que você precisa fazer..."
              rows={4}
              required
              {...form.getInputProps("changes")}
            />

            <Textarea
              label="Justificativa (opcional)"
              placeholder="Explique o motivo da alteração..."
              rows={3}
              {...form.getInputProps("justification")}
            />

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button
                leftSection={<IconSend size="1rem" />}
                type="submit"
                loading={updateProfileMutation.isPending}
              >
                Enviar Solicitação
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
