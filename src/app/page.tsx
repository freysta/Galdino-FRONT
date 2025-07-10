'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Loader, Text, Stack } from '@mantine/core';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para login após um breve delay
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Container size="sm">
        <Stack align="center" gap="md">
          <Text size="xl" fw={700}>InterUniBus</Text>
          <Text c="dimmed">Carregando sistema...</Text>
          <Loader size="md" />
        </Stack>
      </Container>
    </div>
  );
}
