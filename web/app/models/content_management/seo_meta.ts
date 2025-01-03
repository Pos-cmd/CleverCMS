import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Page from './page.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class SeoMeta extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare pageId: number
  @column()
  declare title: string
  @column()
  declare description: string
  @column()
  declare keywords: string
  @column()
  declare robots: string
  @column()
  declare canonical: string
  @column()
  declare ogTitle: string
  @column()
  declare ogDescription: string
  @column()
  declare ogImage: string
  @column()
  declare ogUrl: string
  @column()
  declare ogType: string
  @column()
  declare ogSiteName: string
  @column()
  declare ogLocale: string
  @column()
  declare ogAuthor: string
  @column()
  declare twitterCard: string
  @column()
  declare twitterTitle: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>
}
