import { useState } from 'react';
import { Plus, Search, Filter, Download, Euro, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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

const statusVariants: Record<PaymentStatus, 'success' | 'warning' | 'error'> = {
    pagado: 'success',
    pendiente: 'warning',
    vencido: 'error',
};

const statusLabels: Record<PaymentStatus, string> = {
    pagado: 'Pagado',
    pendiente: 'Pendiente',
    vencido: 'Vencido',
};

export default function Pagos() {
    const [payments, setPayments] = useState<Payment[]>(mockPayments);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getStudentName = (id: string) => mockStudents.find(s => s.id === id)?.name || 'Desconocido';

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Auto-generate invoice number (simple mock logic)
        const invoiceNum = `FE-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, '0')}`;

        const newPayment: Payment = {
            id: String(Date.now()),
            studentId: formData.get('studentId') as string,
            amount: Number(formData.get('amount')),
            concept: formData.get('concept') as string,
            date: new Date(),
            status: 'pagado',
            invoiceNumber: invoiceNum,
        };

        setPayments([...payments, newPayment]);
        toast({
            title: 'Pago registrado',
            description: `Pago de ${newPayment.amount}€ registrado correctamente.`,
        });

        setIsDialogOpen(false);
    };

    const filteredPayments = payments.filter(p =>
        getStudentName(p.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = payments
        .filter(p => p.status === 'pagado')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const pendingAmount = payments
        .filter(p => p.status === 'pendiente')
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Euro className="h-8 w-8 text-primary" />
                        Gestión de Pagos
                    </h1>
                    <p className="text-muted-foreground">
                        Control de facturación y cobros
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Registrar Pago
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                                <DialogDescription>
                                    Introduce los detalles del pago recibido.
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
                                    <Input
                                        id="concept"
                                        name="concept"
                                        placeholder="Ej: Matrícula, Bono 10 clases..."
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Importe (€)</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="method">Método de Pago</Label>
                                    <Select name="method" defaultValue="tarjeta">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar método" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="efectivo">Efectivo</SelectItem>
                                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                            <SelectItem value="transferencia">Transferencia</SelectItem>
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

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                                <p className="text-2xl font-bold">{totalRevenue.toFixed(2)}€</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                <TrendingUpIcon className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pendiente de Cobro</p>
                                <p className="text-2xl font-bold">{pendingAmount.toFixed(2)}€</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                                <ClockIcon className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pagos este Mes</p>
                                <p className="text-2xl font-bold">{payments.length}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <CreditCard className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Historial de Transacciones</CardTitle>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                placeholder="Buscar por alumno, concepto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8"
                            />
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Factura</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Alumno</TableHead>
                                <TableHead>Concepto</TableHead>
                                <TableHead>Importe</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">{payment.invoiceNumber || '-'}</TableCell>
                                    <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy', { locale: es })}</TableCell>
                                    <TableCell className="font-medium">{getStudentName(payment.studentId)}</TableCell>
                                    <TableCell>{payment.concept}</TableCell>
                                    <TableCell>{payment.amount.toFixed(2)}€</TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={statusLabels[payment.status]}
                                            variant={statusVariants[payment.status]}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPayments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No se encontraron pagos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
