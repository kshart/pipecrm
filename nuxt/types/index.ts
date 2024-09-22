
export interface PaginatorQuery {
  /**
   * Страница начиная с 0
   */
  page: number
  /**
   * Колличество записей на странице
   */
  perPage: number
}

export interface Paginator<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}
