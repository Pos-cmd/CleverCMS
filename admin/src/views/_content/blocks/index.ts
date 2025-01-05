import { IBasicCollectionType } from '#/model'
import { API } from '@/services/api'

/**
 * Composable pour la gestion des blocs de contenu
 */
export function useBlocks() {
  const selectedKey = ref<number | null>(null)
  
  const { 
    data: blockTypeResult, 
    isLoading, 
    searchValue,
    refetch,
    handleSearch,
    handleClearSearch,
    handlePageChange
  } = API.contentManagement.BlockType.getList()

  const selectedBlock = computed(() => 
    blockTypeResult.value?.data?.find((item) => item.id === selectedKey.value)
  )

  // Sélection automatique du premier bloc
  watch(() => blockTypeResult.value, (value) => {
    if (value?.data?.length) {
      selectedKey.value = value.data[0].id
    }
  }, { immediate: true })

  return {
    selectedKey,
    selectedBlock,
    blockTypeResult,
    isLoading,
    refetch,
    searchValue,
    handleSearch,
    handleClearSearch,
    handlePageChange
  }
}
