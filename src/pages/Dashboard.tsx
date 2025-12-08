import { 
  GraduationCap, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  TrendingUp,
  Clock,
  Car,
  AlertTriangle,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockStudents, mockPracticalClasses, mockTeachers, mockPayments, mockNotifications } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Lun', clases: 12 },
  { day: 'Mar', clases: 15 },
  { day: 'Mié', clases: 10 },
  { day: 'Jue', clases: 14 },
  { day: 'Vie', clases: 8 },
];

export default function Dashboard() {
  const activeStudents = mockStudents.filter(s => s.status === 'activo').length;
  const todayClasses = mockPracticalClasses.filter(
    c => format(c.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pendiente' || p.status === 'vencido');
  const totalPending = pendingPayments.reduce((acc, p) => acc + p.amount, 0);
  const unreadNotifications = mockNotifications.filter(n => !n.read);

  const upcomingClasses = mockPracticalClasses
    .filter(c => c.status === 'programada')
    .slice(0, 5);

  const getStudentName = (id: string) => mockStudents.find(s => s.id === id)?.name || 'Desconocido';
  const getTeacherName = (id: string) => mockTeachers.find(t => t.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de actividad · {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <Button className="w-fit">
          <CalendarCheck className="mr-2 h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Alumnos Activos"
          value={activeStudents}
          description="matriculados actualmente"
          icon={GraduationCap}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Profesores"
          value={mockTeachers.filter(t => t.active).length}
          description="profesores activos"
          icon={Users}
          variant="accent"
        />
        <StatCard
          title="Clases Hoy"
          value={todayClasses}
          description="programadas para hoy"
          icon={CalendarCheck}
          variant="success"
        />
        <StatCard
          title="Pagos Pendientes"
          value={`${totalPending}€`}
          description={`${pendingPayments.length} pagos por cobrar`}
          icon={CreditCard}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Clases Esta Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="day" 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="clases" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas
              {unreadNotifications.length > 0 && (
                <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                  {unreadNotifications.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotifications.slice(0, 4).map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 transition-colors ${
                  notification.read ? 'bg-background' : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      notification.type === 'warning'
                        ? 'bg-warning'
                        : notification.type === 'error'
                        ? 'bg-destructive'
                        : 'bg-primary'
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Próximas Clases Prácticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 rounded-lg border bg-secondary/30 p-3"
                >
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-xs font-medium">
                      {format(cls.date, 'MMM', { locale: es }).toUpperCase()}
                    </span>
                    <span className="text-lg font-bold">{format(cls.date, 'd')}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{getStudentName(cls.studentId)}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.startTime} - {cls.endTime} · Prof. {getTeacherName(cls.teacherId).split(' ')[0]}
                    </p>
                  </div>
                  <StatusBadge status="Programada" variant="info" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Alumnos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStudents.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4"
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Permiso {student.license} · {student.practicalClasses} clases
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${student.practicalProgress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{student.practicalProgress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
