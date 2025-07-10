'use client';

import { useState } from 'react';
import {
  Title,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Button,
  Grid,
  Alert,
  Table,
  Select,
  Modal,
  Divider,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCreditCard,
  IconCheck,
  IconClock,
  IconX,
  IconDownload,
  IconEye,
  IconAlertCircle,
  IconInfoCircle,
  IconReceipt,
} from '@tabler/icons-react';

// Mock data
const mockPayments = [
  {
    id: 1,
    month: '2024-01',
    monthLabel: 'Janeiro 2024',
    amount: 150.00,
    dueDate: '2024-01-05',
    paymentDate: '2024-01-03',
    status: 'paid',
    paymentMethod: 'PIX',
    transactionId: 'PIX123456789',
    description: 'Mensalidade - Campus Norte',
  },
  {
    id: 2,
    month: '2023-12',
    monthLabel: 'Dezembro 2023',
    amount: 150.00,
    dueDate: '2023-12-05',
    paymentDate: '2023-12-04',
    status: 'paid',
    paymentMethod: 'Cartão de Crédito',
    transactionId: 'CC987654321',
    description: 'Mensalidade - Campus Norte',
  },
  {
    id: 3,
    month: '2023-11',
    monthLabel: 'Novembro 2023',
    amount: 150.00,
    dueDate: '2023-11-05',
    paymentDate: '2023-11-08',
    status: 'paid',
    paymentMethod: 'Boleto',
    transactionId: 'BOL456789123',
    description: 'Mensalidade - Campus Norte',
  },
  {
    id: 4,
    month: '2024-02',
    monthLabel: 'Fevereiro 2024',
    amount: 150.00,
    dueDate: '2024-02-05',
    paymentDate: null,
    status: 'pending',
    paymentMethod: null,
    transactionId: null,
    description: 'Mensalidade - Campus Norte',
  },
  {
    id: 5,
    month: '2024-03',
    monthLabel: 'Março 2024',
    amount: 150.00,
    dueDate: '2024-03-05',
    paymentDate: null,
    status: 'pending',
    paymentMethod: null,
    transactionId: null,
    description: 'Mensalidade - Campus Norte',
  },
];

export default function AlunoPagamentosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [payments] = useState(mockPayments);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Atrasado';
      default: return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <IconCheck size="0.8rem" />;
      case 'pending': return <IconClock size="0.8rem" />;
      case 'overdue': return <IconX size="0.8rem" />;
      default: return null;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesStatus;
  });

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    open();
  };

  const handlePayment = (paymentId: number) => {
    // Aqui seria redirecionado para o gateway de pagamento
    alert(`Redirecionando para pagamento da mensalidade ID: ${paymentId}`);
  };

  // Estatísticas
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Meus Pagamentos</Title>
          <Text c="dimmed">
            Acompanhe suas mensalidades e histórico de pagamentos
          </Text>
        </div>
        <Button leftSection={<IconDownload size="1rem" />} variant="light">
          Exportar Comprovantes
        </Button>
      </Group>

      {/* Alertas */}
      {pendingCount > 0 && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="orange">
          <Text size="sm">
            Você tem <strong>{pendingCount} mensalidade(s) pendente(s)</strong> no valor total de R$ {totalPending.toFixed(2)}. 
            Clique em "Pagar" para regularizar sua situação.
          </Text>
        </Alert>
      )}

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Total Pago</Text>
                <Text size="xl" fw={700} c="green">R$ {totalPaid.toFixed(2)}</Text>
              </div>
              <IconCheck size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Pendente</Text>
                <Text size="xl" fw={700} c="orange">R$ {totalPending.toFixed(2)}</Text>
              </div>
              <IconClock size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Mensalidade</Text>
                <Text size="xl" fw={700}>R$ 150,00</Text>
              </div>
              <IconCreditCard size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filtrar por status"
              data={[
                { value: 'paid', label: 'Pago' },
                { value: 'pending', label: 'Pendente' },
                { value: 'overdue', label: 'Atrasado' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Text size="sm" c="dimmed">
              {filteredPayments.length} registro(s) encontrado(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de pagamentos */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Mês/Ano</Table.Th>
              <Table.Th>Valor</Table.Th>
              <Table.Th>Vencimento</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Forma de Pagamento</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPayments.map((payment) => (
              <Table.Tr key={payment.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{payment.monthLabel}</Text>
                    <Text size="xs" c="dimmed">{payment.description}</Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>R$ {payment.amount.toFixed(2)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={getStatusColor(payment.status)} 
                    variant="light"
                    leftSection={getStatusIcon(payment.status)}
                  >
                    {getStatusLabel(payment.status)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {payment.status === 'paid' ? (
                    <div>
                      <Text size="sm">{payment.paymentMethod}</Text>
                      <Text size="xs" c="dimmed">
                        {new Date(payment.paymentDate!).toLocaleDateString('pt-BR')}
                      </Text>
                    </div>
                  ) : (
                    <Text size="sm" c="dimmed">-</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon 
                      variant="subtle" 
                      color="blue"
                      onClick={() => handleViewDetails(payment)}
                    >
                      <IconEye size="1rem" />
                    </ActionIcon>
                    {payment.status === 'paid' && (
                      <ActionIcon variant="subtle" color="green">
                        <IconDownload size="1rem" />
                      </ActionIcon>
                    )}
                    {payment.status === 'pending' && (
                      <Button 
                        size="xs" 
                        onClick={() => handlePayment(payment.id)}
                        leftSection={<IconCreditCard size="0.8rem" />}
                      >
                        Pagar
                      </Button>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Informações sobre pagamento */}
      <Card withBorder padding="lg">
        <Group mb="md">
          <IconInfoCircle size="1.2rem" color="blue" />
          <Text fw={500} size="lg">Informações sobre Pagamento</Text>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>Formas de Pagamento Aceitas:</Text>
              <Text size="sm">• PIX (desconto de 5%)</Text>
              <Text size="sm">• Cartão de Crédito</Text>
              <Text size="sm">• Cartão de Débito</Text>
              <Text size="sm">• Boleto Bancário</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>Informações Importantes:</Text>
              <Text size="sm">• Vencimento todo dia 5 do mês</Text>
              <Text size="sm">• Multa de 2% após o vencimento</Text>
              <Text size="sm">• Juros de 1% ao mês</Text>
              <Text size="sm">• Desconto de 5% para pagamento via PIX</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Modal de detalhes */}
      <Modal opened={opened} onClose={close} title="Detalhes do Pagamento" size="md">
        {selectedPayment && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Mês/Ano</Text>
                <Text fw={500}>{selectedPayment.monthLabel}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Valor</Text>
                <Text fw={500}>R$ {selectedPayment.amount.toFixed(2)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Vencimento</Text>
                <Text fw={500}>
                  {new Date(selectedPayment.dueDate).toLocaleDateString('pt-BR')}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Status</Text>
                <Badge 
                  color={getStatusColor(selectedPayment.status)} 
                  variant="light"
                  leftSection={getStatusIcon(selectedPayment.status)}
                >
                  {getStatusLabel(selectedPayment.status)}
                </Badge>
              </Grid.Col>
              
              {selectedPayment.status === 'paid' && (
                <>
                  <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">Data do Pagamento</Text>
                    <Text fw={500}>
                      {new Date(selectedPayment.paymentDate).toLocaleDateString('pt-BR')}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">Forma de Pagamento</Text>
                    <Text fw={500}>{selectedPayment.paymentMethod}</Text>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text size="sm" c="dimmed">ID da Transação</Text>
                    <Text fw={500} ff="monospace">{selectedPayment.transactionId}</Text>
                  </Grid.Col>
                </>
              )}
              
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Descrição</Text>
                <Text fw={500}>{selectedPayment.description}</Text>
              </Grid.Col>
            </Grid>

            <Divider />

            <Group justify="flex-end">
              {selectedPayment.status === 'paid' && (
                <Button leftSection={<IconReceipt size="1rem" />} variant="light">
                  Baixar Comprovante
                </Button>
              )}
              {selectedPayment.status === 'pending' && (
                <Button 
                  leftSection={<IconCreditCard size="1rem" />}
                  onClick={() => handlePayment(selectedPayment.id)}
                >
                  Pagar Agora
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
