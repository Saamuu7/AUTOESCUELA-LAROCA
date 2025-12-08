import { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, GraduationCap, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { mockStudents, mockTeachers, mockPracticalClasses, mockTheoreticalClasses, mockPayments } from '@/data/mockData';
import { startOfMonth, subMonths, format, startOfWeek, endOfWeek, eachWeekOfInterval, isSameMonth, isSameWeek, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function Estadisticas() {
  const activeStudents = mockStudents.filter(s => s.status === 'activo').length;
  const completedStudents = mockStudents.filter(s => s.status === 'completado').length;
  const totalClasses = mockPracticalClasses.length;
  const totalRevenue = mockPayments.filter(p => p.status === 'pagado').reduce((acc, p) => acc + p.amount, 0);

  // 1. Student Trend
  const startOfCurrentMonth = startOfMonth(new Date());
  const studentsEnrolledThisMonth = mockStudents.filter(s =>
    new Date(s.enrollmentDate) >= startOfCurrentMonth
  ).length;
  const totalStudents = mockStudents.length;
  const previousMonthTotal = totalStudents - studentsEnrolledThisMonth;

  const studentGrowthRate = previousMonthTotal > 0
    ? Math.round(((totalStudents - previousMonthTotal) / previousMonthTotal) * 100)
    : 0;

  const successRate = completedStudents > 0
    ? Math.round((completedStudents / (completedStudents + mockStudents.filter(s => s.status === 'baja').length || 1)) * 100)
    : 0;

  // 2. Dynamic Monthly Data (Last 6 Months)
  const monthlyData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthLabel = format(date, 'MMM', { locale: es });

      const classesCount = mockPracticalClasses.filter(c => isSameMonth(new Date(c.date), date)).length;
      const newStudentsCount = mockStudents.filter(s => isSameMonth(new Date(s.enrollmentDate), date)).length;

      data.push({
        month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        clases: classesCount,
        alumnos: newStudentsCount
      });
    }
    return data;
  }, []);

  // 3. Dynamic License Distribution
  const licenseDistribution = useMemo(() => {
    const counts: Record<string, number> = { 'B': 0, 'A2': 0, 'A1': 0, 'C': 0, 'Otros': 0 };
    mockStudents.forEach(s => {
      if (counts[s.license] !== undefined) {
        counts[s.license]++;
      } else {
        counts['Otros']++;
      }
    });

    const colors: Record<string, string> = {
      'B': 'hsl(var(--primary))',
      'A2': 'hsl(var(--accent))',
      'A1': 'hsl(var(--warning))',
      'C': 'hsl(var(--destructive))',
      'Otros': 'hsl(var(--muted-foreground))'
    };

    return Object.keys(counts).map(key => ({
      name: `Permiso ${key}`,
      value: counts[key],
      color: colors[key] || colors['Otros']
    })).filter(item => item.value > 0);
  }, []);

  // 4. Dynamic Weekly Trend (Last 4 Weeks)
  const weeklyTrend = useMemo(() => {
    const weeks = [];
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const date = subWeeks(today, i);
      const weekLabel = `Sem ${4 - i}`;

      const practicalCount = mockPracticalClasses.filter(c => isSameWeek(new Date(c.date), date, { weekStartsOn: 1 })).length;
      const theoryCount = mockTheoreticalClasses.filter(c => isSameWeek(new Date(c.date), date, { weekStartsOn: 1 })).length;

      weeks.push({
        week: weekLabel,
        practicas: practicalCount,
        teoricas: theoryCount
      });
    }
    return weeks;
  }, []);

  // 5. Dynamic Teacher Performance
  const teacherPerformance = useMemo(() => {
    return mockTeachers.map(t => {
      const classesCount = mockPracticalClasses.filter(c => c.teacherId === t.id).length;
      // Mock success rate based on 'stats' in teacher object if available, or random/fixed
      // In a real app, this would calculate pass/fail of students assigned to them
      return {
        name: t.name.split(' ')[0], // First name
        clases: classesCount,
        tasa: t.stats.successRate || 0
      };
    }).sort((a, b) => b.clases - a.clases).slice(0, 3); // Top 3
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Panel de Estadísticas
        </h1>
        <p className="text-muted-foreground">
          Análisis y métricas de la autoescuela (Datos en tiempo real)
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Alumnos Totales"
          value={mockStudents.length}
          icon={GraduationCap}
          variant="primary"
          trend={{ value: Math.abs(studentGrowthRate), isPositive: studentGrowthRate >= 0 }}
        />
        <StatCard
          title="Tasa de Éxito"
          value={`${successRate}%`}
          icon={Target}
          variant="success"
          description="aprobados vs total"
        />
        <StatCard
          title="Horas Impartidas"
          value={totalClasses}
          icon={TrendingUp}
          variant="accent"
          description="total histórico"
        />
        <StatCard
          title="Ingresos"
          value={`${totalRevenue}€`}
          icon={Award}
          description="total cobrado"
          variant="success"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="clases"
                    name="Clases"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="alumnos"
                    name="Nuevos Alumnos"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* License Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Permiso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={licenseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {licenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendencia Semanal (Último mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="week"
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="practicas"
                    name="Clases Prácticas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="teoricas"
                    name="Clases Teóricas"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Rendimiento Profesores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherPerformance.map((teacher, index) => (
              <div key={teacher.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium">{teacher.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{teacher.clases} clases</p>
                    <p className="text-xs text-success">{teacher.tasa}% éxito</p>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(teacher.clases / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
