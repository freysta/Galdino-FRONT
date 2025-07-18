import axios from "axios";

// Configuração base da API - Atualizada para usar a API real
const API_BASE_URL = "http://localhost:5064/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Não redirecionar automaticamente para evitar loops
      console.warn("Token expirado. Faça login novamente.");
    }
    return Promise.reject(error);
  },
);

// ===== INTERFACES SIMPLES =====
export interface Institution {
  id?: number;
  nome: string;
  cidade: string;
  endereco?: string;
  telefone?: string;
  cep?: string;
}

export interface Bus {
  id?: number;
  placa: string;
  modelo: string;
  capacidade: number;
  ano: number;
  status: "Ativo" | "Manutenção" | "Inativo";
}

export interface Student {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  address?: string;
  city?: string;
  course?: string;
  shift?: "Manha" | "Tarde" | "Noite" | "Integral";
  route?: string;
}

export interface Driver {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  cpf?: string;
  cnh?: string;
  vehicle?: string;
  licenseExpiry?: string;
  birthDate?: string;
  status?: string;
  createdAt?: string;
}

export interface Payment {
  id?: number;
  studentId: number;
  studentName?: string;
  amount: number;
  month: string;
  monthLabel?: string;
  status: "Pago" | "Pendente" | "Atrasado";
  paymentMethod?: "PIX" | "Cartão" | "Dinheiro" | "Transferência";
  paymentDate?: string;
  dueDate?: string;
  route?: string;
}

export interface Route {
  id?: number;
  name?: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
  date?: string;
  time?: string;
  driver?: string;
  vehicle?: string;
  capacity?: number;
  enrolled?: number;
  price?: number;
  boardingPoints?: string[];
}

export interface Admin {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  accessLevel?: number;
}

export interface Attendance {
  id?: number;
  studentId: number;
  routeId: number;
  status: string;
  date: string;
  observation?: string;
}

export interface BoardingPoint {
  id?: number;
  name: string;
  address: string;
  type: string;
  city?: string;
  street?: string;
  neighborhood?: string;
  reference?: string;
  status?: string;
  routes?: string[];
  capacity?: number;
}

export interface Notification {
  id?: number;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  recipient?: string;
  recipientLabel?: string;
  status?: string;
  createdAt?: string;
  sentAt?: string;
  readCount?: number;
  totalRecipients?: number;
}

export interface Emergency {
  id?: number;
  type: string;
  description: string;
  location: string;
  status: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface RotaAluno {
  id?: number;
  studentId: number;
  routeId: number;
  status: string;
}

// ===== TYPES E ENUMS =====
export type BusStatus = "Ativo" | "Manutenção" | "Inativo";
export type InstitutionRequest = Institution;
export type BusRequest = Bus;
export type BusStatusRequest = { status: BusStatus };

// ===== SERVIÇOS SIMPLES E FUNCIONAIS =====

// 🏢 Instituições
export const institutionService = {
  getAll: async (nome?: string) => {
    const params = nome ? `?nome=${nome}` : "";
    const response = await api.get(`/instituicoes${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/instituicoes/${id}`);
    return response.data;
  },
  create: async (data: Institution) => {
    const response = await api.post("/instituicoes", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Institution>) => {
    const response = await api.put(`/instituicoes/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/instituicoes/${id}`);
  },
};

// 🚌 Ônibus
export const busService = {
  getAll: async (placa?: string, status?: string) => {
    const params = new URLSearchParams();
    if (placa) params.append("placa", placa);
    if (status) params.append("status", status);
    const response = await api.get(`/onibus?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/onibus/${id}`);
    return response.data;
  },
  getByPlaca: async (placa: string) => {
    const response = await api.get(`/onibus/placa/${placa}`);
    return response.data;
  },
  create: async (data: Bus) => {
    const response = await api.post("/onibus", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Bus>) => {
    const response = await api.put(`/onibus/${id}`, data);
    return response.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/onibus/${id}/status`, { status });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/onibus/${id}`);
  },
};

// 👥 Alunos
export const studentService = {
  getAll: async (status?: string, route?: number) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (route) params.append("route", route.toString());
    const response = await api.get(`/students?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (data: Student) => {
    const response = await api.post("/students", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/students/${id}`);
  },
};

// 🚗 Motoristas
export const driverService = {
  getAll: async () => {
    const response = await api.get("/drivers");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },
  create: async (data: Driver) => {
    const response = await api.post("/drivers", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Driver>) => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/drivers/${id}`);
  },
};

// 💰 Pagamentos
export const paymentService = {
  getAll: async (studentId?: number, status?: string, month?: string) => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId.toString());
    if (status) params.append("status", status);
    if (month) params.append("month", month);
    const response = await api.get(`/payments?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  create: async (data: Payment) => {
    const response = await api.post("/payments", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Payment>) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/payments/${id}`);
  },
  confirm: async (id: number, paymentMethod: string) => {
    const response = await api.post(`/payments/${id}/confirm`, {
      paymentMethod,
    });
    return response.data;
  },
};

// 🛣️ Rotas
export const routeService = {
  getAll: async () => {
    const response = await api.get("/routes");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },
  create: async (data: Route) => {
    const response = await api.post("/routes", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Route>) => {
    const response = await api.put(`/routes/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/routes/${id}`);
  },
};

// 👨‍💼 Admin
export const adminService = {
  getAll: async () => {
    const response = await api.get("/admin/admins");
    return response.data;
  },
  create: async (data: Admin) => {
    const response = await api.post("/admin/create-admin", data);
    return response.data;
  },
  createFirst: async (data: Admin) => {
    const response = await api.post("/admin/create-first-admin", data);
    return response.data;
  },
};

// Interface para estatísticas do dashboard
export interface DashboardStats {
  totalStudents: number;
  totalDrivers: number;
  totalRoutes: number;
  totalPayments: number;
  pendingPayments: number;
  totalRevenue: number;
}

// 📊 Dashboard
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/dashboard/${id}`);
    return response.data;
  },
};

// ✅ Presença
export const attendanceService = {
  getAll: async (studentId?: number, routeId?: number) => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId.toString());
    if (routeId) params.append("routeId", routeId.toString());
    const response = await api.get(`/auth?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/auth/${id}`);
    return response.data;
  },
  create: async (data: Attendance) => {
    const response = await api.post("/auth", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Attendance>) => {
    const response = await api.put(`/auth/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/auth/${id}`);
  },
  getStudentSummary: async (studentId: number) => {
    const response = await api.get(`/auth/student/${studentId}/summary`);
    return response.data;
  },
};

// 📍 Pontos de Embarque
export const boardingPointService = {
  getAll: async () => {
    const response = await api.get("/boarding-points");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/boarding-points/${id}`);
    return response.data;
  },
  create: async (data: BoardingPoint) => {
    const response = await api.post("/boarding-points", data);
    return response.data;
  },
  update: async (id: number, data: Partial<BoardingPoint>) => {
    const response = await api.put(`/boarding-points/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/boarding-points/${id}`);
  },
};

// 🔔 Notificações
export const notificationService = {
  getAll: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },
  create: async (data: Notification) => {
    const response = await api.post("/notifications", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Notification>) => {
    const response = await api.put(`/notifications/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/notifications/${id}`);
  },
  markAsRead: async (id: number) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
};

// 🔗 Rota-Aluno
export const rotaAlunoService = {
  getAll: async () => {
    const response = await api.get("/rota-aluno");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/rota-aluno/${id}`);
    return response.data;
  },
  create: async (data: RotaAluno) => {
    const response = await api.post("/rota-aluno", data);
    return response.data;
  },
  update: async (id: number, data: Partial<RotaAluno>) => {
    const response = await api.put(`/rota-aluno/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/rota-aluno/${id}`);
  },
};

// 🚨 Emergências
export const emergencyService = {
  getAll: async () => {
    const response = await api.get("/emergencies");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/emergencies/${id}`);
    return response.data;
  },
  create: async (data: Emergency) => {
    const response = await api.post("/emergencies", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Emergency>) => {
    const response = await api.put(`/emergencies/${id}`, data);
    return response.data;
  },
  resolve: async (id: number) => {
    const response = await api.post(`/emergencies/${id}/resolve`);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/emergencies/${id}`);
  },
};

export default api;
