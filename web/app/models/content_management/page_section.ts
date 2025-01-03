import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Page from './page.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Section from './section.js'

export default class PageSection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare pageId: number
  @column()
  declare sectionId: number
  @column()
  declare isActive: boolean
  @column()
  declare order: number
  @column()
  declare customContent: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>
  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>
}
