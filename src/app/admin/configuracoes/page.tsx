"use client";

import React, { useEffect, useState } from "react";
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
  Loader,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconKey,
  IconCheck,
  IconAlertTriangle,
  IconCamera,
  IconSettings,
  IconAlertCircle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import {
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "@/hooks/useApi";

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
  // Usar React Query hooks
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // Estados para formulários
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileErrors, setProfileErrors] = useState<Partial<UserProfileData>>(
    {},
  );
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<PasswordChangeData>
  >({});

  // Atualizar form quando user data carregar
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const validateProfile = (data: UserProfileData): Partial<UserProfileData> => {
    const errors: Partial<UserProfileData> = {};

    if (data.name.length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!/^\S+@\S+$/.test(data.email)) {
      errors.email = "Email inválido";
    }

    if (data.phone.length < 10) {
      errors.phone = "Telefone deve ter pelo menos 10 dígitos";
    }

    return errors;
  };

  const validatePassword = (
    data: PasswordChangeData,
  ): Partial<PasswordChangeData> => {
    const errors: Partial<PasswordChangeData> = {};

    if (data.currentPassword.length < 1) {
      errors.currentPassword = "Senha atual é obrigatória";
    }

    if (data.newPassword.length < 6) {
      errors.newPassword = "Nova senha deve ter pelo menos 6 caracteres";
    }

    if (data.confirmPassword !== data.newPassword) {
      errors.confirmPassword = "Senhas não coincidem";
    }

    return errors;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateProfile(profileData);
    setProfileErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const updateData: UpdateProfileRequest = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      };

      await updateProfileMutation.mutateAsync(updateData);

      notifications.show({
        title: "Sucesso",
        message: "Perfil atualizado com sucesso!",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      notifications.show({
        title: "Erro",
        message: "Erro ao atualizar perfil. Tente novamente.",
        color: "red",
        icon: <IconAlertTriangle size="1rem" />,
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validatePassword(passwordData);
    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const changeData: ChangePasswordRequest = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      await changePasswordMutation.mutateAsync(changeData);

      notifications.show({
        title: "Sucesso",
        message: "Senha alterada com sucesso!",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      notifications.show({
        title: "Erro",
        message: "Erro ao alterar senha. Verifique a senha atual.",
        color: "red",
        icon: <IconAlertTriangle size="1rem" />,
      });
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

  if (userLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando configurações...</Text>
      </Stack>
    );
  }

  if (userError) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} color="red">
        <Text size="sm">
          Erro ao carregar dados do usuário. Tente recarregar a página.
        </Text>
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Configurações da Conta</Title>
          <Text c="dimmed">
            Gerencie suas informações pessoais e configurações de segurança
          </Text>
        </div>
        <Group>
          <IconSettings size={24} />
        </Group>
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
                  onClick={() => {
                    notifications.show({
                      title: "Funcionalidade em desenvolvimento",
                      message: "Upload de foto estará disponível em breve.",
                      color: "blue",
                    });
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

                <form onSubmit={handleProfileUpdate}>
                  <Stack gap="md">
                    <Grid>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Nome Completo"
                          placeholder="Digite seu nome completo"
                          leftSection={<IconUser size="1rem" />}
                          required
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          error={profileErrors.name}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Email"
                          placeholder="seu@email.com"
                          leftSection={<IconMail size="1rem" />}
                          required
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          error={profileErrors.email}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Telefone"
                          placeholder="(11) 99999-9999"
                          leftSection={<IconPhone size="1rem" />}
                          required
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          error={profileErrors.phone}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button
                        type="submit"
                        loading={updateProfileMutation.isPending}
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

                <form onSubmit={handlePasswordChange}>
                  <Stack gap="md">
                    <PasswordInput
                      label="Senha Atual"
                      placeholder="Digite sua senha atual"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      error={passwordErrors.currentPassword}
                    />

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <PasswordInput
                          label="Nova Senha"
                          placeholder="Digite a nova senha"
                          required
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          error={passwordErrors.newPassword}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <PasswordInput
                          label="Confirmar Nova Senha"
                          placeholder="Confirme a nova senha"
                          required
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          error={passwordErrors.confirmPassword}
                        />
                      </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setPasswordErrors({});
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        loading={changePasswordMutation.isPending}
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
                        Último Login
                      </Text>
                      <Text fw={500}>
                        {new Date().toLocaleDateString("pt-BR")}
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Configurações de Segurança */}
            <Card withBorder padding="lg">
              <Stack gap="md">
                <Text size="lg" fw={600}>
                  Configurações de Segurança
                </Text>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">
                        Autenticação de Dois Fatores
                      </Text>
                      <Badge color="gray" variant="light">
                        Desabilitada
                      </Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">
                        Sessões Ativas
                      </Text>
                      <Text fw={500}>1 dispositivo</Text>
                    </Stack>
                  </Grid.Col>
                </Grid>

                <Alert
                  icon={<IconAlertTriangle size="1rem" />}
                  title="Recomendação de Segurança"
                  color="blue"
                  variant="light"
                >
                  <Text size="sm">
                    Para maior segurança, recomendamos habilitar a autenticação
                    de dois fatores e revisar regularmente suas sessões ativas.
                  </Text>
                </Alert>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
