import { vec2 } from 'gl-matrix'
import * as _map from './map1.json'
import { mapTreeToMap } from './bsp'
import { loadMap, MapJSON } from './map'
import { render } from './render'

const c = document.getElementById('root') as HTMLCanvasElement

const canvasRatio = 16/9
const canvasWidth = window.innerWidth
const canvasHeight = canvasWidth / canvasRatio

c.width = canvasWidth
c.height = canvasHeight

const playerPos = vec2.fromValues(55, 50)

const map = loadMap(_map as MapJSON)

const bspMap = mapTreeToMap(map)

render(bspMap, playerPos)
