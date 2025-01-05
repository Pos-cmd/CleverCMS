import { IBlock, IBlockType, IField } from '#/model'
import { IBasicFetchParams, IBasicLazyPaginateMeta } from '@/services/api/type'

export interface IGetBlockTypeListParams extends IBasicFetchParams {
  name?: string
  isActive?: boolean
}

export interface IGetBlockTypeListResult extends IBasicLazyPaginateMeta<IBlockType> {}

export interface IStoreBlockTypeParams {
  title: string
  name: string
  description: string
  fields: string | IField[]
  isActive: boolean
}

export interface IUpdateBlockTypeParams extends IStoreBlockTypeParams {
  id: number
}

export interface IGetBlockListParams extends IBasicFetchParams {
  name?: string
  blockTypeId?: number
}

export interface IGetBlockListResult extends IBasicLazyPaginateMeta<IBlock> {}

export interface IStoreBlockParams {
  name: string
  title: string
  slug: string
  blockTypeId: string
  content: Record<string, any>
}

export interface IUpdateBlockParams extends IStoreBlockParams {
  id: number
}
