import type { Interest, Park } from '@/types/park.types'

export const DISNEYLAND_PARK_ID = 'dae968d5-630d-4719-8b06-3d107e944401'
export const DISNEYLAND_RESORT_ID = 'e8d0207f-da8a-4048-bec8-117aa946b2c2'
export const DISNEY_STUDIOS_ID = 'ca888437-ebb4-4d50-aed2-d227f7096968'
export const ASTERIX_PARK_ID = '9e938687-fd99-46f3-986a-1878210378f8'
export const EUROPA_PARK_RESORT_ID = '85e3b542-af91-4f8a-8d28-445868a7c8fd'
export const EUROPA_PARK_ID = '639738d3-9574-4f60-ab5b-4c392901320b'
export const RULANTICA_ID = '58392c29-d79d-49e4-9c35-0100d417d24e'
export const WALIBI_RHONE_ALPES_PARK_ID = 'f9497403-adf3-4409-bd79-bb5b54000e45'
export const FUTUROSCOPE_ID = '46ad6ab4-90db-4c39-b9a4-be833266c210'

export const PARKS: Park[] = [
  {
    id: 'disneyland-paris',
    parkId: DISNEYLAND_PARK_ID,
    parkName: 'Disneyland Paris',
    parentParkId: DISNEYLAND_RESORT_ID,
    showInResortSelection: false,
    showInParkFilter: true,
    timezone: 'Europe/Paris',
  },
  {
    id: 'disneyland-paris-resort',
    parkId: DISNEYLAND_RESORT_ID,
    parkName: 'Disneyland Paris Resort',
    childParksIds: [DISNEYLAND_PARK_ID, DISNEY_STUDIOS_ID],
    showInResortSelection: true,
    showInParkFilter: true,
    timezone: 'Europe/Paris',
  },
  {
    id: 'walt-disney-studios',
    parkId: DISNEY_STUDIOS_ID,
    parkName: 'Walt Disney Studios',
    parentParkId: DISNEYLAND_RESORT_ID,
    showInResortSelection: false,
    showInParkFilter: true,
    timezone: 'Europe/Paris',
  },
  {
    id: 'asterix-park',
    parkId: ASTERIX_PARK_ID,
    parkName: 'Parc Asterix',
    showInResortSelection: true,
    showInParkFilter: true,
    timezone: 'Europe/Paris',
  },
  {
    id: 'europa-park',
    parkId: EUROPA_PARK_ID,
    parkName: 'Europa Park',
    showInResortSelection: true,
    showInParkFilter: true,
    timezone: 'Europe/Berlin',
  },
  {
    id: 'rulantica',
    parkId: RULANTICA_ID,
    parkName: 'Rulantica',
    showInResortSelection: true,
    showInParkFilter: true,
    timezone: 'Europe/Berlin',
  },
  {
    id: 'walibi-rhone-alpes',
    parkId: WALIBI_RHONE_ALPES_PARK_ID,
    parkName: 'Walibi Rhône Alpes',
    showInResortSelection: true,
    showInParkFilter: true,
    timezone: 'Europe/Paris',
  },
  {
    id: 'futuroscope',
    parkId: FUTUROSCOPE_ID,
    parkName: 'Futuroscope',
    showInResortSelection: true,
    showInParkFilter: true,
    timezone: 'Europe/Paris',
  },
]

export const interests: Record<string, Interest> = {
  roller_coaster: {
    name: 'Roller coaster',
    color: 'bg-green-500/20 text-green-950',
  },
  extreme_rides: {
    name: 'Extreme',
    color: 'bg-amber-500/20 text-amber-950',
  },
  water_ride: {
    name: 'Water ride',
    color: 'bg-blue-500/20 text-blue-950',
  },
  dark_ride: {
    name: 'Dark ride',
    color: 'bg-purple-500/20 text-purple-950',
  },
  family_ride: {
    name: 'Family experience',
    color: 'bg-yellow-500/20 text-yellow-950',
  },
  flat_ride: {
    name: 'Flat ride',
    color: 'bg-red-500/20 text-red-950',
  },
  kiddie_ride: {
    name: 'Addapted to kids',
    color: 'bg-pink-500/20 text-pink-950',
  },
  spin_ride: {
    name: 'Spinning',
    color: 'bg-orange-500/20 text-orange-950',
  },
  single_rider: {
    name: 'Single rider service',
    color: 'bg-gray-500/20 text-gray-950',
  },
  water_splash: {
    name: 'Water splashing',
    color: 'bg-cyan-500/20 text-cyan-950',
  },
  playground: {
    name: 'Playground',
    color: 'bg-green-500/20 text-green-950',
  },
  walking_ride: {
    name: 'Walking experience',
    color: 'bg-blue-500/20 text-blue-950',
  },
  transport_ride: {
    name: 'Transport ride',
    color: 'bg-gray-500/20 text-gray-950',
  },
  themed_experience: {
    name: 'Immersive experience',
    color: 'bg-purple-500/20 text-purple-950',
  },
}
