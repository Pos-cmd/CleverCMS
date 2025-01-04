import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Block from './block.js'
import Page from './page.js'
import SectionType from './section_type.js'

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare sectionTypeId: number
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
  @manyToMany(() => Page, {
    pivotTable: 'page_sections',
    pivotColumns: ['is_active', 'order', 'custom_content'],
  })
  declare pages: ManyToMany<typeof Page>
  @belongsTo(() => SectionType)
  declare sectionType: BelongsTo<typeof SectionType>
  @manyToMany(() => Block, {
    pivotTable: 'section_blocks',
    pivotColumns: ['is_active', 'order', 'custom_content'],
  })
  declare blocks: ManyToMany<typeof Block>
}
