import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'page_sections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('page_id').unsigned().nullable()
      table.integer('section_id').unsigned().nullable()
      table.integer('order').defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.json('custom_content').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      table.foreign('page_id').references('pages.id').onDelete('CASCADE')
      table.foreign('section_id').references('sections.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
