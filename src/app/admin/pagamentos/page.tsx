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
  Loader,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
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
  IconAlertCircle,
  IconCurrency,
} from "@tabler/icons-react";

import {
  usePayments,
  useCreatePayment,
  useUpdatePayment,
  useMarkPaymentAsPaid,
  useStudents,
  type Payment,
  type Student,
} from "@/hooks/useApi";

export default function PagamentosPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Usar a API real
  const { data: payments = [], isLoading, error } = usePayments();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const createMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();
  const markAsPaidMutation = useMarkPaymentAsPaid();

  // Garantir que students é um array e preparar dados para o select
  const studentsArray = Array.isArray(students) ? students : [];
  const studentsSelectData = studentsArray.map((student: Student) => ({
    value: student.id?.toString() || "",
    label: student.name || `Aluno #${student.id}`,
  }));

  // Garantir que payments é um array
  const paymentsArray = Array.isArray(payments) ? payments : [];

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

  const filteredPayments = paymentsArray.filter((payment: Payment) => {
    const matchesSearch =
      payment.studentId &&
      payment.studentId.toString().includes(searchTerm.toLowerCase());
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
      await markAsPaidMutation.mutateAsync({
        id: paymentId,
        paymentMethod: "PIX",
      });
      notifications.show({
        title: "Sucesso",
        message: "Pagamento marcado como pago!",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao marcar pagamento como pago",
        color: "red",
      });
    }
  };

  const handleAddNew = () => {
    setEditingPayment(null);
    open();
  };

  const handleSave = async (formData: FormData) => {
    try {
      const paymentData = {
        studentId: parseInt(formData.get("studentId") as string),
        amount: parseFloat(formData.get("amount") as string),
        month: formData.get("month") as string,
        status: formData.get("status") as "Pago" | "Pendente" | "Atrasado",
        paymentMethod: formData.get("paymentMethod") as
          | "Dinheiro"
          | "CartaoCredito"
          | "Pix"
          | "Transferencia",
      };

      if (editingPayment?.id) {
        await updateMutation.mutateAsync({
          id: editingPayment.id,
          data: paymentData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Pagamento atualizado com sucesso!",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(paymentData);
        notifications.show({
          title: "Sucesso",
          message: "Cobrança criada com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingPayment(null);
    } catch {
      notifications.show({
        title: "Erro",
        message: "Erro ao salvar pagamento",
        color: "red",
      });
    }
  };

  const isOperationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    markAsPaidMutation.isPending;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Estatísticas
  const totalAmount = filteredPayments.reduce(
    (sum: number, p: Payment) => sum + (p.amount || 0),
    0,
  );
  const paidAmount = filteredPayments
    .filter((p: Payment) => p.status === "Pago")
    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);
  const pendingAmount = filteredPayments
    .filter((p: Payment) => p.status === "Pendente")
    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);
  const overdueAmount = filteredPayments
    .filter((p: Payment) => p.status === "Atrasado")
    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <Text mt="md">Carregando pagamentos...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
            <Text size="sm">Erro ao carregar pagamentos</Text>
          </Alert>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Gerenciar Pagamentos</Title>
          <Text c="dimmed" mt="xs">
            Controle financeiro e cobrança dos alunos
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconDownload size="1rem" />}>
            Exportar
          </Button>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={handleAddNew}
            disabled={isOperationLoading}
          >
            Adicionar Cobrança
          </Button>
        </Group>
      </Group>

      {/* Estatísticas */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Total Geral
                </Text>
                <Text size="xl" fw={700}>
                  R$ {totalAmount.toFixed(2)}
                </Text>
              </div>
              <IconCurrency size="2rem" color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Recebido
                </Text>
                <Text size="xl" fw={700} c="green">
                  R$ {paidAmount.toFixed(2)}
                </Text>
              </div>
              <IconCheck size="2rem" color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Pendente
                </Text>
                <Text size="xl" fw={700} c="yellow">
                  R$ {pendingAmount.toFixed(2)}
                </Text>
              </div>
              <IconClock size="2rem" color="orange" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder padding="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Em Atraso
                </Text>
                <Text size="xl" fw={700} c="red">
                  R$ {overdueAmount.toFixed(2)}
                </Text>
              </div>
              <IconX size="2rem" color="red" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Card withBorder padding="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Buscar por aluno ou ID..."
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
                { value: "2024-04", label: "Abril 2024" },
                { value: "2024-05", label: "Maio 2024" },
                { value: "2024-06", label: "Junho 2024" },
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
        <div className="overflow-x-auto">
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
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment: Payment) => (
                  <Table.Tr key={payment.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>
                          {payment.studentName ||
                            `Aluno #${payment.studentId || "N/A"}`}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ID: {payment.id || "N/A"}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {payment.monthLabel || payment.month}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        R$ {(payment.amount || 0).toFixed(2)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {payment.dueDate
                          ? new Date(payment.dueDate).toLocaleDateString(
                              "pt-BR",
                            )
                          : "Não informado"}
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
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ textAlign: "center" }}>
                    <Text c="dimmed">
                      {searchTerm || statusFilter || monthFilter
                        ? "Nenhum pagamento encontrado"
                        : "Nenhum pagamento cadastrado"}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSave(formData);
          }}
        >
          <Stack gap="md">
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Aluno"
                  placeholder="Selecione um aluno"
                  name="studentId"
                  data={studentsSelectData}
                  required
                  defaultValue={editingPayment?.studentId?.toString()}
                  searchable
                  disabled={studentsLoading}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Mês/Ano"
                  placeholder="Selecione o mês"
                  name="month"
                  data={[
                    { value: "2024-01", label: "Janeiro 2024" },
                    { value: "2024-02", label: "Fevereiro 2024" },
                    { value: "2024-03", label: "Março 2024" },
                    { value: "2024-04", label: "Abril 2024" },
                    { value: "2024-05", label: "Maio 2024" },
                    { value: "2024-06", label: "Junho 2024" },
                  ]}
                  required
                  defaultValue={editingPayment?.month}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Valor (R$)"
                  placeholder="150.00"
                  name="amount"
                  decimalScale={2}
                  fixedDecimalScale
                  required
                  defaultValue={editingPayment?.amount}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  name="status"
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
                      name="paymentDate"
                      defaultValue={editingPayment?.paymentDate}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Forma de pagamento"
                      placeholder="Selecione a forma"
                      name="paymentMethod"
                      data={[
                        { value: "Pix", label: "PIX" },
                        { value: "CartaoCredito", label: "Cartão de Crédito" },
                        { value: "Dinheiro", label: "Dinheiro" },
                        { value: "Transferencia", label: "Transferência" },
                      ]}
                      defaultValue={editingPayment?.paymentMethod}
                    />
                  </Grid.Col>
                </>
              )}
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close} type="button">
                Cancelar
              </Button>
              <Button type="submit" loading={isOperationLoading}>
                {editingPayment ? "Salvar" : "Adicionar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
