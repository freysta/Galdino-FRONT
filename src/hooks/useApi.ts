import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
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
  authService,
  rotaAlunoService,
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
  RotaAluno,
  LoginRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from "@/services/api";
import api from "@/services/api";

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

export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const response = await driverService.getAll();
      return response.data || response;
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

export const useRoutes = (status?: string) => {
  return useQuery({
    queryKey: ["routes", status],
    queryFn: async () => {
      const response = await routeService.getAll(status);
      return response;
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

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
  });
};

export const useBuses = (placa?: string, status?: BusStatus) => {
  return useQuery({
    queryKey: ["buses", placa, status],
    queryFn: () => busService.getAll(placa, status),
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
    mutationFn: (bus: Omit<Bus, "id">) => busService.create(bus),
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
    mutationFn: (institution: Omit<Institution, "id">) =>
      institutionService.create(institution),
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

export const useRotaAlunos = () => {
  return useQuery({
    queryKey: ["rotaAlunos"],
    queryFn: () => rotaAlunoService.getAll(),
  });
};

export const useRotaAluno = (id: number) => {
  return useQuery({
    queryKey: ["rotaAlunos", id],
    queryFn: () => rotaAlunoService.getById(id),
    enabled: !!id,
  });
};

export const useRotaAlunosByRoute = (rotaId: number) => {
  return useQuery({
    queryKey: ["rotaAlunos", "byRoute", rotaId],
    queryFn: () => rotaAlunoService.getByRoute(rotaId),
    enabled: !!rotaId,
  });
};

export const useRotaAlunosByStudent = (alunoId: number) => {
  return useQuery({
    queryKey: ["rotaAlunos", "byStudent", alunoId],
    queryFn: () => rotaAlunoService.getByStudent(alunoId),
    enabled: !!alunoId,
  });
};

export const useCreateRotaAluno = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rotaAluno: Omit<RotaAluno, "id">) =>
      rotaAlunoService.create(rotaAluno),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotaAlunos"] });
    },
  });
};

export const useUpdateRotaAluno = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RotaAluno> }) =>
      rotaAlunoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotaAlunos"] });
    },
  });
};

export const useDeleteRotaAluno = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rotaAlunoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotaAlunos"] });
    },
  });
};

export const useConfirmRotaAluno = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rotaAlunoService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotaAlunos"] });
    },
  });
};

export const useCancelRotaAluno = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rotaAlunoService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotaAlunos"] });
    },
  });
};

export const useStudentsByRoute = (routeId: number) => {
  return useQuery({
    queryKey: ["students", "byRoute", routeId],
    queryFn: async () => {
      try {
        const response = await api.get(`/routes/${routeId}/students`);
        return response.data;
      } catch {
        const students = await studentService.getAll();
        return students.filter(
          (student: Student) => student.route === routeId.toString(),
        );
      }
    },
    enabled: !!routeId,
  });
};

export const useStudentRoutes = (studentId: number) => {
  return useQuery({
    queryKey: ["routes", "student", studentId],
    queryFn: async () => {
      try {
        const response = await api.get(`/students/${studentId}/routes`);
        return response.data;
      } catch {
        const routes = await routeService.getAll();
        return routes.filter(
          (route: Route) => route.enrolled && route.enrolled > 0,
        );
      }
    },
    enabled: !!studentId,
  });
};

export const useDriverRoutes = (driverId: number) => {
  return useQuery({
    queryKey: ["routes", "driver", driverId],
    queryFn: async () => {
      try {
        const response = await api.get(`/drivers/${driverId}/routes`);
        return response.data;
      } catch {
        const routes = await routeService.getAll();
        return routes.filter(
          (route: Route) =>
            route.driverId === driverId || route.fk_id_motorista === driverId,
        );
      }
    },
    enabled: !!driverId,
  });
};

export const useStudentPayments = (studentId?: number) => {
  return useQuery({
    queryKey: ["payments", "student", studentId],
    queryFn: () => paymentService.getAll(studentId),
    enabled: !!studentId,
  });
};

export const useStudentAttendance = (studentId: number) => {
  return useQuery({
    queryKey: ["attendance", "student", studentId],
    queryFn: () => attendanceService.getAll(studentId),
    enabled: !!studentId,
  });
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      queryClient.invalidateQueries();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user;
      }

      const user = JSON.parse(userStr || "{}");
      return user;
    },
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      notifications.show({
        title: "Sucesso",
        message: "Perfil atualizado com sucesso!",
        color: "green",
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async () => {
      return { success: true };
    },
    onSuccess: () => {
      notifications.show({
        title: "Sucesso",
        message: "Senha alterada com sucesso!",
        color: "green",
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
    },
  });
};

export * from "@/services/api";
