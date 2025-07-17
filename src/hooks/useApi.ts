import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  studentService,
  driverService,
  adminService,
  routeService,
  paymentService,
  attendanceService,
  notificationService,
  boardingPointService,
  busService,
  dashboardService,
  institutionService,
  emergencyService,
  Student,
  Driver,
  Admin,
  Route,
  Payment,
  Attendance,
  Notification,
  BoardingPoint,
  Bus,
  BusStatus,
  Institution,
  Emergency,
} from "@/services/api";

// ===== STUDENTS =====
export const useStudents = (status?: string, route?: number) => {
  return useQuery({
    queryKey: ["students", status, route],
    queryFn: () => studentService.getAll(status, route),
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: Omit<Student, "id" | "createdAt" | "status">) =>
      studentService.create(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Student> }) =>
      studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

// ===== DRIVERS =====
export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const response = await driverService.getAll();
      return response.data;
    },
  });
};

export const useDriver = (id: number) => {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: () => driverService.getById(id),
    enabled: !!id,
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (driver: Omit<Driver, "id" | "createdAt" | "status">) =>
      driverService.create(driver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Driver> }) =>
      driverService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driverService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

// ===== ADMINS =====
export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => adminService.getAll(),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admin: Admin) => adminService.create(admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// ===== ROUTES =====
export const useRoutes = (status?: string) => {
  return useQuery({
    queryKey: ["routes", status],
    queryFn: async () => {
      const response = await routeService.getAll(status);
      return response.data;
    },
  });
};

export const useRoute = (id: number) => {
  return useQuery({
    queryKey: ["routes", id],
    queryFn: () => routeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (route: Omit<Route, "id" | "createdAt">) =>
      routeService.create(route),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Route> }) =>
      routeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => routeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

// ===== PAYMENTS =====
export const usePayments = (
  studentId?: number,
  status?: string,
  month?: string,
) => {
  return useQuery({
    queryKey: ["payments", studentId, status, month],
    queryFn: () => paymentService.getAll(studentId, status, month),
  });
};

export const usePayment = (id: number) => {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => paymentService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: Omit<Payment, "id" | "createdAt">) =>
      paymentService.create(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Payment> }) =>
      paymentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useMarkPaymentAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      paymentMethod,
    }: {
      id: number;
      paymentMethod: string;
    }) => paymentService.confirm(id, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

// ===== ATTENDANCE =====
export const useAttendance = (studentId?: number, routeId?: number) => {
  return useQuery({
    queryKey: ["attendance", studentId, routeId],
    queryFn: () => attendanceService.getAll(studentId, routeId),
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attendance: Omit<Attendance, "id" | "createdAt">) =>
      attendanceService.create(attendance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useStudentAttendanceSummary = (studentId: number) => {
  return useQuery({
    queryKey: ["attendance", "summary", studentId],
    queryFn: () => attendanceService.getStudentSummary(studentId),
    enabled: !!studentId,
  });
};

// ===== NOTIFICATIONS =====
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getAll(),
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notification: Omit<Notification, "id" | "createdAt">) =>
      notificationService.create(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// ===== BOARDING POINTS =====
export const useBoardingPoints = () => {
  return useQuery({
    queryKey: ["boardingPoints"],
    queryFn: () => boardingPointService.getAll(),
  });
};

export const useCreateBoardingPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (point: Omit<BoardingPoint, "id" | "createdAt">) =>
      boardingPointService.create(point),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardingPoints"] });
    },
  });
};

export const useUpdateBoardingPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BoardingPoint> }) =>
      boardingPointService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardingPoints"] });
    },
  });
};

export const useDeleteBoardingPoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => boardingPointService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardingPoints"] });
    },
  });
};

// ===== DASHBOARD =====
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
  });
};

// ===== BUSES =====
export const useBuses = (status?: BusStatus) => {
  return useQuery({
    queryKey: ["buses", status],
    queryFn: () => busService.getAll(status),
  });
};

export const useBus = (id: number) => {
  return useQuery({
    queryKey: ["buses", id],
    queryFn: () => busService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bus: Omit<Bus, "id" | "createdAt" | "updatedAt">) =>
      busService.create(bus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
};

export const useUpdateBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Bus> }) =>
      busService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
};

export const useDeleteBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => busService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
};

// ===== INSTITUTIONS =====
export const useInstitutions = () => {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: () => institutionService.getAll(),
  });
};

export const useInstitution = (id: number) => {
  return useQuery({
    queryKey: ["institutions", id],
    queryFn: () => institutionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      institution: Omit<Institution, "id" | "createdAt" | "updatedAt">,
    ) => institutionService.create(institution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
};

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Institution> }) =>
      institutionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
};

export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => institutionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
};

// ===== EMERGENCIES =====
export const useEmergencies = () => {
  return useQuery({
    queryKey: ["emergencies"],
    queryFn: () => emergencyService.getAll(),
  });
};

export const useEmergency = (id: number) => {
  return useQuery({
    queryKey: ["emergencies", id],
    queryFn: () => emergencyService.getById(id),
    enabled: !!id,
  });
};

export const useCreateEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      emergency: Omit<Emergency, "id" | "createdAt" | "updatedAt">,
    ) => emergencyService.create(emergency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
};

export const useUpdateEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Emergency> }) =>
      emergencyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
};

export const useDeleteEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => emergencyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
};

// ===== STUDENTS BY ROUTE =====
export const useStudentsByRoute = (routeId: number) => {
  return useQuery({
    queryKey: ["students", "byRoute", routeId],
    queryFn: async () => {
      // Buscar todos os alunos e filtrar pela rota
      const students = await studentService.getAll();
      return students.filter((student) => student.route === routeId);
    },
    enabled: !!routeId,
  });
};

// Exportar também os tipos e enums do serviço
export * from "@/services/api";
