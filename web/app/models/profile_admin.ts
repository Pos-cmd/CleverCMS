import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { MorphMap } from '@holoyan/adonisjs-permissions'
import { AclModelInterface } from '@holoyan/adonisjs-permissions/types'
import { DateTime } from 'luxon'

@MorphMap('profile_admins')
export default class ProfileAdmin extends BaseModel implements AclModelInterface {
  getModelId(): number {
    return this.id
  }
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
