export interface CategoryInterface {
  id: string;
  userId: string;
  name: string;
  type: 'ingreso' | 'gasto';
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  type: 'ingreso' | 'gasto';
}
