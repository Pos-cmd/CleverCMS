import Menu from '#models/content_management/menu'
import { ApiResponseService } from '#services/api_response_service'
import { menuValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MenusController {
  constructor(protected apiService: ApiResponseService) {}

  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const menus = await Menu.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(menus))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const menu = await request.validateUsing(menuValidator)
    await Menu.create(menu)
    return response.created(
      this.apiService.resultSuccess(menu, { message: i18n.t('sys.api.menu.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const menu = await Menu.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(menu))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const menu = await Menu.findOrFail(params.id)
    const data = await request.validateUsing(menuValidator)
    menu.merge(data)
    await menu.save()
    return response.ok(
      this.apiService.resultSuccess(menu, { message: i18n.t('sys.api.menu.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const menu = await Menu.findOrFail(params.id)
    await menu.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.menu.deleted') })
    )
  }
}
