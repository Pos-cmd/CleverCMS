import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import MenuItem from './menu_item.js'
import Section from './section.js'
import SeoMeta from './seo_meta.js'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string
  @column()
  declare title: string
  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @hasOne(() => SeoMeta)
  declare seoMeta: HasOne<typeof SeoMeta>
  @hasMany(() => MenuItem)
  declare menuItems: HasMany<typeof MenuItem>
  @manyToMany(() => Section, {
    pivotTable: 'page_sections',
    pivotColumns: ['is_active', 'order', 'custom_content'],
  })
  declare sections: ManyToMany<typeof Section>
}
