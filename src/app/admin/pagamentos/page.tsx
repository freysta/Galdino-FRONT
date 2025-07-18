"use client";

import { useState } from "react";
import {
  Title,
  Button,
  TextInput,
  Group,
  Stack,
  Card,
  Badge,
  ActionIcon,
  Modal,
  Select,
  Grid,
  Text,
  Table,
  Pagination,
  Menu,
  NumberInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconDots,
  IconCheck,
  IconX,
  IconClock,
  IconDownload,
} from "@tabler/icons-react";

import {
  usePayments,
  useApiOperations,
  apiOperations,
} from "@/hooks/useApiData";
import { Payment } from "@/services/api";

export default function PagamentosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Usar a API real
  const { data: payments, loading, error, refetch } = usePayments();
  const { execute, loading: operationLoading } = useApiOperations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "green";
      case "Pendente":
        return "yellow";
      case "Atrasado":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    return status || "Desconhecido";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pago":
        return <IconCheck size="0.8rem" />;
      case "Pendente":
        return <IconClock size="0.8rem" />;
      case "Atrasado":
        return <IconX size="0.8rem" />;
      default:
        return null;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.studentName &&
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.route &&
        payment.route.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesMonth = !monthFilter || payment.month === monthFilter;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    open();
  };

  const handleMarkAsPaid = async (paymentId: number) => {
    if (!paymentId) return;
    try {
      await execute(() =>
        apiOperations.payments.update(paymentId, {
          status: "Pago",
          paymentDate: new Date().toISOString().split("T")[0],
        }),
      );
      refetch();
    } catch (error) {
      alert("Erro ao marcar pagamento como pago");
    }
  };

  const handleAddNew = () => {
    setEditingPayment(null);
    open();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayments
    .filter((p) => p.status === "Pago")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments
    .filter((p) => p.status === "Pendente")
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = filteredPayments
    .filter((p) => p.status === "Atrasado")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Gerenciar Pagamentos</Title>
        <Group>
          <Button variant="light" leftSection={<IconDownload size="1rem" />}>
            Exportar
          </Button>
          <Button leftSection={<IconPlus size="1rem" />} onClick={handleAddNew}>
            Adicionar Cobrança
          </Button>
        </Group>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Total Geral
            </Text>
            <Text size="xl" fw={700}>
              R$ {totalAmount.toFixed(2)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Recebido
            </Text>
            <Text size="xl" fw={700} c="green">
              R$ {paidAmount.toFixed(2)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Pendente
            </Text>
            <Text size="xl" fw={700} c="yellow">
              R$ {pendingAmount.toFixed(2)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Text size="sm" c="dimmed" mb="xs">
              Em Atraso
            </Text>
            <Text size="xl" fw={700} c="red">
              R$ {overdueAmount.toFixed(2)}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Buscar por aluno ou rota..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Status"
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
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              placeholder="Mês"
              data={[
                { value: "2024-01", label: "Janeiro 2024" },
                { value: "2024-02", label: "Fevereiro 2024" },
                { value: "2024-03", label: "Março 2024" },
              ]}
              value={monthFilter}
              onChange={setMonthFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">
              {filteredPayments.length} registro(s)
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Tabela de pagamentos */}
      <Card withBorder padding="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Aluno</Table.Th>
              <Table.Th>Mês/Ano</Table.Th>
              <Table.Th>Valor</Table.Th>
              <Table.Th>Vencimento</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Pagamento</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedPayments.map((payment) => (
              <Table.Tr key={payment.id}>
                <Table.Td>
                  <div>
                    <Text fw={500}>{payment.studentName || "N/A"}</Text>
                    <Text size="xs" c="dimmed">
                      Rota: {payment.route || "N/A"}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{payment.monthLabel || payment.month}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    R$ {payment.amount.toFixed(2)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {payment.dueDate
                      ? new Date(payment.dueDate).toLocaleDateString("pt-BR")
                      : "N/A"}
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
                  {payment.status === "Pago" && payment.paymentDate ? (
                    <div>
                      <Text size="sm">
                        {new Date(payment.paymentDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {payment.paymentMethod || "N/A"}
                      </Text>
                    </div>
                  ) : (
                    <Text size="sm" c="dimmed">
                      -
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots size="1rem" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size="0.9rem" />}>
                        Visualizar
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size="0.9rem" />}
                        onClick={() => handleEdit(payment)}
                      >
                        Editar
                      </Menu.Item>
                      {payment.status !== "Pago" && (
                        <>
                          <Menu.Divider />
                          <Menu.Item
                            color="green"
                            leftSection={<IconCheck size="0.9rem" />}
                            onClick={() => handleMarkAsPaid(payment.id!)}
                          >
                            Marcar como Pago
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {totalPages > 1 && (
          <Group justify="center" mt="md">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        )}
      </Card>

      {/* Modal de adicionar/editar pagamento */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingPayment ? "Editar Pagamento" : "Adicionar Cobrança"}
        size="lg"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={12}>
              <Select
                label="Aluno"
                placeholder="Selecione um aluno"
                data={[
                  { value: "1", label: "Ana Silva Santos" },
                  { value: "2", label: "Carlos Eduardo Lima" },
                  { value: "3", label: "Mariana Costa Oliveira" },
                  { value: "4", label: "Pedro Henrique Souza" },
                  { value: "5", label: "Juliana Ferreira" },
                ]}
                required
                defaultValue={editingPayment?.studentId?.toString()}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Mês/Ano"
                placeholder="Selecione o mês"
                data={[
                  { value: "2024-01", label: "Janeiro 2024" },
                  { value: "2024-02", label: "Fevereiro 2024" },
                  { value: "2024-03", label: "Março 2024" },
                  { value: "2024-04", label: "Abril 2024" },
                ]}
                required
                defaultValue={editingPayment?.month}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Valor (R$)"
                placeholder="150.00"
                decimalScale={2}
                fixedDecimalScale
                required
                defaultValue={editingPayment?.amount}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data de vencimento"
                placeholder="DD/MM/AAAA"
                required
                defaultValue={editingPayment?.dueDate}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                data={[
                  { value: "Pendente", label: "Pendente" },
                  { value: "Pago", label: "Pago" },
                  { value: "Atrasado", label: "Atrasado" },
                ]}
                required
                defaultValue={editingPayment?.status}
              />
            </Grid.Col>
            {editingPayment?.status === "Pago" && (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Data do pagamento"
                    placeholder="DD/MM/AAAA"
                    defaultValue={editingPayment?.paymentDate}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Forma de pagamento"
                    placeholder="Selecione a forma"
                    data={[
                      { value: "PIX", label: "PIX" },
                      { value: "Cartão", label: "Cartão" },
                      { value: "Dinheiro", label: "Dinheiro" },
                      { value: "Transferência", label: "Transferência" },
                    ]}
                    defaultValue={editingPayment?.paymentMethod}
                  />
                </Grid.Col>
              </>
            )}
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>
              {editingPayment ? "Salvar" : "Adicionar"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
