import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blocks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('block_type_id').unsigned().nullable()
      table.string('name').notNullable()
      table.string('title').notNullable().unique()
      table.string('slug').notNullable().unique()
      table.json('content').notNullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      table.foreign('block_type_id').references('block_types.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
