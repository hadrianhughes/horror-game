const c = document.getElementById('root') as HTMLCanvasElement
const ctx = c.getContext('2d')

const canvasRatio = 16/9
const canvasWidth = window.innerWidth
const canvasHeight = canvasWidth / canvasRatio

c.width = canvasWidth
c.height = canvasHeight
