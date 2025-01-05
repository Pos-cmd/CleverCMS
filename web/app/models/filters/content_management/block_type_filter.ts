import BlockType from '#models/content_management/block_type'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { BaseModelFilter } from 'adonis-lucid-filter'

export default class BlockTypeFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof BlockType>

  name(value: string): void {
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  isActive(value: boolean): void {
    this.$query.where('isActive', value)
  }
}
