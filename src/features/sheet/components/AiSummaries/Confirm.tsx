import useSWR from 'swr'
import { Accordion } from '@/components/layout/Accordion'
import { Modal } from '@/components/layout/Modal'
import { CourseId } from '@/types/user'
import { fetcher } from '@/libs/swr'
import { Book } from '@/types/book'
import { uniq } from '@/utils/array'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export type DetailSettings = {
  months: string[]
  categories: string[]
}

interface Props {
  open: boolean
  onCancel: () => void
  onConfirm: (settings: DetailSettings) => void
  courseId: CourseId
  sheetName: string
  books: Book[]
}

export const Confirm: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  courseId,
  sheetName,
  books,
}) => {
  const MAX_TOKEN = 10000
  const initialMonths = uniq(
    books.filter((b) => b.finished).map((b) => dayjs(b.finished).month() + 1)
  )
  const initialCategories = uniq(books.map((book) => book.category))
  const [months, setMonths] = useState(initialMonths)
  const [categories, setCategories] = useState(initialCategories)

  const { data: total, isLoading: isLoadingTotal } = useSWR(
    `/api/token?sheetName=${sheetName}&isTotal=0`,
    fetcher
  )
  const { data, mutate, isLoading } = useSWR(`/api/token`, (url) =>
    fetcher(url, {
      sheetName,
      isTotal: '0',
      months: months.join(','),
      categories: categories.join(','),
    })
  )
  useEffect(() => {
    mutate(
      `/api/token?sheetName=${sheetName}&isTotal=0&months=${months.join(',')}&categories=${categories.join(',')}`
    )
  }, [months, categories])
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="w-full rounded-md p-6 sm:w-[450px] sm:p-10">
        <div className="mb-2 text-center text-sm font-bold leading-5">
          今月の残りトークン数：
          <span className="">
            {isLoadingTotal ? ' ...' : MAX_TOKEN - total?.used_token}/
            {MAX_TOKEN}
          </span>
          <br />
          分析に必要なトークン数：
          <span className="">
            {isLoading || !data?.token ? ' ...' : data.token}
          </span>
        </div>
        <div className="mb-2 text-center text-sm font-bold">
          AI分析を実行しますか？
        </div>
        <div className="mb-2 flex items-center justify-evenly">
          <button
            className="w-[90px] rounded-md border bg-gray-400 py-2 text-xs text-white hover:brightness-110 sm:w-[130px] sm:text-sm"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button
            className="w-[90px] rounded-md border border-ai py-2 text-xs text-ai hover:brightness-125 sm:w-[130px] sm:text-sm"
            onClick={() => onConfirm({ months: months, categories })}
          >
            OK
          </button>
        </div>
        <button className="mb-2 text-center text-xs text-blue-400 underline">
          アップグレードして最大トークン数を上げる
        </button>
        <Accordion title="詳細設定" className="text-sm">
          <div className="p-2 text-left">
            <div className="mb-2 flex justify-start">
              <div className="w-20 text-nowrap font-bold">読了日</div>
              <div className="grid grid-cols-3 sm:grid-cols-3">
                {initialMonths.map((month) => (
                  <div key={month} className="pb-1 pr-2">
                    <input
                      type="checkbox"
                      name={month}
                      id={month}
                      value={month}
                      className="mr-2 cursor-pointer"
                      checked={months.includes(month)}
                      onChange={(e) => {
                        const month = Number(e.target.value)
                        if (months.includes(month)) {
                          setMonths(months.filter((v) => v != month))
                        } else {
                          setMonths([...months, month])
                        }
                      }}
                    />
                    <label
                      htmlFor={month}
                      className="cursor-pointer select-none"
                    >
                      {month}月
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-2 flex">
              <div className="w-20 text-nowrap font-bold">カテゴリ</div>
              <div className="grid grid-cols-2">
                {initialCategories.map((category) => (
                  <div key={category} className="pb-1 pr-2">
                    <input
                      type="checkbox"
                      name={category}
                      id={category}
                      value={category}
                      className="mr-2 cursor-pointer"
                      checked={categories.includes(category)}
                      onChange={(e) => {
                        setCategories(
                          categories.filter((v) => v != e.target.value)
                        )
                      }}
                    />
                    <label
                      htmlFor={category}
                      className="cursor-pointer select-none"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    </Modal>
  )
}
