import { MenuLocationEnum, MenuTargetEnum } from '#enums/menu'
import vine from '@vinejs/vine'

const slug = vine
  .string()
  .minLength(4)
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

/*
|--------------------------------------------------------------------------
| SeoMeta Validator
|--------------------------------------------------------------------------
|
| The SeoMeta Validator is used to validate the data sent to the seoMetaController.
|
*/
export const seoMetaValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(4).maxLength(60).trim(),
    description: vine.string().minLength(4).maxLength(160).trim(),
    keywords: vine.string().minLength(4).trim(),
    robots: vine.string().optional(),
    canonical: vine.string().url().optional(),
    ogTitle: vine.string().maxLength(60).optional(),
    ogDescription: vine.string().maxLength(160).optional(),
    ogImage: vine.string().url().optional(),
    ogUrl: vine.string().url().optional(),
    ogType: vine.string().optional(),
    ogSiteName: vine.string().optional(),
    ogLocale: vine.string().optional(),
    ogAuthor: vine.string().optional(),
    twitterCard: vine.string().optional(),
    twitterTitle: vine.string().maxLength(60).optional(),
  })
)

/*
|--------------------------------------------------------------------------
| Page Validator
|--------------------------------------------------------------------------
|
| The Page Validator is used to validate the data sent to the pageController.
|
*/
export const pageValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(4).trim(),
    title: vine.string().minLength(4).trim(),
    slug,
  })
)

/*
|--------------------------------------------------------------------------
| Section Validator
|--------------------------------------------------------------------------
*/
export const sectionValidator = vine.compile(
  vine.object({
    sectionTypeId: vine.number(),
    name: vine.string().minLength(4).trim(),
    title: vine.string().minLength(4).trim(),
    slug,
    content: vine.string(),
    isActive: vine.boolean(),
    order: vine.number().positive(),
  })
)

/*
|--------------------------------------------------------------------------
| SectionType Validator
|--------------------------------------------------------------------------
*/
export const sectionTypeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(4).trim(),
    description: vine.string().trim(),
    fields: vine.string(),
    isActive: vine.boolean(),
  })
)

/*
|--------------------------------------------------------------------------
| Menu Validator
|--------------------------------------------------------------------------
*/
export const menuValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(4).trim(),
    slug,
    description: vine.string().trim(),
    location: vine.enum(MenuLocationEnum),
    isActive: vine.boolean(),
  })
)

/*
|--------------------------------------------------------------------------
| MenuItem Validator
|--------------------------------------------------------------------------
*/
export const menuItemValidator = vine.compile(
  vine.object({
    menuId: vine.number(),
    parentId: vine.number().optional(),
    pageId: vine.number().optional(),
    name: vine.string().minLength(4).trim(),
    title: vine.string().minLength(4).trim(),
    slug,
    url: vine.string().url().optional(),
    target: vine.enum(MenuTargetEnum).optional(),
    isActive: vine.boolean(),
    order: vine.number().positive(),
  })
)

/*
|--------------------------------------------------------------------------
| Block Validator
|--------------------------------------------------------------------------
*/
export const blockValidator = vine.compile(
  vine.object({
    blockTypeId: vine.number(),
    sectionId: vine.number(),
    name: vine.string().minLength(4).trim(),
    title: vine.string().minLength(4).trim(),
    slug,
    content: vine.string(),
    isActive: vine.boolean(),
    order: vine.number().positive(),
  })
)

/*
|--------------------------------------------------------------------------
| BlockType Validator
|--------------------------------------------------------------------------
*/
export const blockTypeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(4).trim(),
    description: vine.string(),
    fields: vine.string(),
    isActive: vine.boolean(),
  })
)

/*
|--------------------------------------------------------------------------
| PageSection Validator
|--------------------------------------------------------------------------
*/
export const pageSectionValidator = vine.compile(
  vine.object({
    pageId: vine.number(),
    sectionId: vine.number(),
    isActive: vine.boolean(),
    order: vine.number().positive(),
    customContent: vine.string().optional(),
  })
)
