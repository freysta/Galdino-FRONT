import axios from "axios";

// Configuração base da API - Corrigida para usar a API real
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.warn("Token expirado. Faça login novamente.");
    }
    return Promise.reject(error);
  },
);

// ===== INTERFACES CORRIGIDAS PARA ALINHAR COM A API =====

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
  enrollmentDate?: string;
  status?: string;
  paymentStatus?: string;
  institution?: string;
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
  year?: number;
  status: "Pago" | "Pendente" | "Atrasado";
  paymentMethod?: "PIX" | "Cartão" | "Dinheiro" | "Transferência";
  paymentDate?: string;
  dueDate?: string;
}

export interface Route {
  id?: number;
  name?: string;
  date: string;
  destination: "Ida" | "Volta" | "Circular";
  departureTime: string;
  status: "Planejada" | "EmAndamento" | "Concluida" | "Cancelada";
  driverId: number;
  driverName?: string;
  createdAt?: string;
}

export interface Admin {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  accessLevel?: number;
  role?: string;
  status?: string;
  createdAt?: string;
}

export interface Attendance {
  id?: number;
  studentId: number;
  routeId: number;
  studentName?: string;
  routeName?: string;
  status: string;
  date: string;
  observation?: string;
  createdAt?: string;
}

export interface BoardingPoint {
  id?: number;
  name: string;
  address: string;
  neighborhood?: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status?: string;
  routes?: number;
  createdAt?: string;
}

export interface Notification {
  id?: number;
  title: string;
  message: string;
  type?: string;
  priority?: string;
  targetType?: string;
  targetIds?: number[];
  isRead?: boolean;
  readBy?: number[];
  createdAt?: string;
}

export interface RotaAluno {
  id?: number;
  fkIdRota: number;
  fkIdAluno: number;
  fkIdPonto?: number;
  confirmado: string;
  nomeAluno?: string;
  destinoRota?: string;
  nomePonto?: string;
}

// ===== INTERFACES DE AUTENTICAÇÃO =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    status: string;
  };
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  userId: number;
}

export interface ResetPasswordRequest {
  email: string;
}

// ===== INTERFACE PARA DASHBOARD =====
export interface DashboardStats {
  totalStudents: number;
  totalDrivers: number;
  totalRoutes: number;
  activeRoutes: number;
  pendingPayments: number;
  monthlyRevenue: number;
  lastUpdated: string;
}

// ===== SERVIÇOS CORRIGIDOS =====

// 🔐 Autenticação - CORRIGIDO
export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", {
      Email: data.email,
      Password: data.password,
    });
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  refreshToken: async (data: RefreshTokenRequest) => {
    const response = await api.post("/auth/refresh-token", data);
    return response.data;
  },
  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
};

// 🏢 Instituições - CORRIGIDO
export const institutionService = {
  getAll: async (nome?: string) => {
    const params = nome ? `?nome=${nome}` : "";
    const response = await api.get(`/instituicoes${params}`);
    return response.data.data || response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/instituicoes/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: Institution) => {
    const response = await api.post("/instituicoes", {
      Nome: data.nome,
      Cidade: data.cidade,
      Endereco: data.endereco,
      Telefone: data.telefone,
      Cep: data.cep,
    });
    return response.data.data || response.data;
  },
  update: async (id: number, data: Partial<Institution>) => {
    const response = await api.put(`/instituicoes/${id}`, {
      Nome: data.nome,
      Cidade: data.cidade,
      Endereco: data.endereco,
      Telefone: data.telefone,
      Cep: data.cep,
    });
    return response.data.data || response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/instituicoes/${id}`);
  },
};

// 🚌 Ônibus - CORRIGIDO
export const busService = {
  getAll: async (placa?: string, status?: string) => {
    const params = new URLSearchParams();
    if (placa) params.append("placa", placa);
    if (status) params.append("status", status);
    const response = await api.get(`/onibus?${params}`);
    return response.data.data || response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/onibus/${id}`);
    return response.data.data || response.data;
  },
  getByPlaca: async (placa: string) => {
    const response = await api.get(`/onibus/placa/${placa}`);
    return response.data.data || response.data;
  },
  create: async (data: Bus) => {
    const response = await api.post("/onibus", {
      Placa: data.placa,
      Modelo: data.modelo,
      Capacidade: data.capacidade,
      Ano: data.ano,
      Status: data.status,
    });
    return response.data.data || response.data;
  },
  update: async (id: number, data: Partial<Bus>) => {
    const response = await api.put(`/onibus/${id}`, {
      Placa: data.placa,
      Modelo: data.modelo,
      Capacidade: data.capacidade,
      Ano: data.ano,
      Status: data.status,
    });
    return response.data.data || response.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/onibus/${id}/status`, {
      Status: status,
    });
    return response.data.data || response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/onibus/${id}`);
  },
};

// 👥 Alunos - CORRIGIDO
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
    const response = await api.post("/students", {
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Cpf: data.cpf,
      Address: data.address,
      City: data.city,
      Course: data.course,
      Shift: data.shift,
      Route: data.route,
      EnrollmentDate: data.enrollmentDate,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, {
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Cpf: data.cpf,
      Address: data.address,
      City: data.city,
      Course: data.course,
      Shift: data.shift,
      Status: data.status,
    });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/students/${id}`);
  },
};

// 🚗 Motoristas - CORRIGIDO
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
    const response = await api.post("/drivers", {
      Name: data.name,
      Email: data.email,
      Password: data.password,
      Phone: data.phone,
      Cpf: data.cpf,
      Cnh: data.cnh,
      Vehicle: data.vehicle,
      LicenseExpiry: data.licenseExpiry,
      BirthDate: data.birthDate,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<Driver>) => {
    const response = await api.put(`/drivers/${id}`, {
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Cpf: data.cpf,
      Cnh: data.cnh,
      Vehicle: data.vehicle,
      LicenseExpiry: data.licenseExpiry,
      BirthDate: data.birthDate,
    });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/drivers/${id}`);
  },
};

// 💰 Pagamentos - CORRIGIDO
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
    const response = await api.post("/payments", {
      studentId: data.studentId,
      amount: data.amount,
      month: data.month,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<Payment>) => {
    const response = await api.put(`/payments/${id}`, {
      amount: data.amount,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
    });
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

// 🛣️ Rotas - CORRIGIDO
export const routeService = {
  getAll: async (status?: string) => {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(`/routes${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/routes/${id}`);
    return response.data.data || response.data;
  },
  create: async (data: Route) => {
    const response = await api.post("/routes", {
      Date: data.date,
      Destination: data.destination,
      DepartureTime: data.departureTime,
      Status: data.status,
      DriverId: data.driverId,
    });
    return response.data.data || response.data;
  },
  update: async (id: number, data: Partial<Route>) => {
    const response = await api.put(`/routes/${id}`, {
      Date: data.date,
      Destination: data.destination,
      DepartureTime: data.departureTime,
      Status: data.status,
      DriverId: data.driverId,
    });
    return response.data.data || response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/routes/${id}`);
  },
};

// 👨‍💼 Admin - CORRIGIDO
export const adminService = {
  getAll: async () => {
    const response = await api.get("/admin/admins");
    return response.data;
  },
  create: async (data: Admin) => {
    const response = await api.post("/admin/create-admin", {
      Name: data.name,
      Email: data.email,
      Password: data.password,
      Phone: data.phone,
      AccessLevel: data.accessLevel,
    });
    return response.data;
  },
  createFirst: async (data: Admin) => {
    const response = await api.post("/admin/create-first-admin", {
      Name: data.name,
      Email: data.email,
      Password: data.password,
      Phone: data.phone,
      AccessLevel: data.accessLevel,
    });
    return response.data;
  },
};

// 📊 Dashboard - CORRIGIDO
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data.data || response.data;
  },
};

// ✅ Presença - CORRIGIDO (Rota corrigida)
export const attendanceService = {
  getAll: async (studentId?: number, routeId?: number) => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId.toString());
    if (routeId) params.append("routeId", routeId.toString());
    const response = await api.get(`/attendance?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },
  create: async (data: Attendance) => {
    const response = await api.post("/attendance", {
      routeId: data.routeId,
      studentId: data.studentId,
      status: data.status,
      observation: data.observation,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<Attendance>) => {
    const response = await api.put(`/attendance/${id}`, {
      status: data.status,
      observation: data.observation,
    });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/attendance/${id}`);
  },
  getStudentSummary: async (studentId: number) => {
    const response = await api.get(`/attendance/student/${studentId}/summary`);
    return response.data;
  },
};

// 📍 Pontos de Embarque - CORRIGIDO
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
    const response = await api.post("/boarding-points", {
      name: data.name,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      coordinates: data.coordinates,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<BoardingPoint>) => {
    const response = await api.put(`/boarding-points/${id}`, {
      name: data.name,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      coordinates: data.coordinates,
    });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/boarding-points/${id}`);
  },
};

// 🔔 Notificações - CORRIGIDO
export const notificationService = {
  getAll: async (type?: string, targetId?: number) => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (targetId) params.append("targetId", targetId.toString());
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },
  create: async (data: Notification) => {
    const response = await api.post("/notifications", {
      title: data.title,
      message: data.message,
      type: data.type,
      targetIds: data.targetIds,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<Notification>) => {
    const response = await api.put(`/notifications/${id}`, {
      title: data.title,
      message: data.message,
      type: data.type,
    });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/notifications/${id}`);
  },
  markAsRead: async (id: number) => {
    const response = await api.post(`/notifications/${id}/mark-read`);
    return response.data;
  },
};

// 🔗 Rota-Aluno - CORRIGIDO (Rota corrigida)
export const rotaAlunoService = {
  getAll: async () => {
    const response = await api.get("/rotaaluno");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/rotaaluno/${id}`);
    return response.data;
  },
  getByRoute: async (rotaId: number) => {
    const response = await api.get(`/rotaaluno/rota/${rotaId}`);
    return response.data;
  },
  getByStudent: async (alunoId: number) => {
    const response = await api.get(`/rotaaluno/aluno/${alunoId}`);
    return response.data;
  },
  create: async (data: RotaAluno) => {
    const response = await api.post("/rotaaluno", {
      FkIdRota: data.fkIdRota,
      FkIdAluno: data.fkIdAluno,
      FkIdPonto: data.fkIdPonto,
      Confirmado: data.confirmado,
    });
    return response.data;
  },
  update: async (id: number, data: Partial<RotaAluno>) => {
    const response = await api.put(`/rotaaluno/${id}`, {
      FkIdRota: data.fkIdRota,
      FkIdAluno: data.fkIdAluno,
      FkIdPonto: data.fkIdPonto,
      Confirmado: data.confirmado,
    });
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/rotaaluno/${id}`);
  },
  confirm: async (id: number) => {
    const response = await api.patch(`/rotaaluno/${id}/confirmar`);
    return response.data;
  },
  cancel: async (id: number) => {
    const response = await api.patch(`/rotaaluno/${id}/cancelar`);
    return response.data;
  },
};

// Exportar tipos e enums
export type BusStatus = "Ativo" | "Manutenção" | "Inativo";
export type RouteStatus =
  | "Planejada"
  | "EmAndamento"
  | "Concluida"
  | "Cancelada";
export type PaymentStatus = "Pago" | "Pendente" | "Atrasado";
export type StudentShift = "Manha" | "Tarde" | "Noite" | "Integral";

export default api;
