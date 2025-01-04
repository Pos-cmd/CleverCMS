import Section from '#models/content_management/section'
import { ApiResponseService } from '#services/api_response_service'
import { sectionValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SectionsController {
  constructor(protected apiService: ApiResponseService) {}

  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const sections = await Section.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(sections))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const section = await request.validateUsing(sectionValidator)
    await Section.create(section)
    return response.created(
      this.apiService.resultSuccess(section, { message: i18n.t('sys.api.section.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const section = await Section.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(section))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const section = await Section.findOrFail(params.id)
    const data = await request.validateUsing(sectionValidator)
    section.merge(data)
    await section.save()
    return response.ok(
      this.apiService.resultSuccess(section, { message: i18n.t('sys.api.section.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const section = await Section.findOrFail(params.id)
    await section.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.section.deleted') })
    )
  }

  public async attachBlock({ request, response, i18n, params }: HttpContext) {
    const page = await Section.findOrFail(params.id)

    const blockId = request.input('blockId')

    await page.related('blocks').attach(blockId)

    return response.ok(
      this.apiService.resultSuccess(page, { message: i18n.t('sys.api.page.sectionAttached') })
    )
  }

  public async detachBlock({ request, response, i18n, params }: HttpContext) {
    const page = await Section.findOrFail(params.id)

    const blockId = request.input('blockId')

    await page.related('blocks').detach(blockId)

    return response.ok(
      this.apiService.resultSuccess(page, { message: i18n.t('sys.api.page.sectionDetached') })
    )
  }
}
