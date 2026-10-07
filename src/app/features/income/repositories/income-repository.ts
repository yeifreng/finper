import { Injectable } from '@angular/core';
import { MovementInterface, MovementPayload } from '../../../shared/interfaces/movement.interface';
import { supabase } from '../../../core/providers/supabase.provider';

@Injectable({
  providedIn: 'root',
})
export class IncomeRepository {

  private readonly TABLE = 'income';

  async getAll(): Promise<MovementInterface[]> {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { data, error } = await supabase
      .from(this.TABLE)
      .select(`
        *,
        category:category_id ( name )
      `)
      .eq('user_id', auth.user.id)
      .eq('is_active', true)
      .order('date', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => this.mapToInterface(row));
  }

  async create(payload: MovementPayload): Promise<MovementInterface> {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { data, error } = await supabase
      .from(this.TABLE)
      .insert({
        user_id: auth.user.id,
        category_id: payload.categoryId,
        amount: payload.amount,
        description: payload.description,
        date: payload.date,
        is_active: true,
      })
      .select(`
        *,
        category:category_id ( name )
      `)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('No se pudo crear el ingreso.');

    return this.mapToInterface(data);
  }

  async update(id: string, payload: MovementPayload): Promise<MovementInterface> {
    const { data, error } = await supabase
      .from(this.TABLE)
      .update({
        category_id: payload.categoryId,
        amount: payload.amount,
        description: payload.description,
        date: payload.date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        category:category_id ( name )
      `)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('No se encontró el ingreso para actualizar.');

    return this.mapToInterface(data);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from(this.TABLE)
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('No se encontró el ingreso para eliminar.');
  }

  private mapToInterface(row: any): MovementInterface {
    return {
      id: row.id,
      userId: row.user_id,
      categoryId: row.category_id,
      categoryName: row.category?.name ?? '',
      amount: row.amount,
      description: row.description,
      date: row.date,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

}
