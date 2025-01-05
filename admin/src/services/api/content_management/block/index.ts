import { defineMutation, defineQuery, useMutation, useQuery, useQueryCache } from "@pinia/colada";
import { createBlock, updateBlock, getBlock, getBlockList, deleteBlock, getBlockTypeList, getBlockType, createBlockType, updateBlockType, deleteBlockType } from './api'
import { IGetBlockListParams, IGetBlockTypeListParams, IStoreBlockParams, IStoreBlockTypeParams, IUpdateBlockParams, IUpdateBlockTypeParams } from "./types";
import { $t } from '@/locales'
import { IBlock, IBlockType } from "#/model";

const Block = {
  getList: defineQuery(() => {
    const filterParams = ref<IGetBlockListParams>({
      name: '',
      blockTypeId: undefined,
      page: 1,
      pageSize: 10
    });

    const { state, ...rest } = useQuery({
      key: () => ['blocks', { ...filterParams.value }],
      query: () => getBlockList(filterParams.value),
      placeholderData: (previousData) => previousData,
    })

    const handleSearch = (value: string) => {
      filterParams.value.name = value
    }

    const handleSelectBlockType = (value: number) => {
      filterParams.value.blockTypeId = value
    }

    const handlePageChange = (page: number) => {
      filterParams.value.page = page
    }

    const handlePageSizeChange = (pageSize: number) => {
      filterParams.value.pageSize = pageSize
    }

    return {
      state,
      handleSearch,
      handleSelectBlockType,
      handlePageChange,
      handlePageSizeChange,
      ...rest
    }
  }),
  get: defineQuery(() => {
    const id = ref<number>(0)

    const { state, ...rest } = useQuery({
      key: () => ['blocks', { id: id.value }],
      query: () => getBlock(id.value),
    })

    return {
      id,
      state,
      ...rest
    }
  }),
  create: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: (data: IStoreBlockParams) => createBlock(data),
      onMutate: (data: IStoreBlockParams) => {
        window.$loadingBar.start()
        // return previous blocks to reuse in case of error
        const previousBlocks = queryCache.getQueryData<IBlock[]>(['blocks']) || []
        // add the new block to the list
        queryCache.setQueryData(['blocks'], [...previousBlocks, data])
        // return anything you want to reuse in other hooks
        return { previousBlocks }
      },
      onSuccess: () => {
        window.$loadingBar.finish()
        window.$toast.success($t('sys.common.createSuccess'))
      },
      onError: (error, _variables, { previousBlocks }) => {
        window.$loadingBar.error()
        window.$toast.error(error.message)
        // restore the previous blocks
        queryCache.setQueryData(['blocks'], previousBlocks)
      },
      onSettled: async () => {
        await queryCache.invalidateQueries({ key: ['blocks'], exact: true })
      }
    })
  }),
  update: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: ({id, ...data}: IUpdateBlockParams) => updateBlock(id, data),
      onMutate: ({id, ...data}: IUpdateBlockParams) => {
        window.$loadingBar.start()
        // return previous blocks to reuse in case of error
        const previousBlocks = queryCache.getQueryData<IBlock[]>(['blocks']) || []
        // update the block with the new data
        const updatedBlocks = previousBlocks?.map((block) => block.id === id ? { ...block, ...data } : block)
        queryCache.setQueryData(['blocks'], updatedBlocks)
        // return anything you want to reuse in other hooks
        return { previousBlocks }
      },
      onSuccess: () => {
        window.$loadingBar.finish()
        window.$toast.success($t('sys.common.updateSuccess'))
      },
      onError: (error, _variables, { previousBlocks }) => {
        window.$loadingBar.error()
        window.$toast.error(error.message)
        // restore the previous blocks
        queryCache.setQueryData(['blocks'], previousBlocks)
      },
      onSettled: async () => {
        await queryCache.invalidateQueries({ key: ['blocks'], exact: true })
      }
    })
  }),
  delete: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: (id: number) => deleteBlock(id),
      onMutate: (id: number) => {
        window.$loadingBar.start()
        // return previous blocks to reuse in case of error
        const previousBlocks = queryCache.getQueryData<IBlock[]>(['blocks']) || []
        // remove the deleted block from the list
        const updatedBlocks = previousBlocks?.filter((block) => block.id !== id)
        queryCache.setQueryData(['blocks'], updatedBlocks)
        // return anything you want to reuse in other hooks
        return { previousBlocks }
      },
      onSuccess: () => {
        window.$toast.success($t('sys.common.deleteSuccess'))
      },
      onError: (error, _variables, { previousBlocks }) => {
        window.$toast.error(error.message)
        window.$loadingBar.error()
        // restore the previous blocks
        queryCache.setQueryData(['blocks'], previousBlocks)
      },
      onSettled: async () => {
        await queryCache.invalidateQueries({ key: ['blocks'], exact: true })
      }
    })
  })
}

/**-------------------------------------------------------------------------------------------------- */
/* Logic for BlockType */
/**-------------------------------------------------------------------------------------------------- */
const BlockType = {
  getList: defineQuery(() => {
    const filterParams = ref<IGetBlockTypeListParams>({
      name: undefined,
      // isActive: true,
      page: 1,
      pageSize: 10
    });

    const searchValue = ref<string>('')

    const { state, ...rest } = useQuery({
      key: () => ['blockTypes', { ...filterParams.value }],
      query: () => getBlockTypeList(filterParams.value),
      placeholderData: (previousData) => previousData,
    })

    const handleSearch = () => {
      filterParams.value.name = searchValue.value
    }

    const handleClearSearch = () => {
      searchValue.value = ''
      filterParams.value.name = undefined
    }

    const handlePageChange = (page: number) => {
      const queryCache = useQueryCache()
      const data = queryCache.getQueryData<IBlock[]>(['blockTypes', { ...filterParams.value }])
      console.log({ data })
      filterParams.value.page = page
    }

    const handlePageSizeChange = (pageSize: number) => {
      filterParams.value.pageSize = pageSize
    }

    return {
      state,
      searchValue,
      handleSearch,
      handleClearSearch,
      handlePageChange,
      handlePageSizeChange,
      ...rest
    }
  }),
  get: defineQuery(() => {
    const id = ref<number>(0)

    const { state, ...rest } = useQuery({
      key: () => ['blockTypes', { id: id.value }],
      query: () => getBlockType(id.value),
    })

    return {
      id,
      state,
      ...rest
    }
  }),
  create: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: (data: IStoreBlockTypeParams) => {
        const payLoad = {
          description: data.description || '',
          fields: JSON.stringify(data.fields),
          isActive: data.isActive,
          name: data.name,
          title: data.title
        } as IStoreBlockTypeParams

        return createBlockType(payLoad)
      },
      onMutate: (data: IStoreBlockTypeParams) => {
        window.$loadingBar.start()
        // return previous block types to reuse in case of error
        const previousBlockTypes = queryCache.getQueryData<IBlockType[]>(['blockTypes']) || []
        // add the new block type to the list
        queryCache.setQueryData(['blockTypes'], [...previousBlockTypes, data])
        // return anything you want to reuse in other hooks
        return { previousBlockTypes }
      },
      onSuccess: () => {
        window.$loadingBar.finish()
        window.$toast.success($t('sys.common.createSuccess'))
      },
      onError: (error, _variables, { previousBlockTypes }) => {
        window.$loadingBar.error()
        console.log(error)
        window.$toast.error(error.message)
        // restore the previous block types
        queryCache.setQueryData(['blockTypes'], previousBlockTypes)
      },
      onSettled: async () => {
        await queryCache.invalidateQueries({ key: ['blockTypes'], exact: true })
      }
    })
  }),
  update: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: ({ id, ...data }: IUpdateBlockTypeParams) => {
        const payLoad = {
          description: data.description || '',
          fields: JSON.stringify(data.fields),
          isActive: data.isActive,
          name: data.name,
          title: data.title
        } as IStoreBlockTypeParams

        return updateBlockType(id, payLoad)
      },
      onMutate: ({ id, ...data }: IUpdateBlockTypeParams) => {
        window.$loadingBar.start()
        // return previous block types to reuse in case of error
        const previousBlockTypes = queryCache.getQueryData<IBlockType[]>(['blockTypes']) || []
        // update the block type with the new data
        const updatedBlockTypes = previousBlockTypes?.map((blockType) => blockType.id === id ? { ...blockType, ...data } : blockType)
        queryCache.setQueryData(['blockTypes'], updatedBlockTypes)
        // return anything you want to reuse in other hooks
        return { previousBlockTypes }
      },
      onSuccess: () => {
        window.$loadingBar.finish()
        window.$toast.success($t('sys.common.updateSuccess'))
      },
      onError: (error, _variables, { previousBlockTypes }) => {
        window.$loadingBar.error()
        window.$toast.error(error.message)
        // restore the previous block types
        queryCache.setQueryData(['blockTypes'], previousBlockTypes)
      },
      onSettled: async () => {
        await queryCache.invalidateQueries({ key: ['blockTypes'], exact: true })
      }
    })
  }),
  delete: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: (id: number) => deleteBlockType(id),
      onMutate: (id: number) => {
        window.$loadingBar.start()
        // return previous block types to reuse in case of error
        const previousBlockTypes = queryCache.getQueryData<IBlockType[]>(['blockTypes']) || []
        // remove the deleted block type from the list
        const updatedBlockTypes = previousBlockTypes.filter((blockType) => blockType.id !== id)
        queryCache.setQueryData(['blockTypes'], updatedBlockTypes)
        // return anything you want to reuse in other hooks
        return { previousBlockTypes }
      },
      onSuccess: () => {
        window.$toast.success($t('sys.common.deleteSuccess'))
        window.$loadingBar.finish()
      },
      onError: (error, _variables, { previousBlockTypes }) => {
        window.$toast.error(error.message)
        window.$loadingBar.error()
        // restore the previous block types
        queryCache.setQueryData(['blockTypes'], previousBlockTypes)
      },
      onSettled: async () => {
        await queryCache.invalidateQueries({ key: ['blockTypes'], exact: true })
      }
    })
  }),
  toggleActive: defineMutation(() => {
    const queryCache = useQueryCache()

    return useMutation({
      mutation: (data: { id: number, isActive: boolean }) => updateBlockType(data.id, { isActive: data.isActive }),
      onMutate: () => {
        window.$loadingBar.start()
      },
      onSuccess: () => {
        window.$loadingBar.finish()
        window.$toast.success($t('sys.common.updateSuccess'))
      },
      onError: (error) => {
        window.$loadingBar.error()
        window.$toast.error(error.message)
      },
      onSettled: async (data) => {
        await queryCache.invalidateQueries({ key: ['blockTypes', { id: data?.id }], exact: true })
      }
    })
  })
}

const BlockApi = {
  createBlock,
  updateBlock,
  getBlock,
  getBlockList,
  deleteBlock,
  getBlockTypeList,
  getBlockType,
  createBlockType,
  updateBlockType
}

export { Block, BlockType, BlockApi }
