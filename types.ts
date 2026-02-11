
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface UserInfo {
  id: string;
  name: string;
  role: UserRole;
  pensionName: string;
}

export enum CategoryType {
  PR = '홍보관리',
  ROOM = '숙소관리',
  INVENTORY_CHECK = '재고관리',
  RESERVATION_CHECK = '예약관리'
}

export interface ChecklistItem {
  id: string;
  category: CategoryType;
  task: string;
}

// 일자별 업무 수행 상태 기록
export interface TaskStatus {
  staffDone: boolean;
  adminVerified: boolean;
  lastUpdatedBy?: string;
}

export interface DailyLog {
  [taskId: string]: TaskStatus;
}

export enum InventoryCategory {
  EQUIPMENT = '비품',
  DISPOSABLE = '일회용품',
  CONSUMABLE = '소모품'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  minThreshold: number;
}

export interface ReservationOptions {
  jacuzzi: number;
  charcoal: number;
  extraPerson: number;
  pet: number;
}

export interface Reservation {
  id: string;
  roomName: string;
  guestName: string;
  checkIn: string; // ISO Date
  checkOut: string; // ISO Date
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  guestCount: number;
  options: ReservationOptions;
}

export interface StaffPost {
  id: string;
  author: string;
  title: string;
  content: string;
  type: 'idea' | 'order';
  likes: number;
  createdAt: string;
  comments: StaffComment[];
}

export interface StaffComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface FinanceEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  lastVisit: string;
}

export type ViewType = 'dashboard' | 'checklist' | 'inventory' | 'calendar' | 'staff' | 'finance' | 'customer' | 'settings';
