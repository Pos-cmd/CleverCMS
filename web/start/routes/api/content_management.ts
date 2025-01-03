/*
|--------------------------------------------------------------------------
| Content Management routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

/**
|--------------------------------------------------------------------------
| Menu routes
|--------------------------------------------------------------------------
*/
const MenusController = () => import('#controllers/content_management/menu/menus_controller')

export const menuRoute = () =>
  router
    .group(() => {
      router.get('/', [MenusController, 'index']).as('index')
      router.post('/', [MenusController, 'create']).as('create')
      router.get('/:id', [MenusController, 'show']).as('show')
      router.put('/:id', [MenusController, 'update']).as('update')
      router.delete('/:id', [MenusController, 'destroy']).as('destroy')
    })
    .prefix('/menus')
    .as('menus')

/**
|--------------------------------------------------------------------------
| MenuItem routes
|--------------------------------------------------------------------------
*/
const MenuItemsController = () =>
  import('#controllers/content_management/menu/menu_items_controller')

export const menuItemRoute = () =>
  router
    .group(() => {
      router.get('/', [MenuItemsController, 'index']).as('index')
      router.post('/', [MenuItemsController, 'create']).as('create')
      router.get('/:id', [MenuItemsController, 'show']).as('show')
      router.put('/:id', [MenuItemsController, 'update']).as('update')
      router.delete('/:id', [MenuItemsController, 'destroy']).as('destroy')
    })
    .prefix('/menu-items')
    .as('menu-items')

/**
|--------------------------------------------------------------------------
| Page routes
|--------------------------------------------------------------------------
*/
const PagesController = () => import('#controllers/content_management/pages_controller')

export const pageRoute = () =>
  router
    .group(() => {
      router.get('/', [PagesController, 'index']).as('index')
      router.post('/', [PagesController, 'create']).as('create')
      router.get('/:id', [PagesController, 'show']).as('show')
      router.put('/:id', [PagesController, 'update']).as('update')
      router.delete('/:id', [PagesController, 'destroy']).as('destroy')
    })
    .prefix('/pages')
    .as('pages')

/**
|--------------------------------------------------------------------------
| Section routes
|--------------------------------------------------------------------------
*/
const SectionsController = () =>
  import('#controllers/content_management/section/sections_controller')

export const sectionRoute = () =>
  router
    .group(() => {
      router.get('/', [SectionsController, 'index']).as('index')
      router.post('/', [SectionsController, 'create']).as('create')
      router.get('/:id', [SectionsController, 'show']).as('show')
      router.put('/:id', [SectionsController, 'update']).as('update')
      router.delete('/:id', [SectionsController, 'destroy']).as('destroy')
    })
    .prefix('/sections')
    .as('sections')

/**
|--------------------------------------------------------------------------
| Section Type routes
|--------------------------------------------------------------------------
*/
const SectionTypesController = () =>
  import('#controllers/content_management/section/section_types_controller')

export const sectionTypeRoute = () =>
  router
    .group(() => {
      router.get('/', [SectionTypesController, 'index']).as('index')
      router.post('/', [SectionTypesController, 'create']).as('create')
      router.get('/:id', [SectionTypesController, 'show']).as('show')
      router.put('/:id', [SectionTypesController, 'update']).as('update')
      router.delete('/:id', [SectionTypesController, 'destroy']).as('destroy')
    })
    .prefix('/section-types')
    .as('section-types')

/**
|--------------------------------------------------------------------------
| Block routes
|--------------------------------------------------------------------------
*/
const BlocksController = () => import('#controllers/content_management/block/blocks_controller')

export const blockRoute = () =>
  router
    .group(() => {
      router.get('/', [BlocksController, 'index']).as('index')
      router.post('/', [BlocksController, 'create']).as('create')
      router.get('/:id', [BlocksController, 'show']).as('show')
      router.put('/:id', [BlocksController, 'update']).as('update')
      router.delete('/:id', [BlocksController, 'destroy']).as('destroy')
    })
    .prefix('/blocks')
    .as('blocks')

/**
|--------------------------------------------------------------------------
| Block Type routes
|--------------------------------------------------------------------------
*/
const BlockTypesController = () =>
  import('#controllers/content_management/block/block_types_controller')

export const blockTypeRoute = () =>
  router
    .group(() => {
      router.get('/', [BlockTypesController, 'index']).as('index')
      router.post('/', [BlockTypesController, 'create']).as('create')
      router.get('/:id', [BlockTypesController, 'show']).as('show')
      router.put('/:id', [BlockTypesController, 'update']).as('update')
      router.delete('/:id', [BlockTypesController, 'destroy']).as('destroy')
    })
    .prefix('/block-types')
    .as('block-types')

/**
|--------------------------------------------------------------------------
| Seo Meta routes
|--------------------------------------------------------------------------
*/
const SeoMetasController = () => import('#controllers/content_management/seo_metas_controller')

export const seoMetaRoute = () =>
  router
    .group(() => {
      router.get('/', [SeoMetasController, 'index']).as('index')
      router.post('/', [SeoMetasController, 'create']).as('create')
      router.get('/:id', [SeoMetasController, 'show']).as('show')
      router.put('/:id', [SeoMetasController, 'update']).as('update')
      router.delete('/:id', [SeoMetasController, 'destroy']).as('destroy')
    })
    .prefix('/seo-metas')
    .as('seo-metas')
