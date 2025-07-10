'use client';

import { useState } from 'react';
import {
  Title,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Select,
  Grid,
  Textarea,
  Switch,
  Alert,
  Divider,
  ActionIcon,
} from '@mantine/core';
import {
  IconUsers,
  IconCheck,
  IconX,
  IconClock,
  IconMapPin,
  IconAlertCircle,
  IconSend,
  IconRefresh,
} from '@tabler/icons-react';

// Mock data
const mockRoutes = [
  {
    id: 1,
    destination: 'Campus Norte - UNIFESP',
    time: '07:30',
    boardingPoint: 'Terminal Rodoviário',
    status: 'active',
  },
  {
    id: 2,
    destination: 'Campus Norte - UNIFESP',
    time: '12:30',
    boardingPoint: 'Terminal Rodoviário',
    status: 'pending',
  },
];

const mockStudents = [
  {
    id: 1,
    name: 'Ana Silva Santos',
    boardingPoint: 'Terminal Rodoviário',
    phone: '(11) 99999-1111',
    status: null, // null, 'present', 'absent'
    observation: '',
  },
  {
    id: 2,
    name: 'Carlos Eduardo Lima',
    boardingPoint: 'Terminal Rodoviário',
    phone: '(11) 99999-2222',
    status: 'present',
    observation: '',
  },
  {
    id: 3,
    name: 'Mariana Costa Oliveira',
    boardingPoint: 'Shopping Center',
    phone: '(11) 99999-3333',
    status: null,
    observation: '',
  },
  {
    id: 4,
    name: 'Pedro Henrique Souza',
    boardingPoint: 'Terminal Rodoviário',
    phone: '(11) 99999-4444',
    status: 'absent',
    observation: 'Avisou que não vai hoje',
  },
  {
    id: 5,
    name: 'Juliana Ferreira',
    boardingPoint: 'Shopping Center',
    phone: '(11) 99999-5555',
    status: 'present',
    observation: '',
  },
];

export default function PresencasPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>('1');
  const [students, setStudents] = useState(mockStudents);
  const [observations, setObservations] = useState<{[key: number]: string}>({});

  const selectedRouteData = mockRoutes.find(r => r.id.toString() === selectedRoute);

  const handlePresenceChange = (studentId: number, status: 'present' | 'absent') => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status }
        : student
    ));
  };

  const handleObservationChange = (studentId: number, observation: string) => {
    setObservations(prev => ({
      ...prev,
      [studentId]: observation
    }));
  };

  const handleSubmitAttendance = () => {
    // Aqui seria enviado para o backend
    console.log('Presenças confirmadas:', students);
    alert('Presenças confirmadas com sucesso!');
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const pendingCount = students.filter(s => s.status === null).length;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present': return 'green';
      case 'absent': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'absent': return 'Ausente';
      default: return 'Pendente';
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Confirmar Presença</Title>
        <ActionIcon variant="light" size="lg">
          <IconRefresh size="1.2rem" />
        </ActionIcon>
      </Group>

      {/* Seleção de rota */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Selecione a rota"
              placeholder="Escolha uma rota"
              data={mockRoutes.map(route => ({
                value: route.id.toString(),
                label: `${route.time} - ${route.destination}`
              }))}
              value={selectedRoute}
              onChange={(value) => setSelectedRoute(value || '1')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {selectedRouteData && (
              <div>
                <Text size="sm" c="dimmed" mb="xs">Informações da Rota</Text>
                <Group gap="md">
                  <Group gap="xs">
                    <IconClock size="0.8rem" />
                    <Text size="sm">{selectedRouteData.time}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconMapPin size="0.8rem" />
                    <Text size="sm">{selectedRouteData.boardingPoint}</Text>
                  </Group>
                  <Badge color={selectedRouteData.status === 'active' ? 'green' : 'orange'} variant="light">
                    {selectedRouteData.status === 'active' ? 'Em andamento' : 'Pendente'}
                  </Badge>
                </Group>
              </div>
            )}
          </Grid.Col>
        </Grid>
      </Card>

      {/* Resumo de presenças */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md" style={{ backgroundColor: '#f0f9ff' }}>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Presentes</Text>
                <Text size="xl" fw={700} c="green">{presentCount}</Text>
              </div>
              <IconCheck size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md" style={{ backgroundColor: '#fef2f2' }}>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Ausentes</Text>
                <Text size="xl" fw={700} c="red">{absentCount}</Text>
              </div>
              <IconX size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md" style={{ backgroundColor: '#f9fafb' }}>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Pendentes</Text>
                <Text size="xl" fw={700} c="gray">{pendingCount}</Text>
              </div>
              <IconUsers size="2rem" color="gray" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Lista de alunos */}
      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Lista de Alunos</Text>
          <Text size="sm" c="dimmed">
            {students.length} alunos cadastrados
          </Text>
        </Group>

        <Stack gap="md">
          {students.map((student) => (
            <Card key={student.id} withBorder radius="sm" padding="md">
              <Grid align="center">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <div>
                    <Text fw={500}>{student.name}</Text>
                    <Group gap="xs" mt="xs">
                      <IconMapPin size="0.8rem" />
                      <Text size="sm" c="dimmed">{student.boardingPoint}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">{student.phone}</Text>
                  </div>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Group gap="xs">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'filled' : 'light'}
                      color="green"
                      leftSection={<IconCheck size="0.8rem" />}
                      onClick={() => handlePresenceChange(student.id, 'present')}
                    >
                      Presente
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'filled' : 'light'}
                      color="red"
                      leftSection={<IconX size="0.8rem" />}
                      onClick={() => handlePresenceChange(student.id, 'absent')}
                    >
                      Ausente
                    </Button>
                  </Group>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 2 }}>
                  <Badge color={getStatusColor(student.status)} variant="light">
                    {getStatusLabel(student.status)}
                  </Badge>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Textarea
                    placeholder="Observações..."
                    size="sm"
                    rows={2}
                    value={observations[student.id] || student.observation}
                    onChange={(e) => handleObservationChange(student.id, e.target.value)}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </Stack>

        <Divider my="lg" />

        {pendingCount > 0 && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="orange" mb="md">
            <Text size="sm">
              Ainda há {pendingCount} aluno(s) com presença pendente. 
              Confirme a presença de todos antes de finalizar.
            </Text>
          </Alert>
        )}

        <Group justify="flex-end">
          <Button 
            variant="light" 
            onClick={() => {
              setStudents(mockStudents);
              setObservations({});
            }}
          >
            Limpar
          </Button>
          <Button 
            leftSection={<IconSend size="1rem" />}
            onClick={handleSubmitAttendance}
            disabled={pendingCount > 0}
          >
            Confirmar Presenças
          </Button>
        </Group>
      </Card>
    </Stack>
  );
}
