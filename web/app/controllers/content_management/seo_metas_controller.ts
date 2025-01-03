import SeoMeta from '#models/content_management/seo_meta'
import { ApiResponseService } from '#services/api_response_service'
import { seoMetaValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SeoMetasController {
  constructor(protected apiService: ApiResponseService) {}

  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const seoMetas = await SeoMeta.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(seoMetas))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const seoMeta = await request.validateUsing(seoMetaValidator)
    await SeoMeta.create(seoMeta)
    return response.created(
      this.apiService.resultSuccess(seoMeta, { message: i18n.t('sys.api.seoMeta.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const seoMeta = await SeoMeta.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(seoMeta))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const seoMeta = await SeoMeta.findOrFail(params.id)
    const data = await request.validateUsing(seoMetaValidator)
    seoMeta.merge(data)
    await seoMeta.save()
    return response.ok(
      this.apiService.resultSuccess(seoMeta, { message: i18n.t('sys.api.seoMeta.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const seoMeta = await SeoMeta.findOrFail(params.id)
    await seoMeta.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.seoMeta.deleted') })
    )
  }
}
