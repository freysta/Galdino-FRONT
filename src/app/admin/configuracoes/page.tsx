"use client";

import { useState } from "react";
import {
  Title,
  Button,
  TextInput,
  Group,
  Stack,
  Card,
  Grid,
  Text,
  PasswordInput,
  Alert,
  Divider,
  Avatar,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconKey,
  IconCheck,
  IconAlertTriangle,
  IconCamera,
} from "@tabler/icons-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "../../contexts/AuthContext";

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const profileForm = useForm<UserProfileData>({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Nome deve ter pelo menos 2 caracteres" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
      phone: (value) =>
        value.length < 10 ? "Telefone deve ter pelo menos 10 dígitos" : null,
    },
  });

  const passwordForm = useForm<PasswordChangeData>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      currentPassword: (value) =>
        value.length < 1 ? "Senha atual é obrigatória" : null,
      newPassword: (value) =>
        value.length < 6 ? "Nova senha deve ter pelo menos 6 caracteres" : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Senhas não coincidem" : null,
    },
  });

  const handleProfileUpdate = async (values: UserProfileData) => {
    setLoading(true);
    try {
      // Simular atualização do perfil com os dados do formulário
      console.log("Atualizando perfil:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showError("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordChangeData) => {
    setPasswordLoading(true);
    try {
      // Simular mudança de senha com os dados do formulário
      console.log(
        "Alterando senha para usuário:",
        values.currentPassword ? "senha atual fornecida" : "erro",
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Senha alterada com sucesso!");
      passwordForm.reset();
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      showError("Erro ao alterar senha. Verifique a senha atual.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "motorista":
        return "Motorista";
      case "aluno":
        return "Aluno";
      default:
        return "Usuário";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "motorista":
        return "blue";
      case "aluno":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Configurações da Conta</Title>
      </Group>

      <Grid>
        {/* Informações do Perfil */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg">
            <Stack align="center" gap="md">
              <div style={{ position: "relative" }}>
                <Avatar
                  size={120}
                  radius="xl"
                  color={getRoleColor(user?.role || "admin")}
                >
                  <IconUser size={60} />
                </Avatar>
                <ActionIcon
                  size="sm"
                  radius="xl"
                  color="blue"
                  variant="filled"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <IconCamera size={16} />
                </ActionIcon>
              </div>

              <Stack align="center" gap="xs">
                <Text size="xl" fw={600}>
                  {user?.name}
                </Text>
                <Badge
                  color={getRoleColor(user?.role || "admin")}
                  variant="light"
                  size="lg"
                >
                  {getRoleLabel(user?.role || "admin")}
                </Badge>
                <Text size="sm" c="dimmed">
                  {user?.email}
                </Text>
              </Stack>

              <Alert
                icon={<IconCheck size="1rem" />}
                title="Conta Ativa"
                color="green"
                variant="light"
              >
                <Text size="sm">
                  Sua conta está ativa e funcionando normalmente.
                </Text>
              </Alert>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Formulários de Configuração */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* Atualizar Perfil */}
            <Card withBorder padding="lg">
              <Stack gap="md">
                <Group>
                  <IconUser size={20} />
                  <Text size="lg" fw={600}>
                    Informações Pessoais
                  </Text>
                </Group>

                <form onSubmit={profileForm.onSubmit(handleProfileUpdate)}>
                  <Stack gap="md">
                    <Grid>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Nome Completo"
                          placeholder="Digite seu nome completo"
                          leftSection={<IconUser size="1rem" />}
                          required
                          {...profileForm.getInputProps("name")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Email"
                          placeholder="seu@email.com"
                          leftSection={<IconMail size="1rem" />}
                          required
                          {...profileForm.getInputProps("email")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Telefone"
                          placeholder="(11) 99999-9999"
                          leftSection={<IconPhone size="1rem" />}
                          required
                          {...profileForm.getInputProps("phone")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button
                        type="submit"
                        loading={loading}
                        leftSection={<IconCheck size="1rem" />}
                      >
                        Salvar Alterações
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Stack>
            </Card>

            <Divider />

            {/* Alterar Senha */}
            <Card withBorder padding="lg">
              <Stack gap="md">
                <Group>
                  <IconKey size={20} />
                  <Text size="lg" fw={600}>
                    Alterar Senha
                  </Text>
                </Group>

                <Alert
                  icon={<IconAlertTriangle size="1rem" />}
                  title="Segurança"
                  color="yellow"
                  variant="light"
                >
                  <Text size="sm">
                    Use uma senha forte com pelo menos 6 caracteres, incluindo
                    letras, números e símbolos.
                  </Text>
                </Alert>

                <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
                  <Stack gap="md">
                    <PasswordInput
                      label="Senha Atual"
                      placeholder="Digite sua senha atual"
                      required
                      {...passwordForm.getInputProps("currentPassword")}
                    />

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <PasswordInput
                          label="Nova Senha"
                          placeholder="Digite a nova senha"
                          required
                          {...passwordForm.getInputProps("newPassword")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <PasswordInput
                          label="Confirmar Nova Senha"
                          placeholder="Confirme a nova senha"
                          required
                          {...passwordForm.getInputProps("confirmPassword")}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button
                        variant="outline"
                        onClick={() => passwordForm.reset()}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        loading={passwordLoading}
                        leftSection={<IconKey size="1rem" />}
                        color="orange"
                      >
                        Alterar Senha
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Stack>
            </Card>

            {/* Informações da Conta */}
            <Card withBorder padding="lg">
              <Stack gap="md">
                <Text size="lg" fw={600}>
                  Informações da Conta
                </Text>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">
                        ID do Usuário
                      </Text>
                      <Text fw={500}>#{user?.id}</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">
                        Tipo de Conta
                      </Text>
                      <Badge
                        color={getRoleColor(user?.role || "admin")}
                        variant="light"
                      >
                        {getRoleLabel(user?.role || "admin")}
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">
                        Status da Conta
                      </Text>
                      <Badge color="green" variant="light">
                        Ativa
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">
                        Membro desde
                      </Text>
                      <Text fw={500}>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                          : "N/A"}
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
