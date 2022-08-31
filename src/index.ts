import * as _map from './map1.json'
import { Vector } from './types'
import { findPlayerNode, mapTreeToMap } from './bsp'
import { loadMap, MapJSON } from './map'
import { render } from './render'

const c = document.getElementById('root') as HTMLCanvasElement
const ctx = c.getContext('2d')

const canvasRatio = 16/9
const canvasWidth = window.innerWidth
const canvasHeight = canvasWidth / canvasRatio

c.width = canvasWidth
c.height = canvasHeight

const playerPos: Vector = [55, 50]

const map = loadMap(_map as MapJSON)

const bspMap = mapTreeToMap(map)
const nodeID = findPlayerNode(playerPos, bspMap)

render(bspMap, playerPos)
