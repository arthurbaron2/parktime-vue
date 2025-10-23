import {
  DISNEYLAND_PARK_ID,
  DISNEY_STUDIOS_ID,
  DISNEYLAND_RESORT_ID,
  ASTERIX_PARK_ID,
  EUROPA_PARK_ID,
  EUROPA_PARK_RESORT_ID,
  RULANTICA_ID,
  WALIBI_RHONE_ALPES_PARK_ID,
  FUTUROSCOPE_ID,
} from '@/utils/constants'

export type ParkId =
  | typeof DISNEYLAND_PARK_ID
  | typeof DISNEY_STUDIOS_ID
  | typeof DISNEYLAND_RESORT_ID
  | typeof ASTERIX_PARK_ID
  | typeof EUROPA_PARK_ID
  | typeof EUROPA_PARK_RESORT_ID
  | typeof RULANTICA_ID
  | typeof WALIBI_RHONE_ALPES_PARK_ID
  | typeof FUTUROSCOPE_ID

export interface Park {
  id: string
  parkId: ParkId
  parkName: string
  childParksIds?: string[]
  parentParkId?: string
  showInResortSelection: boolean
  showInParkFilter: boolean
}

export interface Interest {
  name: string
  color: string
}

interface AttractionTextDetail {
  key: string
  value: string
  icon: string
  type: 'text'
}

interface AttractionInterestDetail {
  key: string
  icon: string
  type: 'interests'
  value: string[]
}

interface AttractionLinkDetail {
  key: string
  icon: string
  type: 'link'
  value: string
  text: string
}

export type AttractionDetail =
  | AttractionInterestDetail
  | AttractionLinkDetail
  | AttractionTextDetail
