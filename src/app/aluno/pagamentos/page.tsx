"use client";

import { useState } from "react";
import {
  Title,
  Group,
  Stack,
  Card,
  Badge,
  Text,
  Button,
  Grid,
  Select,
  Alert,
  Modal,
  Divider,
  Loader,
  Table,
} from "@mantine/core";
import {
  IconCreditCard,
  IconDownload,
  IconEye,
  IconAlertCircle,
  IconInfoCircle,
  IconCash,
  IconCalendar,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { usePayments, useCurrentUser, type Payment } from "@/hooks/useApi";

export default function AlunoPagamentosPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Usar React Query hooks
  const { data: currentUser } = useCurrentUser();
  const {
    data: paymentsData = [],
    isLoading,
    error,
  } = usePayments(currentUser?.id, statusFilter || undefined);

  // Garantir que é um array
  const payments = Array.isArray(paymentsData) ? paymentsData : [];

  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "green";
      case "Pendente":
        return "orange";
      case "Atrasado":
        return "red";
      default:
        return "gray";
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    open();
  };

  const handlePayment = (paymentId: number) => {
    notifications.show({
      title: "Redirecionamento",
      message: `Redirecionando para pagamento da mensalidade ID: ${paymentId}`,
      color: "blue",
    });
  };

  const handleExportReceipts = () => {
    notifications.show({
      title: "Funcionalidade em desenvolvimento",
      message: "A exportação de comprovantes estará disponível em breve.",
      color: "blue",
    });
  };

  // Calcular estatísticas
  const totalPaid = payments
    .filter((p: Payment) => p.status === "Pago")
    .reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p: Payment) => p.status === "Pendente")
    .reduce((sum: number, p: Payment) => sum + p.amount, 0);
  const pendingCount = payments.filter(
    (p: Payment) => p.status === "Pendente",
  ).length;

  if (isLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text>Carregando pagamentos...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} color="red">
        <Text size="sm">
          Erro ao carregar pagamentos. Tente recarregar a página.
        </Text>
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Meus Pagamentos</Title>
          <Text c="dimmed">
            Acompanhe suas mensalidades e histórico de pagamentos
          </Text>
        </div>
        <Button
          leftSection={<IconDownload size="1rem" />}
          onClick={handleExportReceipts}
        >
          Exportar Comprovantes
        </Button>
      </Group>

      {/* Alerta de pendências */}
      {pendingCount > 0 && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="orange">
          <Text size="sm">
            Você tem <strong>{pendingCount} mensalidade(s) pendente(s)</strong>{" "}
            no valor total de R$ {totalPending.toFixed(2)}. Clique em "Pagar"
            para regularizar sua situação.
          </Text>
        </Alert>
      )}

      {/* Cards de estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Total Pago
                </Text>
                <Text size="xl" fw={700} c="green">
                  R$ {totalPaid.toFixed(2)}
                </Text>
              </div>
              <IconCash size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Pendente
                </Text>
                <Text size="xl" fw={700} c="orange">
                  R$ {totalPending.toFixed(2)}
                </Text>
              </div>
              <IconAlertCircle size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb="xs">
                  Mensalidade
                </Text>
                <Text size="xl" fw={700} c="blue">
                  R$ 150,00
                </Text>
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
                { value: "Pago", label: "Pago" },
                { value: "Pendente", label: "Pendente" },
                { value: "Atrasado", label: "Atrasado" },
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
              <Table.Th>Status</Table.Th>
              <Table.Th>Forma de Pagamento</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment: Payment) => (
                <Table.Tr key={payment.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {payment.monthLabel || payment.month}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      R$ {payment.amount.toFixed(2)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(payment.status)}
                      variant="light"
                    >
                      {payment.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {payment.status === "Pago"
                        ? payment.paymentMethod || "N/A"
                        : "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconEye size="0.8rem" />}
                        onClick={() => handleViewDetails(payment)}
                      >
                        Ver Detalhes
                      </Button>
                      {payment.status === "Pendente" && (
                        <Button
                          size="xs"
                          color="green"
                          onClick={() => handlePayment(payment.id!)}
                        >
                          Pagar
                        </Button>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" c="dimmed">
                    Nenhum pagamento encontrado
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Informações sobre pagamento */}
      <Card withBorder padding="lg">
        <Group mb="md">
          <IconInfoCircle size="1.2rem" color="blue" />
          <Text fw={500} size="lg">
            Informações sobre Pagamento
          </Text>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Formas de Pagamento Aceitas:
              </Text>
              <Text size="sm">• PIX (desconto de 5%)</Text>
              <Text size="sm">• Cartão de Crédito</Text>
              <Text size="sm">• Cartão de Débito</Text>
              <Text size="sm">• Boleto Bancário</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Informações Importantes:
              </Text>
              <Text size="sm">• Vencimento todo dia 5 do mês</Text>
              <Text size="sm">• Multa de 2% após o vencimento</Text>
              <Text size="sm">• Juros de 1% ao mês</Text>
              <Text size="sm">• Desconto de 5% para pagamento via PIX</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Modal de detalhes */}
      <Modal
        opened={opened}
        onClose={close}
        title="Detalhes do Pagamento"
        size="md"
      >
        {selectedPayment && (
          <Stack gap="md">
            <div>
              <Text size="sm" c="dimmed">
                Mês/Ano:
              </Text>
              <Text fw={500}>
                {selectedPayment.monthLabel || selectedPayment.month}
              </Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">
                Valor:
              </Text>
              <Text fw={500}>R$ {selectedPayment.amount.toFixed(2)}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">
                Status:
              </Text>
              <Badge
                color={getStatusColor(selectedPayment.status)}
                variant="light"
              >
                {selectedPayment.status}
              </Badge>
            </div>

            {selectedPayment.status === "Pago" && (
              <>
                <div>
                  <Text size="sm" c="dimmed">
                    Data do Pagamento:
                  </Text>
                  <Group gap="xs">
                    <IconCalendar size="1rem" />
                    <Text fw={500}>
                      {selectedPayment.paymentDate
                        ? new Date(
                            selectedPayment.paymentDate,
                          ).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </Text>
                  </Group>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Forma de Pagamento:
                  </Text>
                  <Group gap="xs">
                    <IconCreditCard size="1rem" />
                    <Text fw={500}>
                      {selectedPayment.paymentMethod || "N/A"}
                    </Text>
                  </Group>
                </div>
              </>
            )}

            {selectedPayment.dueDate && (
              <div>
                <Text size="sm" c="dimmed">
                  Data de Vencimento:
                </Text>
                <Group gap="xs">
                  <IconCalendar size="1rem" />
                  <Text fw={500}>
                    {new Date(selectedPayment.dueDate).toLocaleDateString(
                      "pt-BR",
                    )}
                  </Text>
                </Group>
              </div>
            )}

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={close}>
                Fechar
              </Button>
              {selectedPayment.status === "Pendente" && (
                <Button
                  color="green"
                  onClick={() => handlePayment(selectedPayment.id!)}
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
