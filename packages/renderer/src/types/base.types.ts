// Tipos base reutilizables para toda la aplicación

export interface BaseEntity {
  _id?: string;
}

export interface BaseResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Estados comunes para UI
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface CrudState<T> extends LoadingState {
  items: T[];
  selectedItem: T | null;
  isEditing: boolean;
  isCreating: boolean;
}

// Tipos para operaciones CRUD
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export interface CrudActions<T> {
  create: (data: Omit<T, '_id'>) => Promise<T>;
  read: (id: string) => Promise<T>;
  readAll: () => Promise<T[]>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<boolean>;
} 