import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPlantNumberToHabit1736516900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'habits',
      new TableColumn({
        name: 'plant_number',
        type: 'int',
        default: 1,
        comment: 'Flower number (1-15)',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('habits', 'plant_number');
  }
}
