import type { Student, Teacher, PracticalClass, Payment, Vehicle, Notification, TheoreticalClass } from '@/types/crm';

export const mockTeachers: Teacher[] = [
    {
        id: '1',
        name: 'Roberto Gómez',
        email: 'roberto@autoescuelalaroca.com',
        phone: '600111222',
        role: 'ambas',
        availability: {
            monday: [{ start: '09:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
            tuesday: [{ start: '09:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
            wednesday: [{ start: '09:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
            thursday: [{ start: '09:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
            friday: [{ start: '09:00', end: '14:00' }],
            saturday: [],
            sunday: [],
        },
        active: true,
        createdAt: new Date('2024-01-10'),
        stats: {
            totalClasses: 150,
            thisMonth: 24,
            successRate: 95,
            activeStudents: 5,
        },
    },
];

export const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        phone: '611222333',
        dni: '12345678Z',
        birthDate: new Date('2004-05-20'),
        address: 'Calle Mayor 10, Guadalajara',
        license: 'B',
        status: 'activo',
        teacherId: '1',
        theoreticalProgress: 45,
        practicalProgress: 15,
        practicalClasses: 3,
        observations: 'Comienza prácticas. Atenta pero insegura en rotondas.',
        documents: [],
        enrollmentDate: new Date('2024-11-01'),
    },
];

export const mockVehicles: Vehicle[] = [
    {
        id: '1',
        brand: 'Volkswagen',
        model: 'Golf',
        plate: '8899 LLR',
        year: 2023,
        itvDate: new Date('2027-01-15'),
        insuranceDate: new Date('2025-01-15'),
        active: true,
    },
];

export const mockPracticalClasses: PracticalClass[] = [
    {
        id: '1',
        studentId: '1',
        teacherId: '1',
        vehicleId: '1',
        date: new Date(), // Hoy
        startTime: '10:00',
        endTime: '11:00',
        status: 'programada',
        notes: 'Práctica de estacionamiento.',
    },
];

export const mockTheoreticalClasses: TheoreticalClass[] = [
    {
        id: '1',
        teacherId: '1',
        date: new Date(), // Today
        startTime: '17:00',
        endTime: '18:00',
        topic: 'Señales de Tráfico',
        attendees: ['1'],
        status: 'programada',
    },
];

export const mockPayments: Payment[] = [
    {
        id: '1',
        studentId: '1',
        amount: 150.00,
        concept: 'Matrícula Permiso B',
        date: new Date('2024-11-01'),
        status: 'pagado',
        invoiceNumber: 'FE-2024-001',
    },
];

export const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Nueva Matriculación',
        message: 'Ana Martínez se ha matriculado en el permiso B.',
        type: 'success',
        read: false,
        createdAt: new Date(),
        link: '/alumnos',
    },
];
