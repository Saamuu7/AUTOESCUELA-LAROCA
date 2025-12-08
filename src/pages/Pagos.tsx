import { useState } from 'react';
import { Plus, CreditCard, Download, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatCard } from '@/components/ui/stat-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockPayments, mockStudents } from '@/data/mockData';
import type { Payment, PaymentStatus } from '@/types/crm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const statusVariants: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'info'> = {
  pagado: 'success',
  pendiente: 'warning',
  parcial: 'info',
  vencido: 'error',
};

const statusLabels: Record<PaymentStatus, string> = {
  pagado: 'Pagado',
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  vencido: 'Vencido',
};

const CHART_COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--primary))', 'hsl(var(--destructive))'];

export default function Pagos() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStudentName = (id: string) => mockStudents.find(s => s.id === id)?.name || 'Desconocido';

  const totalPaid = payments.filter(p => p.status === 'pagado').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pendiente' || p.status === 'parcial').reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'vencido').reduce((acc, p) => acc + p.amount, 0);
  const totalAmount = totalPaid + totalPending + totalOverdue;

  const chartData = [
    { name: 'Pagado', value: totalPaid },
    { name: 'Pendiente', value: totalPending },
    { name: 'Vencido', value: totalOverdue },
  ].filter(d => d.value > 0);

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Factura',
      render: (payment: Payment) => (
        <span className="font-mono text-sm">
          {payment.invoiceNumber || '-'}
        </span>
      ),
    },
    {
      key: 'studentId',
      header: 'Alumno',
      render: (payment: Payment) => getStudentName(payment.studentId),
    },
    {
      key: 'concept',
      header: 'Concepto',
    },
    {
      key: 'amount',
      header: 'Importe',
      sortable: true,
      render: (payment: Payment) => (
        <span className="font-semibold">{payment.amount}€</span>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      sortable: true,
      render: (payment: Payment) => format(payment.date, 'd MMM yyyy', { locale: es }),
    },
    {
      key: 'dueDate',
      header: 'Vencimiento',
      render: (payment: Payment) =>
        payment.dueDate ? format(payment.dueDate, 'd MMM yyyy', { locale: es }) : '-',
    },
    {
      key: 'status',
      header: 'Estado',
      render: (payment: Payment) => (
        <StatusBadge
          status={statusLabels[payment.status]}
          variant={statusVariants[payment.status]}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (payment: Payment) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPayment: Payment = {
      id: String(Date.now()),
      studentId: formData.get('studentId') as string,
      amount: Number(formData.get('amount')),
      concept: formData.get('concept') as string,
      date: new Date(),
      status: formData.get('status') as PaymentStatus,
      invoiceNumber: `F-${new Date().getFullYear()}-${String(payments.length + 1).padStart(4, '0')}`,
    };

    if (formData.get('status') !== 'pagado') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      newPayment.dueDate = dueDate;
    }

    setPayments([newPayment, ...payments]);
    toast({
      title: 'Pago registrado',
      description: `Se ha registrado un pago de ${newPayment.amount}€`,
    });

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Gestión de Pagos
          </h1>
          <p className="text-muted-foreground">
            Control de facturación y cobros
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Pago</DialogTitle>
                <DialogDescription>
                  Registra un nuevo pago o factura.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Alumno</Label>
                  <Select name="studentId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concept">Concepto</Label>
                  <Select name="concept" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar concepto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matrícula permiso B">Matrícula permiso B</SelectItem>
                      <SelectItem value="Matrícula permiso A2">Matrícula permiso A2</SelectItem>
                      <SelectItem value="Clase práctica">Clase práctica</SelectItem>
                      <SelectItem value="Pack 3 clases prácticas">Pack 3 clases prácticas</SelectItem>
                      <SelectItem value="Pack 5 clases prácticas">Pack 5 clases prácticas</SelectItem>
                      <SelectItem value="Pack 10 clases prácticas">Pack 10 clases prácticas</SelectItem>
                      <SelectItem value="Cuota mensual">Cuota mensual</SelectItem>
                      <SelectItem value="Tasa examen teórico">Tasa examen teórico</SelectItem>
                      <SelectItem value="Tasa examen práctico">Tasa examen práctico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Importe (€)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select name="status" defaultValue="pendiente">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="parcial">Pago parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Pago</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Cobrado"
          value={`${totalPaid}€`}
          icon={TrendingUp}
          variant="success"
          description="este mes"
        />
        <StatCard
          title="Pendiente de Cobro"
          value={`${totalPending}€`}
          icon={CreditCard}
          variant="warning"
          description={`${payments.filter(p => p.status === 'pendiente').length} pagos`}
        />
        <StatCard
          title="Pagos Vencidos"
          value={`${totalOverdue}€`}
          icon={AlertCircle}
          variant="primary"
          description={`${payments.filter(p => p.status === 'vencido').length} vencidos`}
        />
        <StatCard
          title="Total Facturado"
          value={`${totalAmount}€`}
          icon={FileText}
          description="acumulado"
        />
      </div>

      {/* Chart and Recent Payments */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}€`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Payments Alert */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Pagos Vencidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.filter(p => p.status === 'vencido').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay pagos vencidos
                </p>
              ) : (
                payments
                  .filter(p => p.status === 'vencido')
                  .map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4"
                    >
                      <div>
                        <p className="font-medium">{getStudentName(payment.studentId)}</p>
                        <p className="text-sm text-muted-foreground">{payment.concept}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">{payment.amount}€</p>
                        <p className="text-xs text-muted-foreground">
                          Vencido el {payment.dueDate && format(payment.dueDate, 'd MMM', { locale: es })}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={payments}
        columns={columns}
        searchable
        searchPlaceholder="Buscar por concepto o factura..."
        searchKeys={['concept', 'invoiceNumber'] as (keyof Payment)[]}
        pageSize={10}
      />
    </div>
  );
}
