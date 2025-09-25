import {
  ASTERIX_PARK_ID,
  DISNEY_STUDIOS_ID,
  DISNEYLAND_PARK_ID,
  DISNEYLAND_RESORT_ID,
  EUROPA_PARK_ID,
  EUROPA_PARK_RESORT_ID,
  FUTUROSCOPE_ID,
  RULANTICA_ID,
  WALIBI_RHONE_ALPES_PARK_ID,
} from '@/utils/constants'
import { cva } from 'class-variance-authority'

export const disneylandParkRadient = 'bg-gradient-to-r from-violet-500 to-indigo-500'
export const disneylandStudiosRadient = 'bg-gradient-to-r from-cyan-500 to-teal-500'
export const disneylandResortRadient = 'bg-gradient-to-r from-blue-500 to-sky-500'
export const asterixParkRadient = 'bg-gradient-to-r from-green-500 to-lime-500'
export const europaParkRadient = 'bg-gradient-to-r from-yellow-500 to-amber-500'
export const europaParkResortRadient = 'bg-gradient-to-r from-yellow-500 to-orange-500'
export const rulanticaParkRadient = 'bg-gradient-to-r from-blue-500 to-indigo-500'
export const walibiRhoneAlpesParkRadient = 'bg-gradient-to-r from-red-500 to-orange-500'
export const futuroscopeParkRadient = 'bg-gradient-to-r from-purple-500 to-pink-500'

export const getRandomGradient = () => {
  const gradients = [
    disneylandParkRadient,
    disneylandStudiosRadient,
    disneylandResortRadient,
    asterixParkRadient,
    europaParkRadient,
    europaParkResortRadient,
    rulanticaParkRadient,
    walibiRhoneAlpesParkRadient,
    futuroscopeParkRadient,
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

export const buttonClass = cva(
  'flex-1 p-4 text-sm flex justify-center items-center text-center rounded-xl cursor-pointer shadow-lg shadow-slate-900/20 transition-all duration-200 text-shadow-lg text-shadow-slate-900/20',
  {
    variants: {
      active: {
        true: 'text-white ring-2 ring-slate-300 bg-slate-50/10',
        false:
          'text-white ring-2 ring-slate-300 hover:text-white hover:ring-slate-300 focus:text-white focus:ring-slate-300',
      },
    },
  },
)

export const parkGradientClass = cva('', {
  variants: {
    park: {
      [DISNEYLAND_PARK_ID]: disneylandParkRadient,
      [DISNEY_STUDIOS_ID]: disneylandStudiosRadient,
      [DISNEYLAND_RESORT_ID]: disneylandResortRadient,
      [ASTERIX_PARK_ID]: asterixParkRadient,
      [EUROPA_PARK_ID]: europaParkRadient,
      [EUROPA_PARK_RESORT_ID]: europaParkResortRadient,
      [RULANTICA_ID]: rulanticaParkRadient,
      [WALIBI_RHONE_ALPES_PARK_ID]: walibiRhoneAlpesParkRadient,
      [FUTUROSCOPE_ID]: futuroscopeParkRadient,
      default: disneylandResortRadient,
    },
  },
})

export const parkButtonClass = cva(
  'flex p-0.5 text-sm rounded-xl cursor-pointer shadow-lg shadow-slate-900/20 transition-all duration-200 text-shadow-sm text-shadow-slate-900/20 hover:[&>span]:bg-slate-700/70',
  {
    variants: {
      active: {
        true: '',
        false: '',
      },
      park: {
        [DISNEYLAND_PARK_ID]: disneylandParkRadient,
        [DISNEY_STUDIOS_ID]: disneylandStudiosRadient,
        [DISNEYLAND_RESORT_ID]: disneylandResortRadient,
        [ASTERIX_PARK_ID]: asterixParkRadient,
        [EUROPA_PARK_ID]: europaParkRadient,
        [EUROPA_PARK_RESORT_ID]: europaParkResortRadient,
        [RULANTICA_ID]: rulanticaParkRadient,
        [WALIBI_RHONE_ALPES_PARK_ID]: walibiRhoneAlpesParkRadient,
        [FUTUROSCOPE_ID]: futuroscopeParkRadient,
      },
    },
  },
)
