import { AppDataSource } from '../config/orm.config';

async function runMigrations() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await AppDataSource.initialize();
    
    console.log('📋 Verificando migraciones ejecutadas...');
    const executedMigrations = await AppDataSource.query(
      `SELECT name FROM typeorm_metadata WHERE type = 'migration'`,
    ).catch(() => []);
    
    const executedNames = new Set(executedMigrations.map((m: any) => m.name));
    console.log(`📊 Migraciones ejecutadas: ${executedNames.size}`);
    
    // Ejecutar migraciones pendientes
    console.log('📋 Ejecutando migraciones pendientes...');
    try {
      const migrations = await AppDataSource.runMigrations();
      
      if (migrations.length === 0) {
        console.log('✅ No hay migraciones pendientes');
      } else {
        console.log(`✅ ${migrations.length} migración(es) ejecutada(s):`);
        migrations.forEach((migration) => {
          console.log(`   - ${migration.name}`);
        });
      }
    } catch (migrationError) {
      const errorMessage = migrationError instanceof Error ? migrationError.message : String(migrationError);
      
      // Si la migración ya existe, continuar
      if (errorMessage.includes('ya existe la columna')) {
        console.log('⚠️  La migración anterior ya fue aplicada. Verificando índices...');
      } else {
        throw migrationError;
      }
    }
    
    // Verificar índice único en habit_registers
    const hasUniqueIndex = await AppDataSource.query(
      `SELECT 1 FROM pg_indexes 
       WHERE tablename = 'habit_registers' AND indexname LIKE '%unique%habit%'`,
    ).catch(() => []);
    
    if (hasUniqueIndex.length === 0) {
      console.log('📍 Creando índice único en habit_registers...');
      try {
        // Eliminar duplicados manteniendo el más antiguo
        await AppDataSource.query(`
          DELETE FROM habit_registers 
          WHERE id NOT IN (
            SELECT DISTINCT ON (habit_id, date) id 
            FROM habit_registers 
            ORDER BY habit_id, date, created_at ASC
          )
        `);
        
        // Crear índice único
        await AppDataSource.query(
          `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_habit_registers_habit_date" 
           ON "habit_registers" (habit_id, date)`,
        );
        console.log('✅ Índice único creado en habit_registers');
      } catch (indexError) {
        console.warn('⚠️  Error creando índice:', indexError instanceof Error ? indexError.message : String(indexError));
      }
    } else {
      console.log('✅ Índice único ya existe en habit_registers');
    }
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    try {
      await AppDataSource.destroy();
    } catch (destroyError) {
      // Ignorar errores al cerrar conexión
    }
    process.exit(1);
  }
}

runMigrations();
