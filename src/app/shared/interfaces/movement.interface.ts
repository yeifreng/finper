export interface MovementInterface {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;   // ← viene del join con category
  amount: number;
  description: string | null;
  date: string;           // formato YYYY-MM-DD
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MovementPayload {
  categoryId: string;
  amount: number;
  description: string | null;
  date: string;
}
