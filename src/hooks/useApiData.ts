"use client";

import { useState, useEffect } from "react";
import {
  institutionService,
  busService,
  studentService,
  driverService,
  paymentService,
  routeService,
  adminService,
  dashboardService,
  attendanceService,
  boardingPointService,
  notificationService,
  rotaAlunoService,
  emergencyService,
  Institution,
  Bus,
  Student,
  Driver,
  Payment,
  Route,
  Admin,
  Attendance,
  BoardingPoint,
  Notification,
  Emergency,
  RotaAluno,
} from "@/services/api";

// Hook genérico para usar qualquer serviço da API
export function useApiData<T>(
  serviceFn: () => Promise<any>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceFn();
      // Se a resposta tem formato { data: [], message: "" }, pega só os dados
      const result = response?.data || response || [];
      setData(Array.isArray(result) ? result : [result]);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Hooks específicos para cada entidade
export function useInstitutions(nome?: string) {
  return useApiData<Institution>(() => institutionService.getAll(nome), [nome]);
}

export function useBuses(placa?: string, status?: string) {
  return useApiData<Bus>(
    () => busService.getAll(placa, status),
    [placa, status],
  );
}

export function useStudents(status?: string, route?: number) {
  return useApiData<Student>(
    () => studentService.getAll(status, route),
    [status, route],
  );
}

export function useDrivers() {
  return useApiData<Driver>(() => driverService.getAll(), []);
}

export function usePayments(
  studentId?: number,
  status?: string,
  month?: string,
) {
  return useApiData<Payment>(
    () => paymentService.getAll(studentId, status, month),
    [studentId, status, month],
  );
}

export function useRoutes() {
  return useApiData<Route>(() => routeService.getAll(), []);
}

export function useAdmins() {
  return useApiData<Admin>(() => adminService.getAll(), []);
}

export function useAttendance(studentId?: number, routeId?: number) {
  return useApiData<Attendance>(
    () => attendanceService.getAll(studentId, routeId),
    [studentId, routeId],
  );
}

export function useBoardingPoints() {
  return useApiData<BoardingPoint>(() => boardingPointService.getAll(), []);
}

export function useNotifications() {
  return useApiData<Notification>(() => notificationService.getAll(), []);
}

export function useRotaAluno() {
  return useApiData<RotaAluno>(() => rotaAlunoService.getAll(), []);
}

export function useEmergencies() {
  return useApiData<Emergency>(() => emergencyService.getAll(), []);
}

export function useDashboardStats() {
  return useApiData<any>(() => dashboardService.getStats(), []);
}

// Hook para operações CRUD
export function useApiOperations<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (operation: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err: any) {
      setError(err.message || "Erro na operação");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}

// Funções utilitárias para operações comuns
export const apiOperations = {
  // Instituições
  institutions: {
    create: (data: Institution) => institutionService.create(data),
    update: (id: number, data: Partial<Institution>) =>
      institutionService.update(id, data),
    delete: (id: number) => institutionService.delete(id),
    getById: (id: number) => institutionService.getById(id),
  },

  // Ônibus
  buses: {
    create: (data: Bus) => busService.create(data),
    update: (id: number, data: Partial<Bus>) => busService.update(id, data),
    updateStatus: (id: number, status: string) =>
      busService.updateStatus(id, status),
    delete: (id: number) => busService.delete(id),
    getById: (id: number) => busService.getById(id),
    getByPlaca: (placa: string) => busService.getByPlaca(placa),
  },

  // Alunos
  students: {
    create: (data: Student) => studentService.create(data),
    update: (id: number, data: Partial<Student>) =>
      studentService.update(id, data),
    delete: (id: number) => studentService.delete(id),
    getById: (id: number) => studentService.getById(id),
  },

  // Motoristas
  drivers: {
    create: (data: Driver) => driverService.create(data),
    update: (id: number, data: Partial<Driver>) =>
      driverService.update(id, data),
    delete: (id: number) => driverService.delete(id),
    getById: (id: number) => driverService.getById(id),
  },

  // Pagamentos
  payments: {
    create: (data: Payment) => paymentService.create(data),
    update: (id: number, data: Partial<Payment>) =>
      paymentService.update(id, data),
    delete: (id: number) => paymentService.delete(id),
    getById: (id: number) => paymentService.getById(id),
    confirm: (id: number, paymentMethod: string) =>
      paymentService.confirm(id, paymentMethod),
  },

  // Rotas
  routes: {
    create: (data: Route) => routeService.create(data),
    update: (id: number, data: Partial<Route>) => routeService.update(id, data),
    delete: (id: number) => routeService.delete(id),
    getById: (id: number) => routeService.getById(id),
  },

  // Admin
  admins: {
    create: (data: Admin) => adminService.create(data),
    createFirst: (data: Admin) => adminService.createFirst(data),
  },

  // Presença
  attendance: {
    create: (data: Attendance) => attendanceService.create(data),
    update: (id: number, data: Partial<Attendance>) =>
      attendanceService.update(id, data),
    delete: (id: number) => attendanceService.delete(id),
    getById: (id: number) => attendanceService.getById(id),
    getStudentSummary: (studentId: number) =>
      attendanceService.getStudentSummary(studentId),
  },

  // Pontos de Embarque
  boardingPoints: {
    create: (data: BoardingPoint) => boardingPointService.create(data),
    update: (id: number, data: Partial<BoardingPoint>) =>
      boardingPointService.update(id, data),
    delete: (id: number) => boardingPointService.delete(id),
    getById: (id: number) => boardingPointService.getById(id),
  },

  // Notificações
  notifications: {
    create: (data: Notification) => notificationService.create(data),
    update: (id: number, data: Partial<Notification>) =>
      notificationService.update(id, data),
    delete: (id: number) => notificationService.delete(id),
    getById: (id: number) => notificationService.getById(id),
    markAsRead: (id: number) => notificationService.markAsRead(id),
  },

  // Emergências
  emergencies: {
    create: (data: Emergency) => emergencyService.create(data),
    update: (id: number, data: Partial<Emergency>) =>
      emergencyService.update(id, data),
    delete: (id: number) => emergencyService.delete(id),
    getById: (id: number) => emergencyService.getById(id),
    resolve: (id: number) => emergencyService.resolve(id),
  },

  // Rota-Aluno
  rotaAluno: {
    create: (data: RotaAluno) => rotaAlunoService.create(data),
    update: (id: number, data: Partial<RotaAluno>) =>
      rotaAlunoService.update(id, data),
    delete: (id: number) => rotaAlunoService.delete(id),
    getById: (id: number) => rotaAlunoService.getById(id),
  },
};
