"use client";

import { useState } from "react";
import { usePayments } from "@/hooks/useApiData";
import { Payment } from "@/services/api";

export default function AlunoPagamentosPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Usar a API real
  const { data: payments, loading, error } = usePayments();

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-orange-100 text-orange-800";
      case "Atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handlePayment = (paymentId: number) => {
    alert(`Redirecionando para pagamento da mensalidade ID: ${paymentId}`);
  };

  const totalPaid = payments
    .filter((p) => p.status === "Pago")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "Pendente")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "Pendente").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Erro ao carregar pagamentos: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Pagamentos</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe suas mensalidades e histórico de pagamentos
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Exportar Comprovantes
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-800">
            Você tem <strong>{pendingCount} mensalidade(s) pendente(s)</strong>{" "}
            no valor total de R$ {totalPending.toFixed(2)}. Clique em "Pagar"
            para regularizar sua situação.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalPaid.toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendente</p>
              <p className="text-2xl font-bold text-orange-600">
                R$ {totalPending.toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mensalidade</p>
              <p className="text-2xl font-bold text-blue-600">R$ 150,00</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos os status</option>
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
          <option value="Atrasado">Atrasado</option>
        </select>
        <span className="ml-4 text-sm text-gray-600">
          {filteredPayments.length} registro(s) encontrado(s)
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mês/Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forma de Pagamento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.month}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.status === "Pago"
                      ? payment.paymentMethod || "N/A"
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(payment)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver Detalhes
                    </button>
                    {payment.status === "Pendente" && (
                      <button
                        onClick={() => handlePayment(payment.id!)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Pagar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informações */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Informações sobre Pagamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Formas de Pagamento Aceitas:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PIX (desconto de 5%)</li>
              <li>• Cartão de Crédito</li>
              <li>• Cartão de Débito</li>
              <li>• Boleto Bancário</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Informações Importantes:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vencimento todo dia 5 do mês</li>
              <li>• Multa de 2% após o vencimento</li>
              <li>• Juros de 1% ao mês</li>
              <li>• Desconto de 5% para pagamento via PIX</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detalhes do Pagamento</h2>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Mês/Ano:</span>
                <p className="font-medium">{selectedPayment.month}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Valor:</span>
                <p className="font-medium">
                  R$ {selectedPayment.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}
                >
                  {selectedPayment.status}
                </span>
              </div>
              {selectedPayment.status === "Pago" && (
                <>
                  <div>
                    <span className="text-sm text-gray-600">
                      Data do Pagamento:
                    </span>
                    <p className="font-medium">
                      {selectedPayment.paymentDate
                        ? new Date(
                            selectedPayment.paymentDate,
                          ).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      Forma de Pagamento:
                    </span>
                    <p className="font-medium">
                      {selectedPayment.paymentMethod || "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
              {selectedPayment.status === "Pendente" && (
                <button
                  onClick={() => handlePayment(selectedPayment.id!)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Pagar Agora
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
