import BlockType from '#models/content_management/block_type'
import { ApiResponseService } from '#services/api_response_service'
import { blockTypeValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BlockTypesController {
  constructor(protected apiService: ApiResponseService) {}
  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const blockTypes = await BlockType.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(blockTypes))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const blockType = await request.validateUsing(blockTypeValidator)
    await BlockType.create(blockType)
    return response.created(
      this.apiService.resultSuccess(blockType, { message: i18n.t('sys.api.blockType.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const blockType = await BlockType.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(blockType))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const blockType = await BlockType.findOrFail(params.id)
    const data = await request.validateUsing(blockTypeValidator)
    blockType.merge(data)
    await blockType.save()
    return response.ok(
      this.apiService.resultSuccess(blockType, { message: i18n.t('sys.api.blockType.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const blockType = await BlockType.findOrFail(params.id)
    await blockType.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.blockType.deleted') })
    )
  }
}
