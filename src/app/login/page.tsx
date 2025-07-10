'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    
    if (!email || !/^\S+@\S+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password || password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulação de login - sem backend por enquanto
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirecionar baseado no tipo de usuário (simulado)
    // Por enquanto, vamos usar o email para determinar o tipo
    if (email.includes('admin')) {
      router.push('/admin/dashboard');
    } else if (email.includes('motorista')) {
      router.push('/motorista/dashboard');
    } else {
      router.push('/aluno/rotas');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size={420}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Title order={2} ta="center" mb="md">
            InterUniBus
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb={30}>
            Sistema de Transporte Universitário
          </Text>

          <Alert icon={<IconInfoCircle size="1rem" />} title="Demonstração" color="blue" mb="md">
            <Text size="sm">
              Use emails como: admin@test.com, motorista@test.com, ou aluno@test.com
            </Text>
          </Alert>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <Button type="submit" fullWidth loading={loading}>
                Entrar
              </Button>

              <Text ta="center" mt="md">
                Esqueceu sua senha?{' '}
                <Anchor href="/recuperar-senha" size="sm">
                  Recuperar senha
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
