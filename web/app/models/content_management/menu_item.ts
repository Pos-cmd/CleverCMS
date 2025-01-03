import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Menu from './menu.js'
import Page from './page.js'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare menuId: number
  @column()
  declare parentId: number
  @column()
  declare pageId: number
  @column()
  declare name: string
  @column()
  declare title: string
  @column()
  declare slug: string
  @column()
  declare url: string
  @column()
  declare target: string
  @column()
  declare isActive: boolean
  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @belongsTo(() => Menu)
  declare menu: BelongsTo<typeof Menu>
  @belongsTo(() => MenuItem, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof MenuItem>
  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>
}
