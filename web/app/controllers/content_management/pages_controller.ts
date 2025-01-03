import Page from '#models/content_management/page'
import { ApiResponseService } from '#services/api_response_service'
import { pageValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PagesController {
  constructor(protected apiService: ApiResponseService) {}
  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)

    const pages = await Page.query().paginate(request.input('page', 1), pageSize)

    return response.ok(this.apiService.resultSuccess(pages))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const page = await request.validateUsing(pageValidator)

    await Page.create(page)

    return response.created(
      this.apiService.resultSuccess(page, { message: i18n.t('sys.api.page.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    return response.ok(this.apiService.resultSuccess(page))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    const data = await request.validateUsing(pageValidator)

    page.merge(data)

    await page.save()

    return response.ok(
      this.apiService.resultSuccess(page, { message: i18n.t('sys.api.page.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    await page.delete()

    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.page.deleted') })
    )
  }

  public async attachSection({ request, response, i18n, params }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    const sectionId = request.input('sectionId')

    await page.related('sections').attach(sectionId)

    return response.ok(
      this.apiService.resultSuccess(page, { message: i18n.t('sys.api.page.sectionAttached') })
    )
  }

  public async detachSection({ request, response, i18n, params }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    const sectionId = request.input('sectionId')

    await page.related('sections').detach(sectionId)

    return response.ok(
      this.apiService.resultSuccess(page, { message: i18n.t('sys.api.page.sectionDetached') })
    )
  }
}
