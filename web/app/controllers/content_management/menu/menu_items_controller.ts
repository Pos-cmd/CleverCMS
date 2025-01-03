import MenuItem from '#models/content_management/menu_item'
import { ApiResponseService } from '#services/api_response_service'
import { menuItemValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MenuItemsController {
  constructor(protected apiService: ApiResponseService) {}

  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const menuItems = await MenuItem.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(menuItems))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const menuItem = await request.validateUsing(menuItemValidator)
    await MenuItem.create(menuItem)
    return response.created(
      this.apiService.resultSuccess(menuItem, { message: i18n.t('sys.api.menuItem.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const menuItem = await MenuItem.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(menuItem))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const menuItem = await MenuItem.findOrFail(params.id)
    const data = await request.validateUsing(menuItemValidator)
    menuItem.merge(data)
    await menuItem.save()
    return response.ok(
      this.apiService.resultSuccess(menuItem, { message: i18n.t('sys.api.menuItem.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const menuItem = await MenuItem.findOrFail(params.id)
    await menuItem.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.menuItem.deleted') })
    )
  }
}
