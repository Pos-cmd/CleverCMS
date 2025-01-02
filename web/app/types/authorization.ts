export type EntityType = 'User' | 'Content' | 'Profile' | '*'

export type Permission = {
  name: string
  description: string
  entityType: EntityType
}

export type Role = {
  name: string
  description: string
  permissions: Record<EntityType, string[]>
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export const DEFAULT_PERMISSIONS: Record<EntityType, Permission[]> = {
  'User': [
    { name: 'create-user', description: 'Create users', entityType: 'User' },
    { name: 'read-user', description: 'View users', entityType: 'User' },
    { name: 'update-user', description: 'Update users', entityType: 'User' },
    { name: 'delete-user', description: 'Delete users', entityType: 'User' },
  ],
  'Content': [
    { name: 'create-content', description: 'Create content', entityType: 'Content' },
    { name: 'read-content', description: 'View content', entityType: 'Content' },
    { name: 'update-content', description: 'Update content', entityType: 'Content' },
    { name: 'delete-content', description: 'Delete content', entityType: 'Content' },
  ],
  'Profile': [
    { name: 'read-profile', description: 'View profile', entityType: 'Profile' },
    { name: 'update-profile', description: 'Update profile', entityType: 'Profile' },
  ],
  '*': [{ name: 'manage-all', description: 'Manage everything', entityType: '*' }],
}

export const DEFAULT_ROLES: Role[] = [
  {
    name: 'admin',
    description: 'Administrator',
    permissions: {
      '*': ['manage-all'],
      'User': ['create-user', 'read-user', 'update-user', 'delete-user'],
      'Content': ['create-content', 'read-content', 'update-content', 'delete-content'],
      'Profile': ['read-profile', 'update-profile'],
    },
  },
  {
    name: 'user',
    description: 'Regular User',
    permissions: {
      'Content': ['read-content'],
      'Profile': ['read-profile', 'update-profile'],
      'User': [],
      '*': [],
    },
  },
]
