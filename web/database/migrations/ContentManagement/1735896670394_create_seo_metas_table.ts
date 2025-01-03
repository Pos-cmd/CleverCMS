import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seo_metas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('page_id').unsigned().nullable()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('keywords').notNullable()
      table.string('robots').notNullable()
      table.string('canonical').notNullable()
      table.string('author').notNullable()
      table.string('og_title').notNullable()
      table.string('og_description').notNullable()
      table.string('og_image').notNullable()
      table.string('og_url').notNullable()
      table.string('og_type').notNullable()
      table.string('og_site_name').notNullable()
      table.string('og_locale').notNullable()
      table.string('og_author').notNullable()
      table.string('og_publisher').notNullable()
      table.string('twitter_card').notNullable()
      table.string('twitter_title').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      table.foreign('page_id').references('pages.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
