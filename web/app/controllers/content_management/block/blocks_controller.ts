import Block from '#models/content_management/block'
import { ApiResponseService } from '#services/api_response_service'
import { blockValidator } from '#validators/content_management'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class BlocksController {
  constructor(protected apiService: ApiResponseService) {}
  public async index({ request, response }: HttpContext) {
    const pageSize = request.input('pageSize', 10)
    const blocks = await Block.query().paginate(request.input('page', 1), pageSize)
    return response.ok(this.apiService.resultSuccess(blocks))
  }

  public async create({ request, response, i18n }: HttpContext) {
    const block = await request.validateUsing(blockValidator)
    await Block.create(block)
    return response.created(
      this.apiService.resultSuccess(block, { message: i18n.t('sys.api.block.created') })
    )
  }

  public async show({ params, response }: HttpContext) {
    const block = await Block.findOrFail(params.id)
    return response.ok(this.apiService.resultSuccess(block))
  }

  public async update({ request, response, i18n, params }: HttpContext) {
    const block = await Block.findOrFail(params.id)
    const data = await request.validateUsing(blockValidator)
    block.merge(data)
    await block.save()
    return response.ok(
      this.apiService.resultSuccess(block, { message: i18n.t('sys.api.block.updated') })
    )
  }

  public async destroy({ response, i18n, params }: HttpContext) {
    const block = await Block.findOrFail(params.id)
    await block.delete()
    return response.ok(
      this.apiService.resultSuccess(null, { message: i18n.t('sys.api.block.deleted') })
    )
  }
}
