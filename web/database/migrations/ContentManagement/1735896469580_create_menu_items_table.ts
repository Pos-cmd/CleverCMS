import { MenuTargetEnum } from '#enums/menu'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('menu_id').unsigned().nullable()
      table.integer('parent_id').unsigned().nullable()
      table.integer('page_id').unsigned().nullable()
      table.string('name').notNullable()
      table.string('title').notNullable().unique()
      table.string('slug').notNullable().unique()
      table.string('url').notNullable()
      table.string('target').notNullable().defaultTo(MenuTargetEnum.Self)
      table.boolean('is_active').defaultTo(true)
      table.integer('order').defaultTo(0)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      table.foreign('menu_id').references('menus.id').onDelete('CASCADE')
      table.foreign('parent_id').references('menu_items.id').onDelete('CASCADE')
      table.foreign('page_id').references('pages.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
