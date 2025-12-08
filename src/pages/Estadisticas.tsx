import { BarChart3, TrendingUp, Users, GraduationCap, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { mockStudents, mockTeachers, mockPracticalClasses, mockPayments } from '@/data/mockData';
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

const monthlyData = [
  { month: 'Jul', clases: 85, alumnos: 12 },
  { month: 'Ago', clases: 45, alumnos: 8 },
  { month: 'Sep', clases: 120, alumnos: 18 },
  { month: 'Oct', clases: 145, alumnos: 22 },
  { month: 'Nov', clases: 130, alumnos: 20 },
  { month: 'Dic', clases: 95, alumnos: 15 },
];

const teacherPerformance = [
  { name: 'María', clases: 45, tasa: 92 },
  { name: 'Carlos', clases: 38, tasa: 88 },
  { name: 'Ana', clases: 22, tasa: 94 },
];

const licenseDistribution = [
  { name: 'Permiso B', value: 75, color: 'hsl(var(--primary))' },
  { name: 'Permiso A2', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Permiso A1', value: 7, color: 'hsl(var(--warning))' },
  { name: 'Otros', value: 3, color: 'hsl(var(--muted-foreground))' },
];

const weeklyTrend = [
  { week: 'Sem 1', practicas: 28, teoricas: 12 },
  { week: 'Sem 2', practicas: 32, teoricas: 15 },
  { week: 'Sem 3', practicas: 25, teoricas: 10 },
  { week: 'Sem 4', practicas: 35, teoricas: 14 },
];

export default function Estadisticas() {
  const activeStudents = mockStudents.filter(s => s.status === 'activo').length;
  const completedStudents = mockStudents.filter(s => s.status === 'completado').length;
  const totalClasses = mockPracticalClasses.length;
  const totalRevenue = mockPayments.filter(p => p.status === 'pagado').reduce((acc, p) => acc + p.amount, 0);

  const successRate = completedStudents > 0 
    ? Math.round((completedStudents / (completedStudents + mockStudents.filter(s => s.status === 'baja').length || 1)) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Panel de Estadísticas
        </h1>
        <p className="text-muted-foreground">
          Análisis y métricas de la autoescuela
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Alumnos Totales"
          value={mockStudents.length}
          icon={GraduationCap}
          variant="primary"
          trend={{ value: 15, isPositive: true }}
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
          description="este mes"
        />
        <StatCard
          title="Ingresos"
          value={`${totalRevenue}€`}
          icon={Award}
          description="total cobrado"
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
                    formatter={(value: number) => `${value}%`}
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
            <CardTitle>Tendencia Semanal</CardTitle>
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
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">+18%</h3>
              <p className="text-sm text-muted-foreground">
                Crecimiento respecto al trimestre anterior
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success">
                <Award className="h-6 w-6 text-success-foreground" />
              </div>
              <h3 className="text-2xl font-bold">92%</h3>
              <p className="text-sm text-muted-foreground">
                Tasa de aprobados en examen práctico
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-sm text-muted-foreground">
                Permisos expedidos este año
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
