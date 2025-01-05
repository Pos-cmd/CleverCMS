import { DefaultStatus } from '#enums/default_status'
import ProfileAdmin from '#models/profile_admin'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, computed, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { MorphMap, Permission, Role } from '@holoyan/adonisjs-permissions'
import { AclModelInterface } from '@holoyan/adonisjs-permissions/types'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

@MorphMap('users')
export default class User extends compose(BaseModel, AuthFinder) implements AclModelInterface {
  getModelId(): number {
    return this.id
  }

  @column({ isPrimary: true })
  declare id: number

  declare avatar: string | null

  @column()
  declare firstname: string | null

  @column()
  declare lastname: string | null

  @computed()
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  }

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare accountStatus: DefaultStatus

  @column()
  declare isEmailVerified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasOne(() => ProfileAdmin)
  declare profile: HasOne<typeof ProfileAdmin>

  @hasMany(() => Role)
  declare roles: HasMany<typeof Role>

  @hasMany(() => Permission)
  declare permissions: HasMany<typeof Permission>
}
