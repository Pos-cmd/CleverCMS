export interface IBasicPaginateMeta {
  meta: {
    links: {
      first: string
      last: string
      prev: string
      next: string
    }
    currentPage: number
    perPage: number
    total: number
    lastPage: number
  }
}

export interface IBasicLazyPaginateMeta<T, K = any> {
  links: {
    url: string
    label: string
    active: boolean
  }[]
  data: T[]
  meta: {
    currentPage: number
    firstPageUrl: string
    lastPage: number
    lastPageUrl: string
    nextPageUrl: string
    path: string
    perPage: number
    prevPageUrl: string
    to: number
    total: number
    extra: K
  }
}

export interface IBasicFetchParams {
  pageSize?: number | '*'
  page?: number
  include?: string[]
}
