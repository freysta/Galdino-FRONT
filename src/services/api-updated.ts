import axios from "axios";

// Configuração base da API
const API_BASE_URL = "http://localhost:5064/api";

// Criar instância do axios
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
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// ===== INTERFACES ATUALIZADAS =====
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  message: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  city: string;
  course: string;
  shift: string;
  institution: string;
  paymentStatus: string;
  route?: number | null;
  enrollmentDate?: string;
  status: string;
  createdAt?: string;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cnh: string;
  licenseExpiry: string;
  birthDate: string;
  status: string;
  createdAt?: string;
}

export interface Admin {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  accessLevel: number;
}

export interface Route {
  id: number;
  date: string;
  destination: string;
  departureTime: string;
  status: string;
  driverId: number;
  driverName?: string;
  createdAt?: string;
}

export interface Payment {
  id: number;
  studentId: number;
  studentName?: string;
  amount: number;
  month: string;
  year?: number;
  status: string;
  paymentMethod?: string;
  paymentDate?: string;
  dueDate?: string;
  createdAt?: string;
}

export interface Attendance {
  id?: number;
  routeId: number;
  studentId: number;
  studentName?: string;
  routeName?: string;
  status: string;
  observation?: string;
  date: string;
  createdAt?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface BoardingPoint {
  id: number;
  name: string;
  address: string;
  type: BoardingPointType;
  coordinates?: string | { lat: number; lng: number };
  createdAt?: string;
}

// Interface atualizada para Instituições conforme backend
export interface Institution {
  id: number;
  nome: string;
  cidade: string;
  endereco?: string;
  telefone?: string;
  cep?: string;
  createdAt?: string;
}

// Interface para request de Instituições
export interface InstitutionRequest {
  nome: string;
  cidade: string;
  endereco?: string;
  telefone?: string;
  cep?: string;
}

// Interface atualizada para Ônibus conforme backend
export interface Bus {
  id: number;
  placa: string;
  modelo: string;
  capacidade: number;
  ano: number;
  status: BusStatus;
  createdAt?: string;
}

// Interface para request de Ônibus
export interface BusRequest {
  placa: string;
  modelo: string;
  capacidade: number;
  ano: number;
  status?: BusStatus;
}

// Interface para atualização de status do ônibus
export interface BusStatusRequest {
  status: BusStatus;
}

export interface Emergency {
  id: number;
  type: EmergencyType;
  description: string;
  location: string;
  routeId: number;
  driverId: number;
  status: EmergencyStatus;
  reportedAt: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalDrivers: number;
  totalRoutes: number;
  pendingPayments: number;
  monthlyRevenue: number;
  activeRoutes: number;
}

// ===== SERVIÇOS DA API ATUALIZADOS =====

// Autenticação
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string, userId: number): Promise<any> => {
    const response = await api.post("/auth/refresh-token", {
      refreshToken,
      userId,
    });
    return response.data;
  },

  resetPassword: async (email: string): Promise<any> => {
    const response = await api.post("/auth/reset-password", { email });
    return response.data;
  },
};

// Alunos
export const studentService = {
  getAll: async (status?: string, route?: number): Promise<Student[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (route) params.append("route", route.toString());
    const response = await api.get(`/students?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (
    student: Omit<Student, "id" | "createdAt" | "status">,
  ): Promise<Student> => {
    const response = await api.post("/students", student);
    return response.data;
  },

  update: async (id: number, student: Partial<Student>): Promise<Student> => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};

// Motoristas
export const driverService = {
  getAll: async (): Promise<{ data: Driver[]; message: string }> => {
    const response = await api.get("/drivers");
    return response.data;
  },

  getById: async (id: number): Promise<Driver> => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },

  create: async (driver: any): Promise<Driver> => {
    const response = await api.post("/drivers", driver);
    return response.data;
  },

  update: async (id: number, driver: Partial<Driver>): Promise<Driver> => {
    const response = await api.put(`/drivers/${id}`, driver);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },
};

// Gestores/Admin
export const adminService = {
  getAll: async (): Promise<Admin[]> => {
    const response = await api.get("/admin/admins");
    return response.data;
  },

  create: async (admin: Admin): Promise<Admin> => {
    const response = await api.post("/admin/create-admin", admin);
    return response.data;
  },

  createFirst: async (admin: Admin): Promise<Admin> => {
    const response = await api.post("/admin/create-first-admin", admin);
    return response.data;
  },
};

// Rotas
export const routeService = {
  getAll: async (
    status?: string,
  ): Promise<{ data: Route[]; message: string }> => {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(`/routes${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<Route> => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  create: async (route: any): Promise<Route> => {
    const response = await api.post("/routes", route);
    return response.data;
  },

  update: async (id: number, route: Partial<Route>): Promise<Route> => {
    const response = await api.put(`/routes/${id}`, route);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/routes/${id}`);
  },
};

// Pagamentos
export const paymentService = {
  getAll: async (
    studentId?: number,
    status?: string,
    month?: string,
  ): Promise<{ data: Payment[]; message: string }> => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId.toString());
    if (status) params.append("status", status);
    if (month) params.append("month", month);
    const response = await api.get(`/payments?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<{ data: Payment; message: string }> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  create: async (payment: any): Promise<{ data: Payment; message: string }> => {
    const response = await api.post("/payments", payment);
    return response.data;
  },

  update: async (
    id: number,
    payment: Partial<Payment>,
  ): Promise<{ data: Payment; message: string }> => {
    const response = await api.put(`/payments/${id}`, payment);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },

  confirm: async (id: number, paymentMethod: string): Promise<any> => {
    const response = await api.post(`/payments/${id}/confirm`, {
      paymentMethod,
    });
    return response.data;
  },
};

// Presença
export const attendanceService = {
  getAll: async (
    studentId?: number,
    routeId?: number,
  ): Promise<Attendance[]> => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId.toString());
    if (routeId) params.append("routeId", routeId.toString());
    const response = await api.get(`/attendance?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<Attendance> => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },

  create: async (attendance: any): Promise<Attendance> => {
    const response = await api.post("/attendance", attendance);
    return response.data;
  },

  update: async (
    id: number,
    attendance: Partial<Attendance>,
  ): Promise<Attendance> => {
    const response = await api.put(`/attendance/${id}`, attendance);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}`);
  },

  getStudentSummary: async (studentId: number): Promise<any> => {
    const response = await api.get(`/attendance/student/${studentId}/summary`);
    return response.data;
  },
};

// Notificações
export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get("/notifications");
    return response.data;
  },

  create: async (notification: any): Promise<Notification> => {
    const response = await api.post("/notifications", notification);
    return response.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },
};

// Pontos de Embarque
export const boardingPointService = {
  getAll: async (): Promise<BoardingPoint[]> => {
    const response = await api.get("/boarding-points");
    return response.data;
  },

  create: async (point: any): Promise<BoardingPoint> => {
    const response = await api.post("/boarding-points", point);
    return response.data;
  },

  update: async (
    id: number,
    point: Partial<BoardingPoint>,
  ): Promise<BoardingPoint> => {
    const response = await api.put(`/boarding-points/${id}`, point);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/boarding-points/${id}`);
  },
};

// Instituições - ATUALIZADO conforme backend
export const institutionService = {
  getAll: async (
    nome?: string,
  ): Promise<{ data: Institution[]; message: string }> => {
    const params = nome ? `?nome=${encodeURIComponent(nome)}` : "";
    const response = await api.get(`/instituicoes${params}`);
    return response.data;
  },

  getById: async (
    id: number,
  ): Promise<{ data: Institution; message: string }> => {
    const response = await api.get(`/instituicoes/${id}`);
    return response.data;
  },

  create: async (
    institution: InstitutionRequest,
  ): Promise<{ data: Institution; message: string }> => {
    const response = await api.post("/instituicoes", institution);
    return response.data;
  },

  update: async (
    id: number,
    institution: Partial<InstitutionRequest>,
  ): Promise<{ data: Institution; message: string }> => {
    const response = await api.put(`/instituicoes/${id}`, institution);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/instituicoes/${id}`);
  },
};

// Ônibus - ATUALIZADO conforme backend
export const busService = {
  getAll: async (
    placa?: string,
    status?: BusStatus,
  ): Promise<{ data: Bus[]; message: string }> => {
    const params = new URLSearchParams();
    if (placa) params.append("placa", placa);
    if (status) params.append("status", status);
    const queryString = params.toString();
    const response = await api.get(
      `/onibus${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  },

  getById: async (id: number): Promise<{ data: Bus; message: string }> => {
    const response = await api.get(`/onibus/${id}`);
    return response.data;
  },

  getByPlaca: async (
    placa: string,
  ): Promise<{ data: Bus; message: string }> => {
    const response = await api.get(`/onibus/placa/${placa}`);
    return response.data;
  },

  create: async (bus: BusRequest): Promise<{ data: Bus; message: string }> => {
    const response = await api.post("/onibus", bus);
    return response.data;
  },

  update: async (
    id: number,
    bus: Partial<BusRequest>,
  ): Promise<{ data: Bus; message: string }> => {
    const response = await api.put(`/onibus/${id}`, bus);
    return response.data;
  },

  updateStatus: async (
    id: number,
    statusRequest: BusStatusRequest,
  ): Promise<{ data: Bus; message: string }> => {
    const response = await api.patch(`/onibus/${id}/status`, statusRequest);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/onibus/${id}`);
  },
};

// Dashboard
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};

// Emergências
export const emergencyService = {
  getAll: async (): Promise<Emergency[]> => {
    const response = await api.get("/emergencies");
    return response.data;
  },

  getById: async (id: number): Promise<Emergency> => {
    const response = await api.get(`/emergencies/${id}`);
    return response.data;
  },

  create: async (
    emergency: Omit<Emergency, "id" | "createdAt" | "updatedAt">,
  ): Promise<Emergency> => {
    const response = await api.post("/emergencies", emergency);
    return response.data;
  },

  update: async (
    id: number,
    emergency: Partial<Emergency>,
  ): Promise<Emergency> => {
    const response = await api.put(`/emergencies/${id}`, emergency);
    return response.data;
  },

  resolve: async (id: number): Promise<Emergency> => {
    const response = await api.post(`/emergencies/${id}/resolve`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/emergencies/${id}`);
  },
};

// ===== ENUMS =====
export enum PaymentStatus {
  Pendente = "Pendente",
  Pago = "Pago",
  Atrasado = "Atrasado",
  Cancelado = "Cancelado",
}

export enum PaymentMethod {
  Dinheiro = "Dinheiro",
  Cartao = "Cartao",
  Pix = "Pix",
  Transferencia = "Transferencia",
}

export enum Shift {
  Manha = "Manha",
  Tarde = "Tarde",
  Noite = "Noite",
  Integral = "Integral",
}

export enum RouteStatus {
  Planejada = "Planejada",
  Ativa = "Ativa",
  Concluida = "Concluida",
  Cancelada = "Cancelada",
}

export enum RouteType {
  Ida = "Ida",
  Volta = "Volta",
  IdaVolta = "IdaVolta",
}

export enum BusStatus {
  Ativo = "Ativo",
  Manutencao = "Manutenção",
  Inativo = "Inativo",
}

export enum EmergencyType {
  Acidente = "Acidente",
  Pane = "Pane",
  ProblemaMedico = "Problema Médico",
  Outros = "Outros",
}

export enum EmergencyStatus {
  Aberta = "Aberta",
  EmAtendimento = "Em Atendimento",
  Resolvida = "Resolvida",
  Cancelada = "Cancelada",
}

export enum BoardingPointType {
  Embarque = "Embarque",
  Desembarque = "Desembarque",
  Ambos = "Ambos",
}

// ===== FUNÇÕES UTILITÁRIAS =====
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export { api };
export default api;
