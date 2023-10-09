import { Book } from '@/types/book'
import { useEffect, useState } from 'react'
import { useReward } from 'react-rewards'
import { truncate } from '@/utils/string'
import { SuccessAlert } from '@/components/label/SuccessAlert'
import { Loading } from '@/components/icon/Loading'
import { YearlyTopBook } from '@/types/book'
import { Modal } from '@/components/layout/Modal'

interface Props {
  books: Book[]
  year: string
  order: number
  open: boolean
  onClose: () => void
  yearlyTopBooks: YearlyTopBook[]
}
export const YearlyTopBooksModal: React.FC<Props> = ({
  yearlyTopBooks,
  open,
  onClose,
  year,
  order,
  books,
}) => {
  const [current, setCurrent] = useState<YearlyTopBook>(null)
  const [selectItem, setSelectItem] = useState<Book>(null)
  const [loading, setLoading] = useState(false)
  const { reward, isAnimating } = useReward('rewardId', 'balloons', {
    lifetime: 200,
    spread: 100,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!yearlyTopBooks) return
    const current = yearlyTopBooks.filter((book) => book.order === order).pop()
    setCurrent(current)
    if (current) {
      const b = books.filter((book) => book.id === current.book.id).pop()
      setSelectItem(books.filter((book) => book.id === current.book.id).pop())
    } else {
      setSelectItem(null)
    }
  }, [order, year])

  const onClickSet = async () => {
    setLoading(true)
    if (selectItem) {
      // 新規で設定
      const res = await fetch(`/api/yearly`, {
        method: 'POST',
        body: JSON.stringify({ bookId: selectItem.id, year, order }),
        headers: {
          Accept: 'application/json',
        },
      }).then((res) => res.json())
      setMessage(`『${selectItem.title}』を${order}位に設定しました`)
    } else {
      // 現在の設定を削除
      const current = yearlyTopBooks
        .filter((book) => book.order === order)
        .pop()
      const res = await fetch(`/api/yearly`, {
        method: 'DELETE',
        body: JSON.stringify({ bookId: current.book.id, year, order }),
        headers: {
          Accept: 'application/json',
        },
      }).then((res) => res.json())
      setMessage(`『${order}位の設定を削除しました`)
    }
    reward()
    setLoading(false)
  }

  return (
    <Modal open={open} onClose={onClose} className="sm:w-2/3 h-3/4">
      <div className="p-4 h-full">
        <h2 className="mb-4 font-bold text-center text-2xl shrink-0">
          {year}年ベスト<span className="underline">{order}位</span>を設定
        </h2>
        <div className="w-full text-gray-900 p-4 flex flex-wrap justify-center overflow-y-auto h-full pb-12">
          {books.map((book, i: number) => {
            return (
              <div
                className={`w-3/4 sm:w-[200px] border border-gray-300 m-2 px-4 py-2 rounded-md shadow cursor-pointer hover:bg-gray-100 ${
                  selectItem?.id === book.id
                    ? 'bg-pink-200 hover:bg-pink-200'
                    : 'bg-white'
                }`}
                key={book.id}
                onClick={() =>
                  setSelectItem(selectItem?.id === book.id ? null : book)
                }
              >
                <div className="font-bold mb-1">{truncate(book.title, 15)}</div>
                <div className="text-xs mb-1">{book.author}</div>
                <img
                  className="m-auto mb-1 h-[150px] object-contain"
                  src={book.image}
                  alt={book.title}
                  loading="lazy"
                />
                <div className="text-sm">{truncate(book.memo, 30)}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-full text-center h-[50px] flex items-center justify-center shrink-0">
        {isAnimating && message && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-32 sm:bottom-28 z-20">
            <SuccessAlert
              open={true}
              text={message}
              onClose={() => setSelectItem(null)}
            />
          </div>
        )}
        <button
          className="font-bold text-white flex items-center disabled:font-medium w-full h-full justify-center disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 rounded-b-md z-10"
          onClick={onClickSet}
          disabled={!selectItem && !current}
        >
          {loading && (
            <Loading className="w-[18px] h-[18px] border-[3px] mr-2 border-white" />
          )}
          <span id="rewardId">設定する</span>
        </button>
      </div>
    </Modal>
  )
}
