import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import BlockType from './block_type.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Section from './section.js'

export default class Block extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare blockTypeId: number
  @column()
  declare sectionId: number
  @column()
  declare name: string
  @column()
  declare title: string
  @column()
  declare slug: string
  @column()
  declare content: any
  @column()
  declare isActive: boolean
  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => BlockType)
  declare blockType: BelongsTo<typeof BlockType>
  @manyToMany(() => Section, {
    pivotTable: 'section_blocks',
    pivotColumns: ['is_active', 'order', 'custom_content'],
  })
  declare section: ManyToMany<typeof Section>
}
