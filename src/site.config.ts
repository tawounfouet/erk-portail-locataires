import { IBlock } from '@types'

const env = import.meta.env as Record<string, string | undefined>;

const str = (value: unknown, fallback = ''): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const num = (value: unknown, fallback = 0): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const bool = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value ?? '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'oui'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'non', ''].includes(normalized)) return fallback;
  return fallback;
};

export const startBookingPeriod = str(env.ERK_START_BOOKING_PERIOD);

export const endBookingPeriod = str(env.ERK_END_BOOKING_PERIOD);

export const contacts = {
    /* telephone number for visitors to contact */
    supportTel: '+237 6 90 19 14 04',

    /* email for visitors to contact */
    supportMailInfo: 'info@eureka-residences.com',
    
    supportMailContact: 'contact@eureka-residences.com'
};

export const links = {
    twitter: str(env.ERK_TWITTER),

    x: str(env.ERK_X),

    facebook: str(env.ERK_FACEBOOK),

    youtube: str(env.ERK_YOUTUBE),

    linkedin: str(env.ERK_LINKEDIN),

    instagram: str(env.ERK_INSTAGRAM),
};

/* Static Data */

export const eurekaBlock : IBlock = {
    id: 'residence-eureka',
    name: 'Résidence Eureka',

    totalFloor:  num(env.ERK_EUREKA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_EUREKA_TOTAL_ROOM),

    bReady: bool(env.ERK_EUREKA_B_READY),
    scheduledDate: str(env.ERK_EUREKA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_EUREKA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_EUREKA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_EUREKA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_EUREKA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_EUREKA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_EUREKA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_EUREKA_AVAILABLE_DUO_ROOM_COUNT),
};

export const sigmaBlock : IBlock = {
    id: 'residence-sigma',
    name: 'Résidence Sigma',

    totalFloor:  num(env.ERK_SIGMA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_SIGMA_TOTAL_ROOM),

    bReady: bool(env.ERK_SIGMA_B_READY),
    scheduledDate: str(env.ERK_SIGMA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_SIGMA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_SIGMA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_SIGMA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_SIGMA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_SIGMA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_SIGMA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_SIGMA_AVAILABLE_DUO_ROOM_COUNT),
};

export const gammaBlock : IBlock = {
    id: 'residence-gamma',
    name: 'Résidence Gamma',

    totalFloor:  num(env.ERK_GAMMA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_GAMMA_TOTAL_ROOM),

    bReady: bool(env.ERK_GAMMA_B_READY),
    scheduledDate: str(env.ERK_GAMMA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_GAMMA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_GAMMA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_GAMMA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_GAMMA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_GAMMA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_GAMMA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_GAMMA_AVAILABLE_DUO_ROOM_COUNT),
};

export const deltaBlock : IBlock = {
    id: 'residence-delta',
    name: 'Résidence Delta',

    totalFloor:  num(env.ERK_DELTA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_DELTA_TOTAL_ROOM),

    bReady: bool(env.ERK_DELTA_B_READY),
    scheduledDate: str(env.ERK_DELTA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_DELTA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_DELTA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_DELTA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_DELTA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_DELTA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_DELTA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_DELTA_AVAILABLE_DUO_ROOM_COUNT),
};

export const alphaBlock : IBlock = {
    id: 'residence-alpha',
    name: 'Résidence Alpha',

    totalFloor:  num(env.ERK_ALPHA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_ALPHA_TOTAL_ROOM),

    bReady: bool(env.ERK_ALPHA_B_READY),
    scheduledDate: str(env.ERK_ALPHA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_ALPHA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_ALPHA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_ALPHA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_ALPHA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_ALPHA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_ALPHA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_ALPHA_AVAILABLE_DUO_ROOM_COUNT),
};

export const zetaBlock : IBlock = {
    id: 'residence-zeta',
    name: 'Résidence Zeta',

    totalFloor:  num(env.ERK_ZETA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_ZETA_TOTAL_ROOM),

    bReady: bool(env.ERK_ZETA_B_READY),
    scheduledDate: str(env.ERK_ZETA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_ZETA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_ZETA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_ZETA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_ZETA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_ZETA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_ZETA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_ZETA_AVAILABLE_DUO_ROOM_COUNT),
};

export const phiBlock : IBlock = {
    id: 'residence-phi',
    name: 'Résidence Phi',

    totalFloor:  num(env.ERK_PHI_TOTAL_FLOOR),
    totalRoom: num(env.ERK_PHI_TOTAL_ROOM),

    bReady: bool(env.ERK_PHI_B_READY),
    scheduledDate: str(env.ERK_PHI_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_PHI_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_PHI_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_PHI_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_PHI_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_PHI_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_PHI_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_PHI_AVAILABLE_DUO_ROOM_COUNT),
};

export const kappaBlock : IBlock = {
    id: 'residence-kappa',
    name: 'Résidence Kappa',

    totalFloor:  num(env.ERK_KAPPA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_KAPPA_TOTAL_ROOM),

    bReady: bool(env.ERK_KAPPA_B_READY),
    scheduledDate: str(env.ERK_KAPPA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_KAPPA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_KAPPA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_KAPPA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_KAPPA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_KAPPA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_KAPPA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_KAPPA_AVAILABLE_DUO_ROOM_COUNT),
};

export const thetaBlock : IBlock = {
    id: 'residence-theta',
    name: 'Résidence Theta',

    totalFloor:  num(env.ERK_THETA_TOTAL_FLOOR),
    totalRoom: num(env.ERK_THETA_TOTAL_ROOM),

    bReady: bool(env.ERK_THETA_B_READY),
    scheduledDate: str(env.ERK_THETA_SCHEDULED_DATE),
    
    totalSoloConfortRoom: num(env.ERK_THETA_TOTAL_SOLO_CONFORT_ROOM),
    totalSoloPremiumRoom: num(env.ERK_THETA_TOTAL_SOLO_PREMIUM_ROOM),
    totalDuoRoom: num(env.ERK_THETA_TOTAL_DUO_ROOM),
    availableRoomCount: num(env.ERK_THETA_AVAILABLE_ROOM_COUNT),
    availableSoloConfortRoomCount: num(env.ERK_THETA_AVAILABLE_SOLO_CONFORT_ROOM_COUNT),
    availableSoloPremiumRoomCount: num(env.ERK_THETA_AVAILABLE_SOLO_PREMIUM_ROOM_COUNT),
    availableDuoRoomCount: num(env.ERK_THETA_AVAILABLE_DUO_ROOM_COUNT),
};

export const residenceData = {
    /* total number of residence */
    totalResidence: 9,
    
    //=== Block data
    allBlocks: [ 
        sigmaBlock, gammaBlock, deltaBlock, alphaBlock, 
                                            zetaBlock,
        thetaBlock, eurekaBlock, kappaBlock, phiBlock, 
    ],
};

export const ERK_FEATURE_FLAGS = {
    eurekashop : true,
    eurekanet : true,
    booking : true
};

const SITE_CONFIG = { ...contacts, links, ...residenceData };
export default SITE_CONFIG;