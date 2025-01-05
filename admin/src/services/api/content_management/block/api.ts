import { defHttp } from "@/services/config";
import { ContentManagementApi } from "../index";
import { IGetBlockListParams, IGetBlockListResult, IGetBlockTypeListParams, IGetBlockTypeListResult, IStoreBlockParams, IStoreBlockTypeParams } from "./types";
import { IBlock, IBlockType } from "#/model";
import { ErrorMessageMode } from "@clever/axios";

enum ApiEnum {
  defautPath = '/content-management',
  BlockPrefix = `${ApiEnum?.defautPath}/blocks`,
  BlockTypePrefix = `${ApiEnum?.defautPath}/block-types`,
}

/**
|--------------------------------------------------------------------------
| Blocks routes
|--------------------------------------------------------------------------
*/

/**
 * @description: get block list
 */
function getBlockList(params: IGetBlockListParams, errorMessageMode: ErrorMessageMode = 'none') {
  return defHttp.get<IGetBlockListResult>(
    {
      url: '',
      params,
    },
    {
      urlPrefix: ApiEnum.BlockPrefix,
      errorMessageMode
    }
  )
}

function getBlock(id: number, errorMessageMode: ErrorMessageMode = 'none') {
  return defHttp.get<IBlock>(
    {
      url: `/${id}`,
    },
    {
      urlPrefix: ApiEnum.BlockPrefix,
      errorMessageMode
    }
  )
}

function createBlock(params: IStoreBlockParams, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.post<IBlock>(
    {
      url: '',
      params,
    },
    {
      urlPrefix: ApiEnum.BlockPrefix,
      errorMessageMode
    }
  )
}

function updateBlock(id: number, params: Partial<IStoreBlockParams>, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.put<IBlock>(
    {
      url: `/${id}`,
      params,
    },
    {
      urlPrefix: ApiEnum.BlockPrefix,
      errorMessageMode
    }
  )
}

function deleteBlock(id: number, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.delete<void>(
    {
      url: `/${id}`,
    },
    {
      urlPrefix: ApiEnum.BlockPrefix,
      errorMessageMode
    }
  )
}

/**
|--------------------------------------------------------------------------
| Blocks Types routes
|--------------------------------------------------------------------------
*/
function getBlockTypeList(params: IGetBlockTypeListParams,errorMessageMode: ErrorMessageMode = 'none') {
  return defHttp.get<IGetBlockTypeListResult>(
    {
      url: '',
      params,
    },
    {
      urlPrefix: ApiEnum.BlockTypePrefix,
      errorMessageMode
    }
  )
}

function getBlockType(id: number, errorMessageMode: ErrorMessageMode = 'none') {
  return defHttp.get<IBlockType>(
    {
      url: `/${id}`,
    },
    {
      urlPrefix: ApiEnum.BlockTypePrefix,
      errorMessageMode
    }
  )
}

function createBlockType(params: IStoreBlockTypeParams, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.post<IBlockType>(
    {
      url: '',
      params,
    },
    {
      urlPrefix: ApiEnum.BlockTypePrefix,
      errorMessageMode
    }
  )
}

function updateBlockType(id: number, params: Partial<IStoreBlockTypeParams>, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.put<IBlockType>(
    {
      url: `/${id}`,
      params,
    },
    {
      urlPrefix: ApiEnum.BlockTypePrefix,
      errorMessageMode
    }
  )
}

function deleteBlockType(id: number, errorMessageMode: ErrorMessageMode = 'modal') {
  return defHttp.delete<void>(
    {
      url: `/${id}`,
    },
    {
      urlPrefix: ApiEnum.BlockTypePrefix,
      errorMessageMode
    }
  )
}

export {
  /** Block */
  getBlockList,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock,

  /** Block Type */
  getBlockTypeList,
  getBlockType,
  createBlockType,
  updateBlockType,
  deleteBlockType,
}
