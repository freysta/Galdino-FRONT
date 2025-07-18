"use client";

import { useState } from "react";
import {
  Paper,
  UnstyledButton,
  Text,
  Group,
  Avatar,
  Box,
  Stack,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconDashboard,
  IconUsers,
  IconCar,
  IconRoute,
  IconMapPin,
  IconCreditCard,
  IconBell,
  IconUserCheck,
  IconHistory,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  userType: "admin" | "motorista" | "aluno";
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  link: string;
  description: string;
  badge?: string;
}

export default function ModernSidebar({ userType }: SidebarProps) {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");

  const adminMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconDashboard,
      link: "/admin/dashboard",
      description: "Visão geral do sistema",
    },
    {
      id: "alunos",
      label: "Alunos",
      icon: IconUsers,
      link: "/admin/alunos",
      description: "Gerenciar estudantes",
      badge: "",
    },
    {
      id: "motoristas",
      label: "Motoristas",
      icon: IconCar,
      link: "/admin/motoristas",
      description: "Gerenciar condutores",
    },
    {
      id: "rotas",
      label: "Rotas",
      icon: IconRoute,
      link: "/admin/rotas",
      description: "Planejamento de viagens",
    },
    {
      id: "pontos",
      label: "Pontos de Embarque",
      icon: IconMapPin,
      link: "/admin/pontos",
      description: "Locais de embarque",
    },
    {
      id: "pagamentos",
      label: "Pagamentos",
      icon: IconCreditCard,
      link: "/admin/pagamentos",
      description: "Controle financeiro",
    },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: IconBell,
      link: "/admin/notificacoes",
      description: "Comunicados",
    },
  ];

  const motoristaMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconDashboard,
      link: "/motorista/dashboard",
      description: "Minhas rotas de hoje",
    },
    {
      id: "presencas",
      label: "Confirmar Presença",
      icon: IconUserCheck,
      link: "/motorista/presencas",
      description: "Registro de passageiros",
    },
    {
      id: "historico",
      label: "Histórico",
      icon: IconHistory,
      link: "/motorista/historico",
      description: "Rotas anteriores",
    },
  ];

  const alunoMenuItems: MenuItem[] = [
    {
      id: "rotas",
      label: "Minhas Rotas",
      icon: IconRoute,
      link: "/aluno/rotas",
      description: "Próximas viagens",
    },
    {
      id: "pagamentos",
      label: "Pagamentos",
      icon: IconCreditCard,
      link: "/aluno/pagamentos",
      description: "Situação financeira",
    },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: IconBell,
      link: "/aluno/notificacoes",
      description: "Comunicados recebidos",
    },
    {
      id: "perfil",
      label: "Perfil",
      icon: IconUser,
      link: "/aluno/perfil",
      description: "Meus dados",
    },
  ];

  const getMenuItems = () => {
    switch (userType) {
      case "admin":
        return adminMenuItems;
      case "motorista":
        return motoristaMenuItems;
      case "aluno":
        return alunoMenuItems;
      default:
        return [];
    }
  };

  const getUserInfo = () => {
    switch (userType) {
      case "admin":
        return { name: "Admin Galdino", role: "Administrador", avatar: "AG" };
      case "motorista":
        return { name: "João Silva", role: "Motorista", avatar: "JS" };
      case "aluno":
        return { name: "Maria Santos", role: "Estudante", avatar: "MS" };
      default:
        return { name: "Usuário", role: "Visitante", avatar: "U" };
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const menuItems = getMenuItems();
  const userInfo = getUserInfo();

  return (
    <Paper
      shadow="xl"
      radius={0}
      style={{
        backgroundColor: "#ffffff",
        height: "100vh",
        width: 280,
        position: "sticky",
        top: 0,
        borderRight: "1px solid #f1f3f4",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box p="xl" style={{ borderBottom: "1px solid #f1f3f4" }}>
        <Group gap="md">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="lg" fw={700} c="white">
              G
            </Text>
          </Box>
          <div>
            <Text size="xl" fw={700} c="#1f2937">
              Galdino
            </Text>
            <Text size="xs" c="#6b7280">
              Sistema de Transporte
            </Text>
          </div>
        </Group>
      </Box>

      {/* Menu Items */}
      <Box style={{ flex: 1, padding: "16px 0", backgroundColor: "#ffffff" }}>
        <Stack gap="xs">
          {menuItems.map((item) => (
            <Link href={item.link} key={item.id} passHref legacyBehavior>
              <UnstyledButton
                component="a"
                onClick={() => setActive(item.id)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 20px",
                  borderRadius: 0,
                  backgroundColor: active === item.id ? "#f0fdf4" : "#ffffff",
                  borderRight:
                    active === item.id
                      ? "3px solid #22c55e"
                      : "3px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (active !== item.id) {
                    e.currentTarget.style.backgroundColor = "#f8fffe";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== item.id) {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="md" wrap="nowrap">
                    <Box
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor:
                          active === item.id ? "#22c55e" : "#f0fdf4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <item.icon
                        size={18}
                        color={active === item.id ? "white" : "#16a34a"}
                      />
                    </Box>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size="sm"
                        fw={active === item.id ? 600 : 500}
                        c={active === item.id ? "#16a34a" : "#374151"}
                        style={{ lineHeight: 1.2 }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        size="xs"
                        c="#9ca3af"
                        style={{ lineHeight: 1.2, marginTop: 2 }}
                      >
                        {item.description}
                      </Text>
                    </div>
                  </Group>
                  <Group gap="xs">
                    {item.badge && (
                      <Badge
                        size="sm"
                        variant="filled"
                        color="green"
                        style={{ fontSize: "10px" }}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <IconChevronRight
                      size={14}
                      color="#22c55e"
                      style={{
                        opacity: active === item.id ? 1 : 0,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                  </Group>
                </Group>
              </UnstyledButton>
            </Link>
          ))}
        </Stack>
      </Box>

      {/* User Profile & Settings */}
      <Box
        style={{ borderTop: "1px solid #f1f3f4", backgroundColor: "#ffffff" }}
      >
        <Box p="md">
          <Group justify="space-between" mb="xs">
            <Group gap="sm">
              <Avatar
                size="sm"
                radius="md"
                color="green"
                style={{ backgroundColor: "#22c55e" }}
              >
                {userInfo.avatar}
              </Avatar>
              <div>
                <Text size="sm" fw={600} c="#374151">
                  {userInfo.name}
                </Text>
                <Text size="xs" c="#9ca3af">
                  {userInfo.role}
                </Text>
              </div>
            </Group>
            <Group gap="xs">
              <Tooltip label="Configurações">
                <ActionIcon
                  variant="subtle"
                  color="green"
                  size="sm"
                  style={{
                    backgroundColor: "#f0fdf4",
                    color: "#16a34a",
                  }}
                >
                  <IconSettings size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Sair">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                  }}
                >
                  <IconLogout size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Box>
      </Box>
    </Paper>
  );
}
