import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Car, TrendingUp, CalendarDays, AlertCircle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { startOfWeek, addDays, format, isSameDay, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockStudents, mockPracticalClasses, mockTheoreticalClasses, mockPayments, mockTeachers } from '@/data/mockData';
import { Link } from 'react-router-dom';

const CHART_COLORS = {
    practical: 'hsl(var(--primary))',
    theoretical: 'hsl(var(--destructive))', // Red color for theoretical
};

export default function Dashboard() {
    const [chartType, setChartType] = useState<'practical' | 'theoretical'>('practical');

    // Stats Calculations
    const activeStudents = mockStudents.filter(s => s.status === 'activo').length;

    // Student Trend Calculation
    const startOfCurrentMonth = startOfMonth(new Date());
    const studentsEnrolledThisMonth = mockStudents.filter(s =>
        new Date(s.enrollmentDate) >= startOfCurrentMonth
    ).length;
    const totalStudents = mockStudents.length;
    const previousMonthTotal = totalStudents - studentsEnrolledThisMonth;

    // Prevent division by zero
    const studentGrowthRate = previousMonthTotal > 0
        ? Math.round(((activeStudents - previousMonthTotal) / previousMonthTotal) * 100)
        : 0;

    const weeklyClasses = mockPracticalClasses.filter(c => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 });
        const end = addDays(start, 6);
        const classDate = new Date(c.date);
        return classDate >= start && classDate <= end;
    }).length;

    const pendingPayments = mockPayments
        .filter(p => p.status === 'pendiente' || p.status === 'vencido')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Dynamic Chart Data
    const getWeeklyData = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

        return days.map(day => {
            const dayName = format(day, 'EEE', { locale: es });

            let count = 0;
            if (chartType === 'practical') {
                count = mockPracticalClasses.filter(c => isSameDay(new Date(c.date), day)).length;
            } else {
                count = mockTheoreticalClasses.filter(c => isSameDay(new Date(c.date), day)).length;
            }

            return {
                name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                clases: count,
            };
        });
    };

    const weeklyData = getWeeklyData();

    // Recent Students
    const recentStudents = [...mockStudents]
        .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                <p className="text-muted-foreground">
                    Resumen de actividad de la autoescuela
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Alumnos Activos"
                    value={activeStudents}
                    icon={Users}
                    trend={{ value: Math.abs(studentGrowthRate), isPositive: studentGrowthRate >= 0 }}
                    description="vs. mes anterior"
                    variant="success"
                />
                <StatCard
                    title="Clases esta Semana"
                    value={weeklyClasses}
                    icon={BookOpen}
                    description="Programadas"
                    variant="primary"
                />
                <StatCard
                    title="Pagos Pendientes"
                    value={`${pendingPayments}€`}
                    icon={AlertCircle}
                    variant="warning"
                    description="Por cobrar"
                />
                <StatCard
                    title="Tasa de Aprobados"
                    value="85%"
                    icon={TrendingUp}
                    variant="success"
                    description="Último mes"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Actividad Semanal</CardTitle>
                            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                                <Button
                                    variant={chartType === 'practical' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setChartType('practical')}
                                    className="h-8"
                                >
                                    Prácticas
                                </Button>
                                <Button
                                    variant={chartType === 'theoretical' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setChartType('theoretical')}
                                    className="h-8"
                                >
                                    Teóricas
                                </Button>
                            </div>
                        </div>
                        <CardDescription>
                            Número de clases {chartType === 'practical' ? 'prácticas' : 'teóricas'} por día
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickCount={5}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderRadius: '8px',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                    />
                                    <Bar
                                        dataKey="clases"
                                        fill={chartType === 'practical' ? CHART_COLORS.practical : CHART_COLORS.theoretical}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Alumnos Recientes</CardTitle>
                        <CardDescription>
                            Últimas matriculaciones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{student.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Permiso {student.license}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{student.practicalClasses} clases</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(student.enrollmentDate), 'd MMM', { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <Button asChild variant="outline" className="w-full mt-4">
                                <Link to="/alumnos">Ver todos</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
