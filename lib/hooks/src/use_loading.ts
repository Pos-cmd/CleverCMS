import useBoolean from './use_boolean'

/**
 * Loading
 *
 * @param initValue Init value
 */
export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue)

  return {
    loading,
    startLoading,
    endLoading,
  }
}
