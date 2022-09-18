import { rad } from '../math/geometry'

export const FOV = rad(45)
export const RIGHT_FOV_BOUND = Math.PI / 2 - FOV / 2
export const LEFT_FOV_BOUND = Math.PI / 2 + FOV / 2

// Pixel height of a segment when the camera is 1 unit away and the wall is 1 unit tall
export const PROJ_PLANE_DIST = 500

export const CANVAS_RATIO = 16 / 9

export const SEG_COUNT = 1000
