// Core types for the CRM system

export type UserRole = 'admin' | 'profesora' | 'secretaria';

export type LicenseType = 'AM' | 'A1' | 'A2' | 'A' | 'B' | 'C' | 'D' | 'E';

export type ClassStatus = 'programada' | 'realizada' | 'cancelada';

export type StudentStatus = 'activo' | 'pausado' | 'completado' | 'baja';

export type PaymentStatus = 'pagado' | 'pendiente' | 'parcial' | 'vencido';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role: 'practicas' | 'teoricas' | 'ambas';
  availability: WeeklyAvailability;
  active: boolean;
  createdAt: Date;
  stats: TeacherStats;
}

export interface TeacherStats {
  totalClasses: number;
  thisMonth: number;
  successRate: number;
  activeStudents: number;
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  birthDate: Date;
  address: string;
  photo?: string;
  license: LicenseType;
  status: StudentStatus;
  teacherId?: string;
  theoreticalProgress: number;
  practicalProgress: number;
  practicalClasses: number;
  observations: string;
  documents: Document[];
  enrollmentDate: Date;
  examDate?: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface PracticalClass {
  id: string;
  studentId: string;
  teacherId: string;
  vehicleId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  notes: string;
  rating?: number;
}

export interface TheoreticalClass {
  id: string;
  teacherId: string;
  date: Date;
  startTime: string;
  endTime: string;
  topic: string;
  attendees: string[];
  status: ClassStatus;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  itvDate: Date;
  insuranceDate: Date;
  active: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  concept: string;
  date: Date;
  status: PaymentStatus;
  dueDate?: Date;
  invoiceNumber?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
}
