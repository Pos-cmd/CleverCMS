import { DefaultStatus } from '#enums/default_status'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('avatar').nullable()
      table.string('firstname').nullable()
      table.string('lastname').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('account_status').defaultTo(DefaultStatus.PENDING)
      table.boolean('is_email_verified').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
