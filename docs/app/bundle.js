// https://github.com/CarsonSlovoka/ v1.0.0 Copyright (c) Carson, all right reserved.
let BG;
let Life;
let Score;
let Level;
let Music;
let Muted;
class SafeImage extends Image {
    static async New(src, defaultDataURI, width, height) {
        const srcURL = await fetch(src)
            .then((res) => {
            if (res.status != 200) {
                console.warn(`${src} was not found. Use defaultDataURI instead.`);
                return "";
            }
            return src;
        });
        return new SafeImage(srcURL, defaultDataURI);
    }
    constructor(src, defaultDataURI, width, height) {
        super(width, height);
        this.src = src === "" ? defaultDataURI : src;
    }
}
// 這樣寫在uglifyjs會報錯，他不行直接在外面用async
// export const BG = new Image()
// export const Life = await SafeImage.New("./static/life.svg", "")
async function InitImage() {
    BG = new Image();
    BG.style.backgroundImage = "linear-gradient(4deg, #0ff .02%, rgb(165 189 207 / 20%) 90%, rgb(215 215 215 / 50%) 90%)";
    Life = await SafeImage.New("./static/img/life.svg", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNzAwcHQiIGhlaWdodD0iNzAwcHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMTc1IDgwIDM1MCA0NTAiPgogPGc+CiAgPHBhdGggZmlsbD0iI2NjMTYxNiIgZD0ibTQyOS41MiAyNTguNzJjMCAxMi44NzktNS42MDE2IDI1LjE5OS0xNS4xMjEgMzQuMTZsLTU1LjQ0MSA1MC45NjFjLTIuODAwOCAyLjIzODMtNS42MDE2IDMuMzU5NC04Ljk2MDkgMy4zNTk0cy02LjcxODgtMS4xMjExLTguOTYwOS0zLjM1OTRsLTU1LjQ0MS01MC45NjFjLTEwLjA3OC04Ljk2MDktMTUuMTIxLTIxLjI4MS0xNS4xMjEtMzQuMTZzNS42MDE2LTI1LjE5OSAxNS4xMjEtMzQuMTZjMTcuMzU5LTE2LjIzOCA0Ny4wMzktMTYuMjM4IDY0LjM5OC0wLjU1ODU5IDE3LjM1OS0xNS42OCA0Ny4wMzktMTUuNjggNjQuMzk4IDAuNTU4NTkgMTAuMDkgOC45NjA5IDE1LjEyOSAyMS4yODEgMTUuMTI5IDM0LjE2eiIvPgogIDxwYXRoIGZpbGw9IiNlMjJiNmIiIGQ9Im0zNTAgOTAuNzE5Yy0xMDQuNzIgMC0xODkuMjggODUuMTIxLTE4OS4yOCAxODkuMjggMCAxMDQuNzIgODUuMTIxIDE4OS4yOCAxODkuMjggMTg5LjI4IDEwNC43MiAwIDE4OS4yOC04NS4xMjEgMTg5LjI4LTE4OS4yOCAwLTEwNC43Mi04NC41NjItMTg5LjI4LTE4OS4yOC0xODkuMjh6bTAgMzUxLjY4Yy04OS42MDIgMC0xNjIuNC03Mi44MDEtMTYyLjQtMTYyLjQgMC04OS42MDIgNzIuODAxLTE2Mi40IDE2Mi40LTE2Mi40IDg5LjYwMiAwIDE2Mi40IDcyLjgwMSAxNjIuNCAxNjIuNCAwIDg5LjYwMi03Mi43OTcgMTYyLjQtMTYyLjQgMTYyLjR6Ii8+CiA8L2c+Cjwvc3ZnPgo=");
    Score = await SafeImage.New("./static/img/score.svg", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzAwcHQiIGhlaWdodD0iNzAwcHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMTAwIDMwMCA1MDAgNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogPGcgZmlsbD0iI0ZBRkYwMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI2Ij4KICA8cGF0aCBkPSJtNDQzLjg4IDI0MC41NWMtMC42NjAxNi0yLjAyNzMtMi40MTQxLTMuNTAzOS00LjUxOTUtMy44MTI1bC01OC4yNzctOC40NzI3LTI2LjA2Mi01Mi44MDljLTEuODk0NS0zLjgzMi04LjE1MjMtMy44MzItMTAuMDQ3IDBsLTI2LjA2MiA1Mi44MDktNTguMjc3IDguNDcyN2MtMi4xMDU1IDAuMzA4NTktMy44NTk0IDEuNzgxMi00LjUxOTUgMy44MTI1LTAuNjYwMTYgMi4wMjM0LTAuMTEzMjggNC4yNSAxLjQxOCA1LjczNDRsNDIuMTY4IDQxLjEwOS05Ljk1MzEgNTguMDM5Yy0wLjM1OTM4IDIuMTAxNiAwLjUwMzkxIDQuMjIyNyAyLjIzMDUgNS40NzY2IDEuNzI2NiAxLjI2MTcgNC4wMDc4IDEuNDIxOSA1Ljg5ODQgMC40MjU3OGw1Mi4xMjEtMjcuMzk4IDUyLjEyNSAyNy40MDJjMC44MTY0MSAwLjQyOTY5IDEuNzE0OCAwLjY0NDUzIDIuNjA1NSAwLjY0NDUzIDEuMTYwMiAwIDIuMzIwMy0wLjM1OTM4IDMuMjkzLTEuMDcwMyAxLjcyNjYtMS4yNTM5IDIuNTg1OS0zLjM3NSAyLjIzMDUtNS40NzY2bC05Ljk1MzEtNTguMDM5IDQyLjE2OC00MS4xMDljMS41MjM0LTEuNDg4MyAyLjA3MDMtMy43MTg4IDEuNDE0MS01LjczODN6Ii8+CiAgPHBhdGggZD0ibTEyMC42OCAyOTguNjljLTAuNjYwMTYgMi4wMjM0LTAuMTEzMjggNC4yNSAxLjQxOCA1LjczNDRsMzIuNjEzIDMxLjc5Ny03LjY5OTIgNDQuODkxYy0wLjM1OTM3IDIuMTAxNiAwLjUwMzkxIDQuMjIyNyAyLjIzMDUgNS40NzY2IDEuNzMwNSAxLjI2MTcgNC4wMTU2IDEuNDI5NyA1Ljg5ODQgMC40MjU3OGw0MC4zMTItMjEuMTkxIDQwLjMxMiAyMS4xOTFjMC44MTY0MSAwLjQyOTY5IDEuNzE0OCAwLjY0NDUzIDIuNjA1NSAwLjY0NDUzIDEuMTYwMiAwIDIuMzIwMy0wLjM1OTM4IDMuMjkzLTEuMDcwMyAxLjcyNjYtMS4yNTM5IDIuNTg1OS0zLjM3NSAyLjIzMDUtNS40NzY2bC03LjY5OTItNDQuODk1IDMyLjYxMy0zMS43OTNjMS41MjM0LTEuNDg4MyAyLjA3ODEtMy43MTA5IDEuNDE4LTUuNzM0NC0wLjY2MDE2LTIuMDI3My0yLjQxNDEtMy41MDM5LTQuNTE5NS0zLjgxMjVsLTQ1LjA3NC02LjU1ODYtMjAuMTU2LTQwLjg0Yy0xLjg4NjctMy44MzItOC4xNjAyLTMuODMyLTEwLjA0NyAwbC0yMC4xNTYgNDAuODQtNDUuMDc0IDYuNTU4NmMtMi4xMTMzIDAuMzA4NTktMy44NTk0IDEuNzg1Mi00LjUxOTUgMy44MTI1eiIvPgogIDxwYXRoIGQ9Im01NzkuMzIgMjk4LjY5Yy0wLjY2MDE2LTIuMDI3My0yLjQxNDEtMy41MDM5LTQuNTE5NS0zLjgxMjVsLTQ1LjA3NC02LjU1ODYtMjAuMTU2LTQwLjg0Yy0xLjg4NjctMy44MzItOC4xNjAyLTMuODMyLTEwLjA0NyAwbC0yMC4xNTYgNDAuODQtNDUuMDc0IDYuNTU4NmMtMi4xMDU1IDAuMzA4NTktMy44NTk0IDEuNzgxMi00LjUxOTUgMy44MTI1LTAuNjYwMTYgMi4wMjM0LTAuMTEzMjggNC4yNSAxLjQxOCA1LjczNDRsMzIuNjEzIDMxLjc5My03LjY5OTIgNDQuODk1Yy0wLjM1OTM4IDIuMTAxNiAwLjUwMzkxIDQuMjIyNyAyLjIzMDUgNS40NzY2IDAuOTcyNjYgMC43MTA5NCAyLjEzMjggMS4wNzAzIDMuMjkzIDEuMDcwMyAwLjg5MDYzIDAgMS43ODUyLTAuMjEwOTQgMi42MDU1LTAuNjQ0NTNsNDAuMzEyLTIxLjE5MSA0MC4zMTIgMjEuMTkxYzEuODk0NSAxLjAwMzkgNC4xNzE5IDAuODI4MTIgNS44OTg0LTAuNDI1NzggMS43MjY2LTEuMjUzOSAyLjU4NTktMy4zNzUgMi4yMzA1LTUuNDc2NmwtNy42OTkyLTQ0Ljg5MSAzMi42MTMtMzEuNzk3YzEuNTMxMi0xLjQ4NDQgMi4wODItMy43MTA5IDEuNDE4LTUuNzM0NHoiLz4KIDwvZz4KPC9zdmc+Cg==");
    Level = await SafeImage.New("./static/img/level.svg", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzAwcHQiIGhlaWdodD0iNzAwcHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBmaWxsPSJ5ZWxsb3ciIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNiIgZD0ibTQ5MCAyODB2LTI0NWgtMzV2MTcuNWgtMTY0LjMybDI0LjMyNCA3MC0yMy40NDkgNzBoMTYzLjQ1djg3LjVoLTEwNXY3MGgtODcuNXY3MGgtODcuNXY3MGgtNzB2MzVoNDkwdi0yNDV6bS0xNTAuNjgtMTIyLjUgMTEuNTUxLTM1LTExLjU1MS0zNWgxMTUuNjh2NzB6bTIyMC42OCAzMzIuNWgtMzUwdi0zNWg4Ny41di03MGg4Ny41di03MGgxNzV6Ii8+Cjwvc3ZnPgo=");
    Music = await SafeImage.New("./static/img/music.svg", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIKICAgICBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIHN0eWxlPSJmaWxsOiNmYzgwNzc7IgogICAgICBkPSJNMjU2LDBDMTE0LjYxNiwwLDAsMTE0LjYxNiwwLDI1NnMxMTQuNjE2LDI1NiwyNTYsMjU2czI1Ni0xMTQuNjE2LDI1Ni0yNTZTMzk3LjM4NCwwLDI1NiwweiIvPgogICAgPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiCiAgICAgICAgICBkPSJNMzkwLjUzNiwxMTQuMmwtMTc4Ljc4NCwzNi4xMzZWMzIxLjMyYy0xMC41NDQtNi45NzYtMjIuOTQ0LTEwLjYzMi0zNS41OTItMTAuNDg4ICBjLTMwLjIxNiwwLTU0LjY5NiwxOS40NTYtNTQuNjk2LDQzLjQ4OHMyNC40OCw0My40ODgsNTQuNjk2LDQzLjQ4OHM1NC42OTYtMTkuNDU2LDU0LjY5Ni00My40ODhWMjIxLjg4OEwzNjkuNzM2LDIwMHYxMDAuMjQgIGMtMTAuMi02LjI0LTIxLjkzNi05LjQ5Ni0zMy44ODgtOS40MTZjLTMwLjIxNiwwLTU0LjY5NiwxOS40NTYtNTQuNjk2LDQzLjQ4OHMyNC40OCw0My40ODgsNTQuNjk2LDQzLjQ4OCAgczU0LjY5Ni0xOS40NTYsNTQuNjk2LTQzLjQ4OGMtMC4wMjQtMS42MTYtMC4xNDQtMy4yMzItMC4zNi00Ljg0aDAuMzZMMzkwLjUzNiwxMTQuMnoiLz4KPC9zdmc+Cg==");
    Muted = await SafeImage.New("./static/img/muted.svg", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIKICAgICBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIHN0eWxlPSJmaWxsOmdyYXk7IgogICAgICBkPSJNMjU2LDBDMTE0LjYxNiwwLDAsMTE0LjYxNiwwLDI1NnMxMTQuNjE2LDI1NiwyNTYsMjU2czI1Ni0xMTQuNjE2LDI1Ni0yNTZTMzk3LjM4NCwwLDI1NiwweiIvPgogICAgPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiCiAgICAgICAgICBkPSJNMzkwLjUzNiwxMTQuMmwtMTc4Ljc4NCwzNi4xMzZWMzIxLjMyYy0xMC41NDQtNi45NzYtMjIuOTQ0LTEwLjYzMi0zNS41OTItMTAuNDg4ICBjLTMwLjIxNiwwLTU0LjY5NiwxOS40NTYtNTQuNjk2LDQzLjQ4OHMyNC40OCw0My40ODgsNTQuNjk2LDQzLjQ4OHM1NC42OTYtMTkuNDU2LDU0LjY5Ni00My40ODhWMjIxLjg4OEwzNjkuNzM2LDIwMHYxMDAuMjQgIGMtMTAuMi02LjI0LTIxLjkzNi05LjQ5Ni0zMy44ODgtOS40MTZjLTMwLjIxNiwwLTU0LjY5NiwxOS40NTYtNTQuNjk2LDQzLjQ4OHMyNC40OCw0My40ODgsNTQuNjk2LDQzLjQ4OCAgczU0LjY5Ni0xOS40NTYsNTQuNjk2LTQzLjQ4OGMtMC4wMjQtMS42MTYtMC4xNDQtMy4yMzItMC4zNi00Ljg0aDAuMzZMMzkwLjUzNiwxMTQuMnoiLz4KPC9zdmc+Cg==");
}

let WallHit;
let BrickHit;
let TrayHit;
let LifeLost;
let Win;
class SafeAudio extends Audio {
    static async New(src) {
        const srcURL = await fetch(src) // method: HEAD會得到: fetch failed loading head
            .then((res) => {
            // 如果fetch的內容不在，會自己顯示err訊息到console，不需要再自己處理
            if (res.status != 200) {
                return undefined; // new Audio(undefined)與new Audio("")不一樣，後者的src會用該HTML網頁
            }
            return src;
        })
            .catch((err) => {
            return undefined;
        });
        return new SafeAudio(srcURL);
    }
    constructor(src) {
        super(src);
    }
    Play() {
        if (this.src === "") {
            return;
        }
        this.play().catch(); // https://stackoverflow.com/a/56796334/9935654 因為play是一個Promise，如果沒有處理(await, then, catch)就會出現警告
    }
}
async function InitAudio() {
    WallHit = await SafeAudio.New("./static/audio/wall_hit.mp3");
    BrickHit = await SafeAudio.New("./static/audio/brick_hit.mp3");
    TrayHit = await SafeAudio.New("./static/audio/tray_hit.mp3");
    LifeLost = await SafeAudio.New("./static/audio/life_lost.mp3");
    Win = await SafeAudio.New("./static/audio/win.mp3");
}

var Direction;
(function (Direction) {
    Direction["Null"] = "";
    Direction["Right"] = "R";
    Direction["Left"] = "L";
})(Direction || (Direction = {}));
class Game {
    canvas;
    ctx;
    FPS;
    isGameOver;
    isPause;
    score;
    constructor(canvas, fps) {
        // Let users set the size of the canvas by themselves.
        // canvas.width = window.innerWidth * 0.8
        // canvas.height = window.innerHeight * 0.8
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isGameOver = false;
        this.isPause = false;
        this.score = 0;
        this.FPS = fps;
    }
}
class Meta {
    el;
    constructor() {
        this.el = document.createElement(this.InitEventListener());
        this.el.object = this; // set dummy attribute for `e.target.object`
    }
    AddEventListener(type, listener) {
        this.el.addEventListener(type, listener);
    }
    DispatchEvent(type, data = {}) {
        const event = new Event(type);
        event.data = data; // get dummy attribute
        this.el.dispatchEvent(event);
    }
}
class ColorAble extends Meta {
    fillStyle;
    strokeStyle;
    constructor(fillStyle, strokeColor) {
        super();
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeColor;
    }
}
class Tray extends ColorAble {
    x;
    y;
    width;
    height;
    dx;
    moveDirection;
    constructor(x, y, width, height, dx, // 托盤橫向移動的單位距離
    fillStyle, strokeColor) {
        super(fillStyle, strokeColor);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.moveDirection = Direction.Null;
    }
    InitEventListener() {
        return "Tray";
    }
}
class Ball extends ColorAble {
    x;
    y;
    radius;
    // 球反彈的速度(斜線長)
    speed;
    // 移動單位
    dx;
    dy;
    el;
    constructor(x, y, radius, speed, dx, dy, fillStyle, strokeColor) {
        super(fillStyle, strokeColor);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.dx = dx;
        this.dy = dy;
        this.el = document.createElement("Ball"); // event listener // dummy element to manage events
        this.el.object = this; //dummy attribute // So that it is accessible via event.target.obj
    }
    InitEventListener() {
        return "Ball";
    }
}
class Brick extends ColorAble {
    x;
    y;
    isAlive; // alive or broken
    constructor(x, y, fillStyle, strokeColor) {
        super(fillStyle, strokeColor);
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }
    InitEventListener() {
        return "Brick";
    }
}
class TextButton {
    text;
    x;
    y;
    width;
    height;
    constructor(text, x, y, width, height) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    InitEventListener() {
        return "TextButton";
    }
}
class Toggle extends Meta {
    x;
    y;
    width;
    height;
    value;
    constructor(x, y, width, height, value) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
    }
    InitEventListener() {
        return "canvasButton";
    }
    Switch() {
        this.value = !this.value;
    }
    get Value() {
        return this.value;
    }
}
class GameBreakout extends Game {
    cfg;
    tray;
    ball;
    bricks;
    toggleMuted;
    tryAgainButton;
    life;
    level;
    mouse;
    lastTimeStamp = 0;
    constructor(canvas, { canvasWidth = 600, canvasHeight = 800, FPS = -1, border = "1px solid #0ff", lineWidth = 3, life = 3, maxLevel = 3, scoreUnit = 10, ballSpeed = 4, // 碰撞之後球反彈的速度
    ballDx = 3, // 球的初始化橫向速度
    ballDy = -3, // 須小於0
    brickRow = 1, brickColumn = 5, }) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        super(canvas, FPS);
        this.level = 1;
        const trayWidth = this.canvas.width * 0.1;
        const trayHeight = this.canvas.height * 0.06;
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
            BrickMarginTop: this.canvas.height * 0.1,
            BrickFillStyle: "#4e6096",
            BrickStrokeStyle: "#fff"
        };
        this.life = this.cfg.Life;
        this.mouse = { x: 0, y: 0 };
        this.initControl();
        // Init ToggleMuted
        this.toggleMuted = new Toggle(this.canvas.width * 0.1, this.canvas.height * 0.9, this.#getCompatibleSize(20), this.#getCompatibleSize(20), false);
        this.toggleMuted.AddEventListener("change", () => {
            const isMuted = this.toggleMuted.Value;
            WallHit.muted = isMuted;
            BrickHit.muted = isMuted;
            TrayHit.muted = isMuted;
            LifeLost.muted = isMuted;
            Win.muted = isMuted;
        });
        // Init trayAgainButton
        {
            this.ctx.font = `${this.#getCompatibleSize(2)}em System`;
            const text = "Try Again";
            const textMetric = this.ctx.measureText(text);
            this.tryAgainButton = new TextButton(text, this.canvas.width * 0.2, this.canvas.height * 0.6, textMetric.width, textMetric.fontBoundingBoxAscent + textMetric.fontBoundingBoxDescent);
        }
        // Init Tray
        const trayMarginBottom = this.cfg.TrayHeight * 3; // 太高沒有什麼意義，反正掉下去就是死掉
        {
            this.tray = new Tray(this.canvas.width / 2 - this.cfg.TrayWidth / 2, this.canvas.height - trayMarginBottom - this.cfg.TrayHeight, this.cfg.TrayWidth, this.cfg.TrayHeight, 5, this.cfg.TrayFillStyle, this.cfg.TrayStrokeStyle);
            this.tray.AddEventListener("move", () => {
                if (this.tray.moveDirection === Direction.Right &&
                    this.tray.x + this.tray.width < this.canvas.width) {
                    this.tray.x += this.tray.dx;
                }
                else if (this.tray.moveDirection === Direction.Left &&
                    this.tray.x > 0) {
                    this.tray.x -= this.tray.dx;
                }
            });
        }
        // Init Ball
        {
            const ballRadius = this.cfg.TrayHeight / 2;
            const defaultBallDx = this.cfg.BallDx * (Math.random() * 2 - 1); // 我們希望球的橫向速度介於3 ~ -3 之間 使得球不會每次都彈向某個角度，可以有變化
            const defaultBallDy = this.cfg.BallDy;
            const ball = new Ball(this.canvas.width / 2, this.tray.y - ballRadius, ballRadius, this.cfg.BallSpeed, defaultBallDx, defaultBallDy, this.cfg.BallFillStyle, this.cfg.BallStrokeStyle);
            this.ball = ball;
            ball.AddEventListener("move", (e) => {
                e.stopImmediatePropagation();
                const b = e.target.object;
                b.x += b.dx;
                b.y += b.dy;
            });
            ball.AddEventListener("reset", (e) => {
                e.stopImmediatePropagation();
                // ball.x = this.canvas.width / 2 // 從中間發球
                ball.x = this.tray.x + this.tray.width / 2; // 死掉的球，從托盤中間開始發球
                ball.y = this.tray.y - ball.radius;
                ball.dx = this.cfg.BallDx * (Math.random() * 2 - 1);
                // ball.dy = defaultBallDy // 這樣沒辦法直接從外部作弊
                ball.dy = this.cfg.BallDy; // 可以從外部修改cfg來影響預設的dy速度
            });
            ball.AddEventListener("checkWallCollision", (e) => {
                e.stopImmediatePropagation();
                if (ball.x + ball.radius > this.canvas.width || // right wall
                    ball.x - ball.radius < 0 // left wall
                ) {
                    ball.dx *= -1;
                    WallHit.Play();
                    return;
                }
                // top wall
                if (ball.y - ball.radius < 0) {
                    ball.dy *= -1;
                    WallHit.Play();
                    return;
                }
                // bottom
                if (ball.y + ball.radius > this.canvas.height) {
                    --this.life;
                    LifeLost.Play();
                    ball.DispatchEvent("reset");
                    return;
                }
            });
        }
        // Init Bricks
        this.bricks = this.#createBricks(this.cfg.BrickRow, this.cfg.BrickColumn);
        // 添加相依事件
        {
            this.ball.AddEventListener("checkTrayCollision", () => {
                if (this.ball.x + this.ball.radius >= this.tray.x &&
                    this.ball.x - this.ball.radius <= this.tray.x + this.tray.width &&
                    this.ball.y + this.ball.radius /* bottom */ >= this.tray.y && // 注意y方向往下才是為正
                    this.ball.y + this.ball.radius <= this.tray.y + this.tray.height) {
                    TrayHit.Play();
                    // 當球擊中托盤位置位於托盤中心:
                    // 左側: 負
                    // 中心: 0
                    // 右側: 正
                    const distanceFromCenter = this.ball.x - (this.tray.x + this.tray.width / 2);
                    // normalize the values
                    // 當球擊中托盤位置位於托盤中心:
                    // 最左側: -1 (希望當球碰到左側的時候，可以往左移動)
                    // 中心: 0 (垂直移動)
                    // 最右側: 1 (希望球碰到右側時會往右移動)
                    // 我們希望球再托盤最右或最左的最大彈射角度為60度(PI/3)，至於如果是位於托盤的中段，由於其一定位於-1與1之間，所以角度只會比定義的最大角度PI/3來的小
                    const normalizeVal = distanceFromCenter / (this.tray.width / 2);
                    const angle = normalizeVal * Math.PI / 3;
                    this.ball.dx = this.ball.speed * Math.sin(angle);
                    this.ball.dy = -this.ball.speed * Math.cos(angle); // 記得要加上負號才會往上彈. canvas的座標在左上,往右往下為正
                }
            });
            this.ball.AddEventListener("checkBrickCollision", () => {
                for (let r = 0; r < this.bricks.length; ++r) {
                    for (let c = 0; c < this.bricks[r].length; ++c) {
                        const curBrick = this.bricks[r][c];
                        if (!curBrick.isAlive) {
                            continue;
                        }
                        if (
                        // x
                        this.ball.x + this.ball.radius /* ball right */ >= curBrick.x &&
                            this.ball.x - this.ball.radius /* ball left */ <= curBrick.x + this.cfg.BrickWidth &&
                            // y
                            this.ball.y - this.ball.radius <= curBrick.y + this.cfg.BrickHeight &&
                            this.ball.y + this.ball.radius >= curBrick.y) {
                            BrickHit.Play();
                            this.ball.dy *= -1;
                            curBrick.isAlive = false;
                            this.score += this.cfg.ScoreUnit;
                        }
                    }
                }
            });
        }
        this.isPause = true;
    }
    #createBricks(numRow, numCol) {
        const bricks = [];
        for (let r = 0; r < numRow; ++r) {
            bricks[r] = [];
            for (let c = 0; c < numCol; ++c) {
                bricks[r][c] = new Brick(c * (this.cfg.BrickOffsetLeft + this.cfg.BrickWidth) + this.cfg.BrickOffsetLeft, r * (this.cfg.BrickOffsetTop + this.cfg.BrickHeight) + this.cfg.BrickOffsetTop + this.cfg.BrickMarginTop, this.cfg.BrickFillStyle, this.cfg.BrickStrokeStyle);
                bricks[r][c].AddEventListener("draw", (e) => {
                    const curBrick = e.target.object;
                    if (!curBrick.isAlive) {
                        return;
                    }
                    this.ctx.fillStyle = curBrick.fillStyle;
                    this.ctx.fillRect(curBrick.x, curBrick.y, this.cfg.BrickWidth, this.cfg.BrickHeight);
                    this.ctx.strokeStyle = curBrick.strokeStyle;
                    this.ctx.strokeRect(curBrick.x, curBrick.y, this.cfg.BrickWidth, this.cfg.BrickHeight);
                });
            }
        }
        return bricks;
    }
    #drawTray() {
        this.ctx.fillStyle = this.tray.fillStyle;
        this.ctx.fillRect(this.tray.x, this.tray.y, this.tray.width, this.tray.height);
        this.ctx.strokeStyle = this.tray.strokeStyle;
        this.ctx.strokeRect(this.tray.x, this.tray.y, this.tray.width, this.tray.height);
    }
    #drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.ball.fillStyle;
        this.ctx.fill();
        this.ctx.strokeStyle = this.ball.strokeStyle;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    #drawMouse() {
        if (this.mouse.x === 0 && this.mouse.y === 0) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.2;
        this.ctx.arc(this.mouse.x, this.mouse.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#ff0000";
        this.ctx.fill();
        this.ctx.strokeStyle = "#000000";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.globalAlpha = 1;
    }
    #drawBricks() {
        for (let r = 0; r < this.bricks.length; ++r) {
            for (let c = 0; c < this.bricks[r].length; ++c) {
                if (!this.bricks[r][c].isAlive) {
                    continue;
                }
                this.bricks[r][c].DispatchEvent("draw");
            }
        }
    }
    #getCompatibleSize(defaultSize) {
        // https://stackoverflow.com/a/22948632/9935654
        const defaultWidth = 520;
        const defaultHeight = 840;
        // size = defaultSize * sqrt(scaleX**2 + scaleY**2)
        return defaultSize * Math.sqrt((this.canvas.width / defaultWidth) ** 2 + (this.canvas.height / defaultHeight) ** 2);
    }
    #drawStats() {
        const fontSize = this.#getCompatibleSize(2);
        const iconSize = this.#getCompatibleSize(45);
        // https://www.w3schools.com/tags/canvas_textbaseline.asp
        this.ctx.textBaseline = "top";
        const marginTop = this.canvas.height * 0.01;
        this.ctx.fillStyle = "#1fa7ff";
        this.ctx.font = `${fontSize}em System`;
        this.ctx.drawImage(Score, this.canvas.width * 0.1, marginTop, iconSize, iconSize);
        this.ctx.fillText(`${this.score}`, this.canvas.width * 0.24, marginTop);
        // put center
        this.ctx.drawImage(Life, this.canvas.width * 0.46, marginTop, iconSize, iconSize);
        this.ctx.fillText(`${this.life}`, this.canvas.width * 0.60, marginTop);
        // put right
        this.ctx.drawImage(Level, this.canvas.width * 0.74, marginTop, iconSize, iconSize);
        this.ctx.fillText(`1`, this.canvas.width * 0.88, marginTop);
    }
    #drawMusicButton() {
        this.ctx.drawImage(this.toggleMuted.Value ? Muted : Music, this.toggleMuted.x, this.toggleMuted.y, this.toggleMuted.width, this.toggleMuted.height);
    }
    // 畫出物件
    Draw() {
        // this.ctx.fillStyle = "#dedcdc" // clear the canvas
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#drawTray();
        this.#drawBall();
        this.#drawBricks();
        this.#drawStats();
        this.#drawMusicButton();
        this.#drawMouse();
    }
    #checkLevelUp() {
        const isAllBroken = () => {
            for (let r = 0; r < this.bricks.length; ++r) {
                for (let c = 0; c < this.bricks[r].length; ++c) {
                    if (this.bricks[r][c].isAlive) {
                        return false;
                    }
                }
            }
            return true;
        };
        if (!isAllBroken()) {
            return;
        }
        if (++this.level > this.cfg.MaxLevel) {
            this.isGameOver = true;
            return;
        }
        this.ball.speed += 3;
        this.bricks = this.#createBricks(this.bricks.length + 1, this.bricks[0].length);
        this.ball.DispatchEvent("reset");
    }
    #checkGameOver() {
        if (this.life > 0 && !this.isGameOver) {
            return;
        }
        this.isGameOver = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#0e0e0e";
        this.ctx.font = `${this.#getCompatibleSize(2)}em System`;
        this.ctx.fillText("GAME OVER", this.canvas.width * 0.2, this.canvas.height * 0.2);
        if (this.life <= 0) {
            this.ctx.fillText("YOU  LOSE", this.canvas.width * 0.2, this.canvas.height * 0.4);
        }
        else {
            this.ctx.fillText(" YOU WIN ", this.canvas.width * 0.2, this.canvas.height * 0.4);
            Win.Play();
        }
        this.ctx.fillText(this.tryAgainButton.text, this.tryAgainButton.x, this.tryAgainButton.y);
    }
    #showControlMenu() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#0e0e0e";
        this.ctx.font = `${this.#getCompatibleSize(2)}em System`;
        this.ctx.fillText("Escape: Pause", this.canvas.width * 0.2, this.canvas.height * 0.2);
        this.ctx.fillText("Move: ← →", this.canvas.width * 0.2, this.canvas.height * 0.4);
        this.#drawMusicButton();
    }
    // 物件邏輯判斷部分
    Update() {
        this.tray.DispatchEvent("move");
        this.ball.DispatchEvent("move");
        this.ball.DispatchEvent("checkTrayCollision");
        this.ball.DispatchEvent("checkWallCollision");
        this.ball.DispatchEvent("checkBrickCollision");
        this.#checkLevelUp();
        this.#checkGameOver();
    }
    Loop(timeStamp) {
        // requestAnimationFrame(this.Loop) // error, this.Loop not defined (not working at the class)
        requestAnimationFrame((timeStamp) => {
            this.Loop(timeStamp);
        });
        if (timeStamp - this.lastTimeStamp < 1000 / this.FPS) {
            return;
        }
        this.lastTimeStamp = timeStamp;
        if (!this.isPause && !this.isGameOver) {
            this.Draw();
            this.Update();
        }
    }
    initControl() {
        this.initControlKey();
        // Mouse
        {
            this.canvas.addEventListener("mousemove", (e) => {
                this.mouse.x = e.clientX - this.canvas.offsetLeft;
                this.mouse.y = e.clientY - this.canvas.offsetTop;
            });
            this.canvas.addEventListener("click", (e) => {
                const x = e.clientX - this.canvas.offsetLeft;
                const y = e.clientY - this.canvas.offsetTop;
                // muted
                if (this.toggleMuted.x <= x && x <= this.toggleMuted.x + this.toggleMuted.x + this.toggleMuted.width &&
                    this.toggleMuted.y <= y && y <= this.toggleMuted.y + this.toggleMuted.y + this.toggleMuted.height) {
                    this.toggleMuted.Switch();
                    this.toggleMuted.DispatchEvent("change");
                    if (this.isPause) {
                        this.#drawMusicButton();
                    }
                    return;
                }
                // try again
                if (this.isGameOver) {
                    if (this.tryAgainButton.x <= x && x <= this.tryAgainButton.x + this.tryAgainButton.x + this.tryAgainButton.width &&
                        this.tryAgainButton.y <= y && y <= this.tryAgainButton.y + this.tryAgainButton.y + this.tryAgainButton.height) {
                        location.reload();
                        return;
                    }
                }
            });
            this.canvas.addEventListener("mouseleave", () => {
                this.mouse.x = 0;
                this.mouse.y = 0;
            });
        }
    }
    initControlKey() {
        this.canvas.tabIndex = 1; // 才可以使的canvas.addEventListener對於keyboard具有效果
        this.canvas.focus();
        this.canvas.addEventListener("keydown", (keyboardEvent) => {
            // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_event_key_key
            switch (keyboardEvent.key) {
                case "ArrowRight":
                    this.tray.moveDirection = Direction.Right;
                    this.isPause = false;
                    break;
                case "ArrowLeft":
                    this.tray.moveDirection = Direction.Left;
                    this.isPause = false;
                    break;
                case "Escape":
                    if (this.isGameOver) {
                        return;
                    }
                    this.isPause = true;
                    this.#showControlMenu();
            }
        });
        this.canvas.addEventListener("keyup", (event) => {
            this.tray.moveDirection = Direction.Null;
        });
    }
    Start() {
        InitImage()
            .then(async () => {
            this.canvas.style.backgroundImage = BG.style.backgroundImage; // "linear-gradient(6deg, #0ff .02%, rgb(0 157 245 / 20%) 99.98%)"
            await InitAudio();
        })
            .then(() => {
            this.#showControlMenu();
            this.Loop(0);
        });
    }
}

export { GameBreakout };
