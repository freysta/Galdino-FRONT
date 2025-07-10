'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mantine/core';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    // Simulação de envio de email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Container size={420}>
          <Paper withBorder shadow="md" p={30} radius="md">
            <Alert icon={<IconCheck size="1rem" />} title="Email enviado!" color="green" mb="md">
              <Text size="sm">
                Se o email {email} estiver cadastrado, você receberá as instruções para recuperar sua senha.
              </Text>
            </Alert>

            <Button 
              variant="light" 
              leftSection={<IconArrowLeft size="1rem" />}
              onClick={() => router.push('/login')}
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

              <Button type="submit" fullWidth loading={loading}>
                Enviar instruções
              </Button>

              <Text ta="center" mt="md">
                Lembrou da senha?{' '}
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
