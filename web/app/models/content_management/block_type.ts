import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { Filterable } from 'adonis-lucid-filter'
import Block from '#models/content_management/block'
import BlockTypeFilter from '#models/filters/content_management/block_type_filter'

export default class BlockType extends compose(BaseModel, Filterable) {
  static $filter = () => BlockTypeFilter

  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @column()
  declare description: any
  @column()
  declare fields: any
  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @hasMany(() => Block)
  declare blocks: HasMany<typeof Block>
}
