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
        canvas.width = window.innerWidth * 0.8
        canvas.height = window.innerHeight * 0.8
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

export class GameBreakout extends Game {
    readonly cfg: config
    protected tray: Tray
    protected ball: Ball
    protected bricks: Brick[][]

    life: number

    private lastTimeStamp = 0

    constructor(canvas: HTMLCanvasElement,
                {
                    FPS = 40,

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
        super(canvas, FPS)

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

        this.initControlKey()

        // Init Tray
        const trayMarginBottom = this.cfg.TrayHeight * 5
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
                    // WALL_HIT.play()
                    return
                }

                // top wall
                if (ball.y - ball.radius < 0) {
                    ball.dy *= -1
                    // AUDIO.WallHit.play()
                    return
                }

                // bottom
                if (ball.y + ball.radius > this.canvas.height) {
                    --this.life
                    // AUDIO.LifeLost.play()
                    ball.DispatchEvent("reset")
                    return
                }
            })
        }

        // Init Bricks
        {
            this.bricks = []
            for (let r = 0; r < this.cfg.BrickRow; ++r) {
                this.bricks[r] = []
                for (let c = 0; c < this.cfg.BrickColumn; ++c) {
                    this.bricks[r][c] = new Brick(
                        c * (this.cfg.BrickOffsetLeft + this.cfg.BrickWidth) + this.cfg.BrickOffsetLeft,
                        r * (this.cfg.BrickOffsetTop + this.cfg.BrickHeight) + this.cfg.BrickOffsetTop + this.cfg.BrickMarginTop,
                        this.cfg.BrickFillStyle,
                        this.cfg.BrickStrokeStyle,
                    )
                    this.bricks[r][c].AddEventListener("draw", (e: Event) => {
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
        }

        // 添加相依事件
        {
            this.ball.AddEventListener("checkTrayCollision", () => {
                if (this.ball.x + this.ball.radius >= this.tray.x &&
                    this.ball.x - this.ball.radius <= this.tray.x + this.tray.width &&

                    this.ball.y + this.ball.radius /* bottom */ >= this.tray.y && // 注意y方向往下才是為正
                    this.ball.y + this.ball.radius <= this.tray.y + this.tray.height
                ) {
                    // Audio.TrayHit.play()

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
                for (let r = 0; r < this.cfg.BrickRow; ++r) {
                    for (let c = 0; c < this.cfg.BrickColumn; ++c) {
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
                            // Audio.BrickHit.play()
                            this.ball.dy *= -1
                            curBrick.isAlive = false
                            this.score += this.cfg.ScoreUnit
                        }
                    }
                }
            })
        }
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

    #drawBricks() {
        for (let r = 0; r < this.cfg.BrickRow; ++r) {
            for (let c = 0; c < this.cfg.BrickColumn; ++c) {
                if (!this.bricks[r][c].isAlive) {
                    continue
                }
                this.bricks[r][c].DispatchEvent("draw")
            }
        }
    }

    #drawStats() {
        // https://stackoverflow.com/a/22948632/9935654
        const fontBase = 1000 // 在畫面寬度為1000的時候
        const fontSize = 2 // 則想要的字體大小為
        const ratio = fontSize / fontBase
        this.ctx.fillStyle = "#1fa7ff"
        this.ctx.font = `${this.canvas.width * ratio}em System`
        this.ctx.fillText(`SCORE: ${this.score}`, this.canvas.width * 0.03, this.cfg.BrickMarginTop) // put left
        this.ctx.fillText(`LIFE: ${this.life}`, this.canvas.width * 0.85, this.cfg.BrickMarginTop) // put right
        this.ctx.fillText(`LEVEL:`, this.canvas.width * 0.36, this.cfg.BrickMarginTop) // put center
    }

    // 畫出物件
    protected Draw() {
        this.ctx.fillStyle = "#dedcdc" // clear the canvas
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.#drawTray()
        this.#drawBall()
        this.#drawBricks()
        this.#drawStats()
    }

    // 物件邏輯判斷部分
    protected Update() {
        this.tray.DispatchEvent("move")

        this.ball.DispatchEvent("move")
        this.ball.DispatchEvent("checkTrayCollision")
        this.ball.DispatchEvent("checkWallCollision")
        this.ball.DispatchEvent("checkBrickCollision")

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

        if (!this.isPause) {
            this.Draw()
            this.Update()
        }

        if (this.isGameOver) {
            return
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
                    break
                case "ArrowLeft":
                    this.tray.moveDirection = Direction.Left
                    break
            }
        })
        this.canvas.addEventListener("keyup", (event) => {
            this.tray.moveDirection = Direction.Null
        })
    }

    Start() {
        this.Loop(0)
    }

    Paused() {
        this.isPause = !this.isPause
    }
}
