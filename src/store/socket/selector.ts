import { selector } from 'recoil'
import { socketAtom } from './atom'
import { SelectItems } from './types'
import { NO_IMAGE } from '@/libs/constants'

/**
 * クリップボードにコピーするテキストを取得
 */
const getCopyText = (selectItems: SelectItems): string => {
  let text = ''
  const textList = selectItems.map((item) => {
    const title = item.volumeInfo.title ?? '-'
    const authors = item.volumeInfo.authors?.join(',') ?? '-'
    const categories = item.volumeInfo.categories ?? '-'
    const imageLink = item.volumeInfo.imageLinks
      ? item.volumeInfo.imageLinks.thumbnail
      : NO_IMAGE
    text += title + '\t' + authors + '\t' + categories + '\t' + imageLink + '\n'
  })
  return text
}

/**
 * クリップボードにコピーする用のテキストに変換
 */
export const selectItemsCopyTextSelector = selector({
  key: 'selectItemsCopyTextSelector',
  get: ({ get }) => {
    const selectItems = get(socketAtom)
    return getCopyText(selectItems)
  },
})

/**
 * GASにPOSTするためのリクエストボディに変換
 */
export const selectItemsBodySelector = selector({
  key: 'selectItemsBodySelector',
  get: ({ get }) => {
    const selectItems = get(socketAtom)
    const body = getCopyText(selectItems)
      .split('\n')
      .filter((v) => v)
      .map((item) => {
        const info = item.split('\t')
        const [title, author, category, image] = info
        return {
          year: 2023,
          title,
          author,
          category,
          image,
        }
      })
    return body
  },
})