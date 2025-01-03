import SectionType from '#models/content_management/section_type'
import { ApiResponseService } from '#services/api_response_service'
import { sectionTypeValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SectionTypesController {
  constructor(protected apiService: ApiResponseService) {}

  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const sectionTypes = await SectionType.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(sectionTypes))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const sectionType = await request.validateUsing(sectionTypeValidator)
    await SectionType.create(sectionType)
    return response.created(
      this.apiService.resultSuccess(sectionType, { message: i18n.t('sys.api.sectionType.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const sectionType = await SectionType.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(sectionType))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const sectionType = await SectionType.findOrFail(params.id)
    const data = await request.validateUsing(sectionTypeValidator)
    sectionType.merge(data)
    await sectionType.save()
    return response.ok(
      this.apiService.resultSuccess(sectionType, { message: i18n.t('sys.api.sectionType.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const sectionType = await SectionType.findOrFail(params.id)
    await sectionType.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.sectionType.deleted') })
    )
  }
}
