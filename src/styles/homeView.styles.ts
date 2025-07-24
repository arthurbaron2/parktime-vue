import { DISNEY_STUDIOS_ID, DISNEYLAND_PARK_ID } from '@/utils/constants'
import { cva } from 'class-variance-authority'

export const disneylandParkRadient = 'bg-gradient-to-r from-violet-500 to-indigo-500'
export const disneylandStudiosRadient = 'bg-gradient-to-r from-cyan-500 to-teal-500'
export const allParksRadient = 'bg-gradient-to-r from-blue-500 to-sky-500'

export const buttonClass = cva(
  'flex-1 p-4 text-sm rounded-xl text-white shadow-lg shadow-slate-900/20 transition-all duration-200 text-shadow-sm text-shadow-slate-900/50',
  {
    variants: {
      active: {
        true: 'ring-2 ring-slate-300',
        false: '',
      },
      park: {
        [DISNEYLAND_PARK_ID]: '',
        [DISNEY_STUDIOS_ID]: '',
        ALL: '',
      },
    },
    compoundVariants: [
      {
        active: false,
        park: DISNEYLAND_PARK_ID,
        class: disneylandParkRadient,
      },
      {
        active: false,
        park: DISNEY_STUDIOS_ID,
        class: disneylandStudiosRadient,
      },
      {
        active: false,
        park: 'ALL',
        class: allParksRadient,
      },
    ],
  },
)
