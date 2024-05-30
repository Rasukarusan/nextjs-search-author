import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Container } from '@/components/layout/Container'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SearchBox } from '@/components/input/SearchBox/SearchBox'
import { Logo } from '@/components/icon/Logo'
import { useAtomValue, useSetAtom } from 'jotai'
import { pusherAtom, pusherConnectionAtom } from '@/store/pusher/atom'
import { twMerge } from 'tailwind-merge'
import { openLoginModalAtom } from '@/store/modal/atom'
import { UserMenu } from './UserMenu'

// レスポンシブヘッダー
export const Header = () => {
  const router = useRouter()
  const dropdownRef = useRef(null)
  const { data: session } = useSession()
  const setOpen = useSetAtom(openLoginModalAtom)
  const [openMenu, setOpenMenu] = useState(false)
  const pusher = useAtomValue(pusherAtom)
  const pusherConnection = useAtomValue(pusherConnectionAtom)

  /**
   * 画面上をクリックしたらメニューを非表示
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (router.asPath.startsWith('/auth/init')) {
    return null
  }

  return (
    <>
      <div className="fixed top-0 z-50 w-full bg-main text-white">
        <Container className="flex items-center p-2">
          <Link href="/" className="mr-4 no-underline">
            <Logo className="h-8 w-8" />
          </Link>
          <SearchBox />
          <div className="flex-grow"></div>
          {session && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="h-[34px] w-[34px] rounded-full bg-gray-200 sm:mr-4 sm:h-[40px] sm:w-[40px]"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <img
                  src={session.user.image}
                  alt="ユーザーアイコン"
                  className="rounded-full"
                />
              </button>
              <div
                className={twMerge(
                  'absolute right-0 top-1 h-2 w-2 rounded-full bg-gray-400 text-white sm:right-4 sm:top-1',
                  pusherConnection === 'connected' && 'bg-green-600',
                  pusherConnection === 'failed' && 'bg-red-500',
                  pusherConnection === 'disconnected' && 'bg-gray-400'
                )}
              ></div>
              <UserMenu open={openMenu} setOpen={setOpenMenu} />
            </div>
          )}
          {session === null && (
            <>
              <button
                className="rounded-md px-4 py-2 text-xs font-bold text-gray-700 sm:px-5 sm:py-2 sm:text-sm"
                onClick={() => setOpen(true)}
              >
                ログイン
              </button>
            </>
          )}
        </Container>
      </div>
      <div style={{ marginBottom: '70px' }}></div>
    </>
  )
}
