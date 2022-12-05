import * as img from "./img.js"
import * as audio from "./audio.js"

enum Direction {
    Null = "",
    Right = 'R',
    Left = 'L',
}

abstract class Game {
    protected canvas: HTMLCanvasElement
    protected ctx: CanvasRenderingContext2D
    protected FPS: number
    protected isGameOver: Boolean
    protected isPause: Boolean
    protected score: number

    protected constructor(canvas: HTMLCanvasElement, fps: number) {
        // Let users set the size of the canvas by themselves.
        // canvas.width = window.innerWidth * 0.8
        // canvas.height = window.innerHeight * 0.8
        this.canvas = canvas
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        this.isGameOver = false
        this.isPause = false
        this.score = 0
        this.FPS = fps
    }

    protected abstract Draw(): void

    protected abstract Update(): void

    protected abstract Loop(timestamp: DOMHighResTimeStamp): void
}

abstract class Meta {
    protected el: HTMLElement

    protected constructor() {
        this.el = document.createElement(this.InitEventListener());
        (this.el as any).object = this // set dummy attribute for `e.target.object`
    }

    abstract InitEventListener(): string

    AddEventListener(type: string, listener: any) {
        this.el.addEventListener(type, listener)
    }

    DispatchEvent(type: string, data = {}) {
        const event = new Event(type);
        (event as any).data = data // get dummy attribute
        this.el.dispatchEvent(event)
    }
}

abstract class ColorAble extends Meta {
    fillStyle: string
    strokeStyle: string

    protected constructor(fillStyle: string, strokeColor: string) {
        super()
        this.fillStyle = fillStyle
        this.strokeStyle = strokeColor
    }
}

class Tray extends ColorAble {
    x: number
    y: number
    width: number
    height: number

    // 托盤橫向移動的單位距離
    dx: number

    moveDirection: Direction

    constructor(
        x: number, y: number,
        width: number, height: number,
        dx: number,
        fillStyle: string, strokeColor: string,
    ) {
        super(fillStyle, strokeColor)
        this.x = x
        this.y = y
        this.dx = dx
        this.width = width
        this.height = height
        this.moveDirection = Direction.Null
    }

    InitEventListener(): string {
        return "Tray"
    }
}

class Ball extends ColorAble {
    x: number
    y: number
    radius: number

    // 球反彈的速度(斜線長)
    speed: number

    // 移動單位
    dx: number
    dy: number

    el: HTMLElement

    constructor(x: number, y: number, radius: number, speed: number, dx: number, dy: number,
                fillStyle: string, strokeColor: string,
    ) {
        super(fillStyle, strokeColor)
        this.x = x
        this.y = y
        this.radius = radius
        this.speed = speed
        this.dx = dx
        this.dy = dy
        this.el = document.createElement("Ball"); // event listener // dummy element to manage events
        (this.el as any).object = this //dummy attribute // So that it is accessible via event.target.obj
    }

    InitEventListener(): string {
        return "Ball"
    }
}

class Brick extends ColorAble {
    x: number
    y: number
    isAlive: boolean // alive or broken
    constructor(
        x: number, y: number,
        fillStyle: string, strokeColor: string
    ) {
        super(fillStyle, strokeColor)
        this.x = x
        this.y = y
        this.isAlive = true
    }

    InitEventListener(): string {
        return "Brick"
    }
}

class Toggle extends Meta {
    x: number
    y: number
    width: number
    height: number
    private value: boolean

    constructor(x: number, y: number, width: number, height: number, defaultValue: boolean) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.value = defaultValue
    }

    InitEventListener(): string {
        return "canvasButton"
    }

    Switch() {
        this.value = !this.value
    }

    get Value(): boolean {
        return this.value
    }
}

export class GameBreakout extends Game {
    readonly cfg: config
    protected tray: Tray
    protected ball: Ball
    protected bricks: Brick[][]

    protected toggleMuted: Toggle

    life: number
    level: number

    mouse: { x: number, y: number }

    private lastTimeStamp = 0

    constructor(canvas: HTMLCanvasElement,
                {
                    canvasWidth = 600,
                    canvasHeight = 800,
                    FPS = -1,

                    border = "1px solid #0ff",
                    lineWidth = 3,

                    life = 3,
                    maxLevel = 3,
                    scoreUnit = 10,

                    ballSpeed = 4, // 碰撞之後球反彈的速度
                    ballDx = 3, // 球的初始化橫向速度
                    ballDy = -3, // 須小於0

                    brickRow = 1,
                    brickColumn = 5,
                },
    ) {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        super(canvas, FPS)

        this.level = 1

        const trayWidth = this.canvas.width * 0.1
        const trayHeight = this.canvas.height * 0.06
        this.cfg = {
            Border: border,
            LineWidth: lineWidth,

            Life: life,
            MaxLevel: maxLevel,
            ScoreUnit: scoreUnit,

            TrayFillStyle: "#5a9b5a",
            TrayStrokeStyle: "#ffff00",
            TrayWidth: trayWidth,
            TrayHeight: trayHeight,

            BallSpeed: ballSpeed,
            BallDx: ballDx,
            BallDy: ballDy,
            BallFillStyle: "#ffff00",
            BallStrokeStyle: "#0c0c44",

            BrickRow: brickRow,
            BrickColumn: brickColumn,

            BrickWidth: trayWidth / 2,
            BrickHeight: trayHeight / 2,
            BrickOffsetLeft: this.canvas.width * 0.1,
            BrickOffsetTop: this.canvas.height * 0.05,
            BrickMarginTop: this.canvas.height * 0.1, // 留白的部分用來顯示統計資訊:{score, life, level}
            BrickFillStyle: "#4e6096",
            BrickStrokeStyle: "#fff"
        }
        this.life = this.cfg.Life

        this.mouse = {x: 0, y: 0}
        this.initControl()

        // Init ToggleMuted
        this.toggleMuted = new Toggle(this.canvas.width * 0.1, this.canvas.height * 0.9,
            this.#getCompatibleSize(20), this.#getCompatibleSize(20),
            false)
        this.toggleMuted.AddEventListener("change", () => {
            const isMuted = this.toggleMuted.Value
            audio.WallHit.muted = isMuted
            audio.BrickHit.muted = isMuted
            audio.TrayHit.muted = isMuted
            audio.LifeLost.muted = isMuted
            audio.Win.muted = isMuted
        })

        // Init Tray
        const trayMarginBottom = this.cfg.TrayHeight * 3 // 太高沒有什麼意義，反正掉下去就是死掉
        {
            this.tray = new Tray(
                this.canvas.width / 2 - this.cfg.TrayWidth / 2,
                this.canvas.height - trayMarginBottom - this.cfg.TrayHeight,
                this.cfg.TrayWidth, this.cfg.TrayHeight,
                5,
                this.cfg.TrayFillStyle,
                this.cfg.TrayStrokeStyle
            )
            this.tray.AddEventListener("move", () => {
                if (this.tray.moveDirection === Direction.Right &&
                    this.tray.x + this.tray.width < this.canvas.width
                ) {
                    this.tray.x += this.tray.dx
                } else if (
                    this.tray.moveDirection === Direction.Left &&
                    this.tray.x > 0
                ) {
                    this.tray.x -= this.tray.dx
                }
            })
        }

        // Init Ball
        {
            const ballRadius = this.cfg.TrayHeight / 2
            const defaultBallDx = this.cfg.BallDx * (Math.random() * 2 - 1) // 我們希望球的橫向速度介於3 ~ -3 之間 使得球不會每次都彈向某個角度，可以有變化
            const defaultBallDy = this.cfg.BallDy
            const ball = new Ball(
                this.canvas.width / 2, this.tray.y - ballRadius,
                ballRadius,
                this.cfg.BallSpeed,
                defaultBallDx, defaultBallDy,
                this.cfg.BallFillStyle, this.cfg.BallStrokeStyle
            )
            this.ball = ball
            ball.AddEventListener("move", (e: Event) => {
                e.stopImmediatePropagation()
                const b = (e.target as any).object as Ball
                b.x += b.dx
                b.y += b.dy
            })

            ball.AddEventListener("reset", (e: Event) => {
                e.stopImmediatePropagation()
                // ball.x = this.canvas.width / 2 // 從中間發球
                ball.x = this.tray.x + this.tray.width / 2 // 死掉的球，從托盤中間開始發球
                ball.y = this.tray.y - ball.radius
                ball.dx = this.cfg.BallDx * (Math.random() * 2 - 1)
                ball.dy = defaultBallDy
            })

            ball.AddEventListener("checkWallCollision", (e: Event) => {
                e.stopImmediatePropagation()
                if (ball.x + ball.radius > this.canvas.width || // right wall
                    ball.x - ball.radius < 0 // left wall
                ) {
                    ball.dx *= -1
                    audio.WallHit.Play()
                    return
                }

                // top wall
                if (ball.y - ball.radius < 0) {
                    ball.dy *= -1
                    audio.WallHit.Play()
                    return
                }

                // bottom
                if (ball.y + ball.radius > this.canvas.height) {
                    --this.life
                    audio.LifeLost.Play()
                    ball.DispatchEvent("reset")
                    return
                }
            })
        }

        // Init Bricks
        this.bricks = this.#createBricks(this.cfg.BrickRow, this.cfg.BrickColumn)


        // 添加相依事件
        {
            this.ball.AddEventListener("checkTrayCollision", () => {
                if (this.ball.x + this.ball.radius >= this.tray.x &&
                    this.ball.x - this.ball.radius <= this.tray.x + this.tray.width &&

                    this.ball.y + this.ball.radius /* bottom */ >= this.tray.y && // 注意y方向往下才是為正
                    this.ball.y + this.ball.radius <= this.tray.y + this.tray.height
                ) {
                    audio.TrayHit.Play()

                    // 當球擊中托盤位置位於托盤中心:
                    // 左側: 負
                    // 中心: 0
                    // 右側: 正
                    const distanceFromCenter = this.ball.x - (this.tray.x + this.tray.width / 2)

                    // normalize the values
                    // 當球擊中托盤位置位於托盤中心:
                    // 最左側: -1 (希望當球碰到左側的時候，可以往左移動)
                    // 中心: 0 (垂直移動)
                    // 最右側: 1 (希望球碰到右側時會往右移動)
                    // 我們希望球再托盤最右或最左的最大彈射角度為60度(PI/3)，至於如果是位於托盤的中段，由於其一定位於-1與1之間，所以角度只會比定義的最大角度PI/3來的小
                    const normalizeVal = distanceFromCenter / (this.tray.width / 2)
                    const angle = normalizeVal * Math.PI / 3

                    this.ball.dx = this.ball.speed * Math.sin(angle)
                    this.ball.dy = -this.ball.speed * Math.cos(angle) // 記得要加上負號才會往上彈. canvas的座標在左上,往右往下為正
                }
            })

            this.ball.AddEventListener("checkBrickCollision", () => {
                for (let r = 0; r < this.bricks.length; ++r) {
                    for (let c = 0; c < this.bricks[r].length; ++c) {
                        const curBrick = this.bricks[r][c]
                        if (!curBrick.isAlive) {
                            continue
                        }
                        if (
                            // x
                            this.ball.x + this.ball.radius /* ball right */ >= curBrick.x &&
                            this.ball.x - this.ball.radius /* ball left */ <= curBrick.x + this.cfg.BrickWidth &&

                            // y
                            this.ball.y - this.ball.radius <= curBrick.y + this.cfg.BrickHeight &&
                            this.ball.y + this.ball.radius >= curBrick.y
                        ) {
                            audio.BrickHit.Play()
                            this.ball.dy *= -1
                            curBrick.isAlive = false
                            this.score += this.cfg.ScoreUnit
                        }
                    }
                }
            })
        }

        this.isPause = true
    }

    #createBricks(numRow: number, numCol: number): Brick[][] {
        const bricks: Brick[][] = []
        for (let r = 0; r < numRow; ++r) {
            bricks[r] = []
            for (let c = 0; c < numCol; ++c) {
                bricks[r][c] = new Brick(
                    c * (this.cfg.BrickOffsetLeft + this.cfg.BrickWidth) + this.cfg.BrickOffsetLeft,
                    r * (this.cfg.BrickOffsetTop + this.cfg.BrickHeight) + this.cfg.BrickOffsetTop + this.cfg.BrickMarginTop,
                    this.cfg.BrickFillStyle,
                    this.cfg.BrickStrokeStyle,
                )
                bricks[r][c].AddEventListener("draw", (e: Event) => {
                    const curBrick = (e.target as any).object as Brick
                    if (!curBrick.isAlive) {
                        return
                    }
                    this.ctx.fillStyle = curBrick.fillStyle
                    this.ctx.fillRect(curBrick.x, curBrick.y, this.cfg.BrickWidth, this.cfg.BrickHeight)

                    this.ctx.strokeStyle = curBrick.strokeStyle
                    this.ctx.strokeRect(curBrick.x, curBrick.y, this.cfg.BrickWidth, this.cfg.BrickHeight)
                })
            }
        }
        return bricks
    }

    #drawTray() {
        this.ctx.fillStyle = this.tray.fillStyle
        this.ctx.fillRect(this.tray.x, this.tray.y, this.tray.width, this.tray.height)

        this.ctx.strokeStyle = this.tray.strokeStyle
        this.ctx.strokeRect(this.tray.x, this.tray.y, this.tray.width, this.tray.height)
    }

    #drawBall() {
        this.ctx.beginPath()

        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI)

        this.ctx.fillStyle = this.ball.fillStyle
        this.ctx.fill()

        this.ctx.strokeStyle = this.ball.strokeStyle
        this.ctx.stroke()

        this.ctx.closePath()
    }

    #drawMouse() {
        if (this.mouse.x === 0 && this.mouse.y === 0) {
            return
        }
        this.ctx.beginPath()

        this.ctx.globalAlpha = 0.2
        this.ctx.arc(this.mouse.x, this.mouse.y, 5, 0, 2 * Math.PI)

        this.ctx.fillStyle = "#ff0000"
        this.ctx.fill()

        this.ctx.strokeStyle = "#000000"
        this.ctx.stroke()

        this.ctx.closePath()
        this.ctx.globalAlpha = 1
    }

    #drawBricks() {
        for (let r = 0; r < this.bricks.length; ++r) {
            for (let c = 0; c < this.bricks[r].length; ++c) {
                if (!this.bricks[r][c].isAlive) {
                    continue
                }
                this.bricks[r][c].DispatchEvent("draw")
            }
        }
    }

    #getCompatibleSize(defaultSize: number): number {
        // https://stackoverflow.com/a/22948632/9935654
        const defaultWidth = 520
        const defaultHeight = 840
        // size = defaultSize * sqrt(scaleX**2 + scaleY**2)
        return defaultSize * Math.sqrt((this.canvas.width / defaultWidth) ** 2 + (this.canvas.height / defaultHeight) ** 2)
    }

    #drawStats() {
        const fontSize = this.#getCompatibleSize(2)
        const iconSize = this.#getCompatibleSize(45)

        // https://www.w3schools.com/tags/canvas_textbaseline.asp
        this.ctx.textBaseline = "top"

        const marginTop = this.canvas.height * 0.01
        this.ctx.fillStyle = "#1fa7ff"
        this.ctx.font = `${fontSize}em System`
        this.ctx.drawImage(img.Score, this.canvas.width * 0.1, marginTop, iconSize, iconSize)
        this.ctx.fillText(`${this.score}`, this.canvas.width * 0.24, marginTop)

        // put center
        this.ctx.drawImage(img.Life, this.canvas.width * 0.46, marginTop, iconSize, iconSize)
        this.ctx.fillText(`${this.life}`, this.canvas.width * 0.60, marginTop)

        // put right
        this.ctx.drawImage(img.Level, this.canvas.width * 0.74, marginTop, iconSize, iconSize)
        this.ctx.fillText(`1`, this.canvas.width * 0.88, marginTop)
    }

    #drawMusicButton() {
        this.ctx.drawImage(this.toggleMuted.Value ? img.Muted : img.Music,
            this.toggleMuted.x, this.toggleMuted.y,
            this.toggleMuted.width, this.toggleMuted.height)
    }

    // 畫出物件
    protected Draw() {
        // this.ctx.fillStyle = "#dedcdc" // clear the canvas
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.#drawTray()
        this.#drawBall()
        this.#drawBricks()
        this.#drawStats()
        this.#drawMusicButton()
        this.#drawMouse()
    }

    #checkLevelUp() {
        const isAllBroken = () => {
            for (let r = 0; r < this.bricks.length; ++r) {
                for (let c = 0; c < this.bricks[r].length; ++c) {
                    if (this.bricks[r][c].isAlive) {
                        return false
                    }
                }
            }
            return true
        }

        if (!isAllBroken()) {
            return
        }

        if (++this.level > this.cfg.MaxLevel) {
            this.isGameOver = true
            return
        }

        this.ball.speed += 3
        this.bricks = this.#createBricks(this.bricks.length + 1, this.bricks[0].length)
        this.ball.DispatchEvent("reset")
    }

    #checkGameOver() {
        if (this.life > 0 && !this.isGameOver) {
            return
        }
        this.isGameOver = true
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#0e0e0e"
        this.ctx.font = `${this.#getCompatibleSize(2)}em System`
        this.ctx.fillText("GAME OVER", this.canvas.width * 0.2, this.canvas.height * 0.2)
        if (this.life <= 0) {
            this.ctx.fillText("YOU  LOSE", this.canvas.width * 0.2, this.canvas.height * 0.4)
            return
        }
        this.ctx.fillText(" YOU WIN ", this.canvas.width * 0.2, this.canvas.height * 0.4);
        audio.Win.Play()
    }

    #showControlMenu() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#0e0e0e"
        this.ctx.font = `${this.#getCompatibleSize(2)}em System`
        this.ctx.fillText("Escape: Pause", this.canvas.width * 0.2, this.canvas.height * 0.2)
        this.ctx.fillText("Move: ← →", this.canvas.width * 0.2, this.canvas.height * 0.4)
        this.#drawMusicButton()
    }

    // 物件邏輯判斷部分
    protected Update() {
        this.tray.DispatchEvent("move")

        this.ball.DispatchEvent("move")
        this.ball.DispatchEvent("checkTrayCollision")
        this.ball.DispatchEvent("checkWallCollision")
        this.ball.DispatchEvent("checkBrickCollision")

        this.#checkLevelUp()
        this.#checkGameOver()
    }

    protected Loop(timeStamp: DOMHighResTimeStamp) {
        // requestAnimationFrame(this.Loop) // error, this.Loop not defined (not working at the class)
        requestAnimationFrame((timeStamp) => {
            this.Loop(timeStamp)
        })

        if (timeStamp - this.lastTimeStamp < 1000 / this.FPS) {
            return
        }
        this.lastTimeStamp = timeStamp

        if (!this.isPause && !this.isGameOver) {
            this.Draw()
            this.Update()
        }
    }

    initControl() {
        this.initControlKey()
        // Mouse
        {
            this.canvas.addEventListener("mousemove", (e) => {
                this.mouse.x = e.clientX - this.canvas.offsetLeft
                this.mouse.y = e.clientY - this.canvas.offsetTop
            })

            this.canvas.addEventListener("click", (e) => {
                const x = e.clientX - this.canvas.offsetLeft
                const y = e.clientY - this.canvas.offsetTop
                if (this.toggleMuted.x <= x && x <= this.toggleMuted.x + this.toggleMuted.x + this.toggleMuted.width &&
                    this.toggleMuted.y <= y && y <= this.toggleMuted.y + this.toggleMuted.y + this.toggleMuted.height
                ) {
                    this.toggleMuted.Switch()
                    this.toggleMuted.DispatchEvent("change")
                    this.#drawMusicButton()
                }
            })

            this.canvas.addEventListener("mouseleave", () => {
                this.mouse.x = 0
                this.mouse.y = 0
            })
        }
    }

    initControlKey() {
        this.canvas.tabIndex = 1 // 才可以使的canvas.addEventListener對於keyboard具有效果
        this.canvas.focus()

        this.canvas.addEventListener("keydown", (keyboardEvent) => {
            // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_event_key_key
            switch (keyboardEvent.key) {
                case "ArrowRight":
                    this.tray.moveDirection = Direction.Right
                    this.isPause = false
                    break
                case "ArrowLeft":
                    this.tray.moveDirection = Direction.Left
                    this.isPause = false
                    break
                case "Escape":
                    this.isPause = true
                    this.#showControlMenu()
            }
        })
        this.canvas.addEventListener("keyup", (event) => {
            this.tray.moveDirection = Direction.Null
        })
    }

    Start() {
        img.InitImage()
            .then(async () => {
                this.canvas.style.backgroundImage = img.BG.style.backgroundImage // "linear-gradient(6deg, #0ff .02%, rgb(0 157 245 / 20%) 99.98%)"
                await audio.InitAudio()
            })
            .then(() => {
                this.#showControlMenu()
                this.Loop(0)
            })
    }
}
