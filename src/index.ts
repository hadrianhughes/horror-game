import { vec2 } from 'gl-matrix'
import * as _map from './map1.json'
import { mapTreeToMap } from './bsp'
import { loadMap, MapJSON } from './map'
import { initContext, render } from './render'

const c = document.getElementById('root') as HTMLCanvasElement

const cameraPos = vec2.fromValues(55, 50)

const map = loadMap(_map as MapJSON)

const bspMap = mapTreeToMap(map)

const context = initContext(c)
render(context, bspMap, cameraPos)
