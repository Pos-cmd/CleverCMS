export type EntityType =
  | 'User'
  | 'Profile'
  | 'Page'
  | 'Menu'
  | 'MenuItem'
  | 'Section'
  | 'SectionType'
  | 'Block'
  | 'BockType'
  | 'SeoMeta'
  | '*'

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
  'Profile': [
    { name: 'read-profile', description: 'View profile', entityType: 'Profile' },
    { name: 'update-profile', description: 'Update profile', entityType: 'Profile' },
  ],
  'Page': [
    { name: 'create-page', description: 'Create pages', entityType: 'Page' },
    { name: 'read-page', description: 'View pages', entityType: 'Page' },
    { name: 'update-page', description: 'Update pages', entityType: 'Page' },
    { name: 'delete-page', description: 'Delete pages', entityType: 'Page' },
  ],
  'Menu': [
    { name: 'create-menu', description: 'Create menus', entityType: 'Menu' },
    { name: 'read-menu', description: 'View menus', entityType: 'Menu' },
    { name: 'update-menu', description: 'Update menus', entityType: 'Menu' },
    { name: 'delete-menu', description: 'Delete menus', entityType: 'Menu' },
  ],
  'MenuItem': [
    { name: 'create-menu-item', description: 'Create menu items', entityType: 'MenuItem' },
    { name: 'read-menu-item', description: 'View menu items', entityType: 'MenuItem' },
    { name: 'update-menu-item', description: 'Update menu items', entityType: 'MenuItem' },
    { name: 'delete-menu-item', description: 'Delete menu items', entityType: 'MenuItem' },
  ],
  'Section': [
    { name: 'create-section', description: 'Create sections', entityType: 'Section' },
    { name: 'read-section', description: 'View sections', entityType: 'Section' },
    { name: 'update-section', description: 'Update sections', entityType: 'Section' },
    { name: 'delete-section', description: 'Delete sections', entityType: 'Section' },
  ],
  'SectionType': [
    { name: 'create-section-type', description: 'Create section types', entityType: 'SectionType' },
    { name: 'read-section-type', description: 'View section types', entityType: 'SectionType' },
    { name: 'update-section-type', description: 'Update section types', entityType: 'SectionType' },
    { name: 'delete-section-type', description: 'Delete section types', entityType: 'SectionType' },
  ],
  'Block': [
    { name: 'create-block', description: 'Create blocks', entityType: 'Block' },
    { name: 'read-block', description: 'View blocks', entityType: 'Block' },
    { name: 'update-block', description: 'Update blocks', entityType: 'Block' },
    { name: 'delete-block', description: 'Delete blocks', entityType: 'Block' },
  ],
  'BockType': [
    { name: 'create-block-type', description: 'Create block types', entityType: 'BockType' },
    { name: 'read-block-type', description: 'View block types', entityType: 'BockType' },
    { name: 'update-block-type', description: 'Update block types', entityType: 'BockType' },
    { name: 'delete-block-type', description: 'Delete block types', entityType: 'BockType' },
  ],
  'SeoMeta': [
    { name: 'create-seo-meta', description: 'Create SEO metadata', entityType: 'SeoMeta' },
    { name: 'read-seo-meta', description: 'View SEO metadata', entityType: 'SeoMeta' },
    { name: 'update-seo-meta', description: 'Update SEO metadata', entityType: 'SeoMeta' },
    { name: 'delete-seo-meta', description: 'Delete SEO metadata', entityType: 'SeoMeta' },
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
      'Profile': ['read-profile', 'update-profile'],
      'Page': ['create-page', 'read-page', 'update-page', 'delete-page'],
      'Menu': ['create-menu', 'read-menu', 'update-menu', 'delete-menu'],
      'MenuItem': ['create-menu-item', 'read-menu-item', 'update-menu-item', 'delete-menu-item'],
      'Section': ['create-section', 'read-section', 'update-section', 'delete-section'],
      'SectionType': [
        'create-section-type',
        'read-section-type',
        'update-section-type',
        'delete-section-type',
      ],
      'Block': ['create-block', 'read-block', 'update-block', 'delete-block'],
      'BockType': [
        'create-block-type',
        'read-block-type',
        'update-block-type',
        'delete-block-type',
      ],
      'SeoMeta': ['create-seo-meta', 'read-seo-meta', 'update-seo-meta', 'delete-seo-meta'],
    },
  },
  {
    name: 'user',
    description: 'Regular User',
    permissions: {
      '*': [],
      'User': [],
      'Profile': ['read-profile', 'update-profile'],
      'Page': ['read-page'],
      'Menu': ['read-menu'],
      'MenuItem': ['read-menu-item'],
      'Section': ['read-section'],
      'SectionType': ['read-section-type'],
      'Block': ['read-block'],
      'BockType': ['read-block-type'],
      'SeoMeta': ['read-seo-meta'],
    },
  },
]
