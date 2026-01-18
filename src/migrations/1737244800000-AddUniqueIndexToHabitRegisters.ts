import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToHabitRegisters1737244800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paso 1: Eliminar registros duplicados, manteniendo el más antiguo (por created_at)
    await queryRunner.query(`
      DELETE FROM habit_registers
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM habit_registers
        GROUP BY habit_id, date
      );
    `);

    // Paso 2: Crear índice único en (habit_id, date)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_ccba981c1f575ac19924a6f7c8"
      ON "habit_registers" ("habit_id", "date");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: eliminar el índice único
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_ccba981c1f575ac19924a6f7c8";
    `);
  }
}
