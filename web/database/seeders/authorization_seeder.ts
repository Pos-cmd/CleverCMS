import { DefaultStatus } from '#enums/default_status'
import User from '#models/user'
import { DEFAULT_PERMISSIONS, DEFAULT_ROLES, type EntityType } from '#types/authorization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { Acl, Permission, Role } from '@holoyan/adonisjs-permissions'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  /**
   * Crée les permissions par défaut pour chaque type d'entité
   */
  private async createPermissions(): Promise<Permission[]> {
    const permissions: Permission[] = []

    for (const entityType in DEFAULT_PERMISSIONS) {
      for (const permission of DEFAULT_PERMISSIONS[entityType as EntityType]) {
        const perm = await Permission.create({
          slug: permission.name,
          title: permission.description,
          entityType: permission.entityType,
          scope: 'default',
          allowed: true,
        })
        permissions.push(perm)
      }
    }

    return permissions
  }

  /**
   * Crée les rôles par défaut
   */
  private async createRoles(): Promise<Role[]> {
    return Promise.all(
      DEFAULT_ROLES.map((role) =>
        Role.create({
          slug: role.name,
          title: role.description,
          entityType: '*',
          scope: 'default',
          allowed: true,
        })
      )
    )
  }

  /**
   * Assigne les permissions aux rôles selon la configuration
   */
  private async assignPermissionsToRoles(roles: Role[]): Promise<void> {
    for (const roleConfig of DEFAULT_ROLES) {
      const role = roles.find((r) => r.slug === roleConfig.name)
      if (!role) continue

      for (const [, permissions] of Object.entries(roleConfig.permissions)) {
        for (const permissionName of permissions) {
          await Acl.role(role).assign(permissionName)
        }
      }
    }
  }

  /**
   * Crée un utilisateur administrateur, son profil et lui assigne le rôle admin
   */
  private async createAdmin(roles: Role[]): Promise<void> {
    const adminRole = roles.find((role) => role.slug === 'admin')
    if (!adminRole) return

    // Création de l'administrateur
    const admin = await User.create({
      email: 'admin@clevercms.com',
      password: 'admin123',
      firstname: 'Afolabi',
      lastname: 'yasser',
      accountStatus: DefaultStatus.ACTIVE,
      isEmailVerified: true,
      createdAt: DateTime.now(),
    })

    // Création du profil administrateur
    await db.table('profile_admins').insert({
      user_id: admin.id,
    })

    // Attribution du rôle admin
    await Acl.model(admin).assignRole(adminRole.slug)

    console.log('Admin created:', admin.email, '- password:', 'admin123')
    console.log('Admin profile created successfully')
  }

  public async run() {
    try {
      console.log('🌱 Starting authorization seeding...')

      const roles = await this.createRoles()
      await this.createPermissions()
      await this.assignPermissionsToRoles(roles)
      await this.createAdmin(roles)

      console.log('✅ Authorization seeding completed successfully')
    } catch (error) {
      console.error('❌ Error during authorization seeding:', error)
      throw error
    }
  }
}
