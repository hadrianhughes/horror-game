import * as _map from './map1.json'
import { Vector, GameMap } from './types'
import { findPlayerNode, mapTreeToMap } from './bsp'

const c = document.getElementById('root') as HTMLCanvasElement
const ctx = c.getContext('2d')

const canvasRatio = 16/9
const canvasWidth = window.innerWidth
const canvasHeight = canvasWidth / canvasRatio

c.width = canvasWidth
c.height = canvasHeight

const playerPos: Vector = [55, 50]

const map = _map as GameMap

const bspMap = mapTreeToMap(map)
const nodeID = findPlayerNode(playerPos, bspMap)
console.log(bspMap.map[nodeID])
