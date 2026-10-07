import { Injectable } from '@angular/core';
import { CategoryInterface, CategoryPayload } from '../interfaces/category.interface';
import { supabase } from '../../../core/providers/supabase.provider';

@Injectable({
  providedIn: 'root',
})
export class CategoryRepository {

  private readonly table = 'category';

  async getAll(): Promise<CategoryInterface[]> {

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', auth.user.id)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => this.mapToInterface(row));
  }

  async getByType(type: 'ingreso' | 'gasto'): Promise<CategoryInterface[]> {

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', auth.user.id)
      .eq('type', type)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => this.mapToInterface(row));
  }

  async create(payload: CategoryPayload): Promise<CategoryInterface> {

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error('No hay una sesión activa.');
    }

    const { data, error } = await supabase
      .from(this.table)
      .insert({
        user_id: auth.user.id,
        name: payload.name,
        type: payload.type,
        is_default: false,
        is_active: true,
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error('No se pudo crear la categoría.');
    }

    return this.mapToInterface(data);
  }

  async update(id: string, payload: CategoryPayload): Promise<CategoryInterface> {

    const { data, error } = await supabase
      .from(this.table)
      .update({
        name: payload.name,
        type: payload.type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error('No se encontró la categoría para actualizar.');
    }

    return this.mapToInterface(data);
  }

  async delete(id: string): Promise<void> {

    const { data, error } = await supabase
      .from(this.table)
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error('No se encontró la categoría para eliminar.');
    }
  }

  private mapToInterface(row: any): CategoryInterface {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      isDefault: row.is_default,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

  }


}
