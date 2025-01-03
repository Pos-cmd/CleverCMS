import { MenuLocationEnum } from '#enums/menu'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import MenuItem from './menu_item.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @column()
  declare slug: string
  @column()
  declare description: string
  @column()
  declare location: MenuLocationEnum
  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @hasMany(() => MenuItem)
  declare menuItems: HasMany<typeof MenuItem>
}
