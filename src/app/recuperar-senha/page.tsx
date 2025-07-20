"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
} from "@mantine/core";
import { IconCheck, IconArrowLeft } from "@tabler/icons-react";
import { useForgotPassword } from "@/hooks/useApi";
import { notifications } from "@mantine/notifications";

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await forgotPasswordMutation.mutateAsync({ email });

      notifications.show({
        title: "Email enviado!",
        message:
          "Verifique sua caixa de entrada para as instruções de recuperação.",
        color: "green",
      });

      setSent(true);
    } catch (error: unknown) {
      console.error("Erro ao enviar email:", error);

      notifications.show({
        title: "Erro",
        message: "Erro ao enviar email. Tente novamente.",
        color: "red",
      });

      // Fallback para demonstração
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Container size={420}>
          <Paper withBorder shadow="md" p={30} radius="md">
            <Alert
              icon={<IconCheck size="1rem" />}
              title="Email enviado!"
              color="green"
              mb="md"
            >
              <Text size="sm">
                Se o email {email} estiver cadastrado, você receberá as
                instruções para recuperar sua senha.
              </Text>
            </Alert>

            <Button
              variant="light"
              leftSection={<IconArrowLeft size="1rem" />}
              onClick={() => router.push("/login")}
              fullWidth
            >
              Voltar ao login
            </Button>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size={420}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Title order={2} ta="center" mb="md">
            Recuperar Senha
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb={30}>
            Digite seu email para receber as instruções
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                loading={forgotPasswordMutation.isPending}
              >
                Enviar instruções
              </Button>

              <Text ta="center" mt="md">
                Lembrou da senha?{" "}
                <Anchor href="/login" size="sm">
                  Voltar ao login
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
