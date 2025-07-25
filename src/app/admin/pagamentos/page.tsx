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

  // Garantir que payments é um array e ordenar por data de criação (mais recentes primeiro)
  const paymentsArray = Array.isArray(payments)
    ? [...payments].sort((a, b) => {
        // Ordenar por ID decrescente (assumindo que IDs maiores = mais recentes)
        // ou por data de criação se disponível
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return (b.id || 0) - (a.id || 0);
      })
    : [];

  // Função para buscar nome do aluno pelo ID
  const getStudentName = (studentId: number) => {
    const student = studentsArray.find((s: Student) => s.id === studentId);
    return student?.name || `Aluno #${studentId}`;
  };

  // Mapeamento de status - corrigido para lidar com diferentes formatos da API
  const getStatusInfo = (status: string | number) => {
    // Converter para string e normalizar
    const statusStr = String(status).toLowerCase().trim();

    // Mapear diferentes variações de status
    switch (statusStr) {
      case "pago":
      case "paid":
      case "2":
        return {
          name: "Pago",
          color: "green",
          icon: <IconCheck size="0.8rem" />,
        };
      case "pendente":
      case "pending":
      case "1":
        return {
          name: "Pendente",
          color: "yellow",
          icon: <IconClock size="0.8rem" />,
        };
      case "atrasado":
      case "overdue":
      case "late":
      case "3":
        return {
          name: "Atrasado",
          color: "red",
          icon: <IconX size="0.8rem" />,
        };
      case "cancelado":
      case "cancelled":
      case "4":
        return {
          name: "Cancelado",
          color: "gray",
          icon: <IconX size="0.8rem" />,
        };
      case "não informado":
      case "nao informado":
      case "not informed":
      case "":
      case "null":
      case "undefined":
      case "0":
        return {
          name: "Não informado",
          color: "gray",
          icon: <IconAlertCircle size="0.8rem" />,
        };
      default:
        // Log para debug - ver o que está vindo da API
        console.log("Status não reconhecido:", status, typeof status);
        return {
          name: status ? String(status) : "Não informado",
          color: "gray",
          icon: <IconAlertCircle size="0.8rem" />,
        };
    }
  };

  const getStatusColor = (status: string | number) => {
    return getStatusInfo(status).color;
  };

  const getStatusLabel = (status: string | number) => {
    return getStatusInfo(status).name;
  };

  const getStatusIcon = (status: string | number) => {
    return getStatusInfo(status).icon;
  };

  const filteredPayments = paymentsArray.filter((payment: Payment) => {
    const studentName = payment.studentId
      ? getStudentName(payment.studentId)
      : "";
    const matchesSearch =
      !searchTerm ||
      payment.studentId?.toString().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id?.toString().includes(searchTerm.toLowerCase());
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
        paymentMethod: "Pix",
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
      // Mapear paymentMethod para os tipos corretos da interface Payment
      const mapPaymentMethod = (
        method: string | null,
      ): "Dinheiro" | "CartaoCredito" | "Pix" | "Transferencia" | undefined => {
        if (!method) return undefined;

        switch (method) {
          case "PIX":
          case "Pix":
            return "Pix";
          case "Cartão":
          case "CartaoCredito":
            return "CartaoCredito";
          case "Dinheiro":
            return "Dinheiro";
          case "Transferência":
          case "Transferencia":
            return "Transferencia";
          default:
            return "Dinheiro"; // valor padrão
        }
      };

      // Mapear status para os tipos corretos da interface Payment
      const mapStatus = (
        status: string | null,
      ): "Pago" | "Pendente" | "Atrasado" => {
        switch (status) {
          case "Pago":
            return "Pago";
          case "Pendente":
            return "Pendente";
          case "Atrasado":
            return "Atrasado";
          default:
            return "Pendente";
        }
      };

      // Validação de data - garantir que não seja futura
      const validateDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Final do dia atual

        if (date > today) {
          // Se a data for futura, usar a data atual
          return new Date().toISOString();
        }
        return dateStr;
      };

      if (editingPayment?.id) {
        // Para UPDATE, enviar apenas os campos que podem ser alterados
        const updateData: Partial<Payment> = {
          amount: parseFloat(formData.get("amount") as string),
          status: mapStatus(formData.get("status") as string),
          paymentMethod: mapPaymentMethod(
            formData.get("paymentMethod") as string,
          ),
          // Adicionar paymentDate se o status for "Pago"
          ...(formData.get("status") === "Pago" && {
            paymentDate: validateDate(new Date().toISOString()),
          }),
        };

        console.log("Dados de UPDATE:", updateData);

        await updateMutation.mutateAsync({
          id: editingPayment.id,
          data: updateData,
        });
        notifications.show({
          title: "Sucesso",
          message: "Pagamento atualizado com sucesso!",
          color: "green",
        });
      } else {
        // Para CREATE, enviar todos os campos obrigatórios
        const createData: Omit<Payment, "id" | "createdAt"> = {
          studentId: parseInt(formData.get("studentId") as string),
          amount: parseFloat(formData.get("amount") as string),
          month: formData.get("month") as string,
          status: mapStatus(formData.get("status") as string),
          paymentMethod: mapPaymentMethod(
            formData.get("paymentMethod") as string,
          ),
        };

        console.log("Dados de CREATE:", createData);

        await createMutation.mutateAsync(createData);
        notifications.show({
          title: "Sucesso",
          message: "Cobrança criada com sucesso!",
          color: "green",
        });
      }
      close();
      setEditingPayment(null);
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error);
      notifications.show({
        title: "Erro",
        message:
          "Erro ao salvar pagamento. Verifique os dados e tente novamente.",
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
                { value: "Não informado", label: "Não informado" },
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
                { value: "01/2024", label: "Janeiro 2024" },
                { value: "02/2024", label: "Fevereiro 2024" },
                { value: "03/2024", label: "Março 2024" },
                { value: "04/2024", label: "Abril 2024" },
                { value: "05/2024", label: "Maio 2024" },
                { value: "06/2024", label: "Junho 2024" },
                { value: "07/2024", label: "Julho 2024" },
                { value: "08/2024", label: "Agosto 2024" },
                { value: "09/2024", label: "Setembro 2024" },
                { value: "10/2024", label: "Outubro 2024" },
                { value: "11/2024", label: "Novembro 2024" },
                { value: "12/2024", label: "Dezembro 2024" },
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
                <Table.Th>Status</Table.Th>
                <Table.Th>Método</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment: Payment) => (
                  <Table.Tr key={payment.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500} size="sm">
                          {payment.studentId
                            ? getStudentName(payment.studentId)
                            : "Aluno não identificado"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Matrícula: {payment.studentId || "N/A"}
                        </Text>
                        {studentsArray.find((s) => s.id === payment.studentId)
                          ?.course && (
                          <Text size="xs" c="blue" mt="xs">
                            {
                              studentsArray.find(
                                (s) => s.id === payment.studentId,
                              )?.course
                            }
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {payment.monthLabel ||
                            payment.month ||
                            "Mês não informado"}
                        </Text>
                        {payment.year && (
                          <Text size="xs" c="dimmed">
                            Ano: {payment.year}
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text
                          size="sm"
                          fw={700}
                          c={
                            getStatusLabel(payment.status) === "Pago"
                              ? "green"
                              : "dark"
                          }
                        >
                          R$ {(payment.amount || 0).toFixed(2)}
                        </Text>
                        {getStatusLabel(payment.status) === "Atrasado" && (
                          <Text size="xs" c="red">
                            + juros aplicáveis
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(payment.status)}
                        variant="light"
                        leftSection={getStatusIcon(payment.status)}
                        size="md"
                      >
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text
                          size="sm"
                          fw={
                            getStatusLabel(payment.status) === "Pago"
                              ? 500
                              : 400
                          }
                        >
                          {/* Mapear métodos de pagamento conforme enum do BD */}
                          {(() => {
                            const method = payment.paymentMethod;
                            if (!method) return "Não informado";

                            const methodStr = String(method).trim();
                            switch (methodStr) {
                              case "Pix":
                              case "PIX":
                              case "pix":
                                return "PIX";
                              case "CartaoCredito":
                              case "Cartão":
                              case "cartão":
                                return "Cartão";
                              case "Dinheiro":
                              case "dinheiro":
                                return "Dinheiro";
                              case "Transferencia":
                              case "Transferência":
                              case "transferência":
                                return "Transferência";
                              default:
                                return String(method);
                            }
                          })()}
                        </Text>
                        {payment.paymentDate && (
                          <Text size="xs" c="dimmed">
                            Pago em:{" "}
                            {new Date(payment.paymentDate).toLocaleDateString(
                              "pt-BR",
                            )}
                          </Text>
                        )}
                        {getStatusLabel(payment.status) === "Pago" &&
                          !payment.paymentDate && (
                            <Text size="xs" c="dimmed">
                              Data não informada
                            </Text>
                          )}
                      </div>
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
                          {getStatusLabel(payment.status) !== "Pago" && (
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
                  <Table.Td colSpan={6} style={{ textAlign: "center" }}>
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
                    { value: "01/2024", label: "Janeiro 2024" },
                    { value: "02/2024", label: "Fevereiro 2024" },
                    { value: "03/2024", label: "Março 2024" },
                    { value: "04/2024", label: "Abril 2024" },
                    { value: "05/2024", label: "Maio 2024" },
                    { value: "06/2024", label: "Junho 2024" },
                    { value: "07/2024", label: "Julho 2024" },
                    { value: "08/2024", label: "Agosto 2024" },
                    { value: "09/2024", label: "Setembro 2024" },
                    { value: "10/2024", label: "Outubro 2024" },
                    { value: "11/2024", label: "Novembro 2024" },
                    { value: "12/2024", label: "Dezembro 2024" },
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
                  min={0}
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
                  defaultValue={editingPayment?.status?.toString()}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Forma de pagamento"
                  placeholder="Selecione a forma"
                  name="paymentMethod"
                  data={[
                    { value: "Pix", label: "PIX" },
                    { value: "CartaoCredito", label: "Cartão" },
                    { value: "Dinheiro", label: "Dinheiro" },
                    { value: "Transferencia", label: "Transferência" },
                  ]}
                  defaultValue={editingPayment?.paymentMethod}
                />
              </Grid.Col>
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
