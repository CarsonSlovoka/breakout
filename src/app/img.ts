export let BG: HTMLImageElement
export let Life: SafeImage
export let Score: SafeImage
export let Level: SafeImage

class SafeImage extends Image {
    static async New(src: string, defaultDataURI: string, width?: number, height?: number): Promise<SafeImage> {
        const srcURL = await fetch(src, {method: "HEAD"})
            .then((res: Response) => {
                if (res.status != 200) {
                    console.warn(`${src} was not found. Use defaultDataURI instead.`)
                    return ""
                }
                return src
            })
        return new SafeImage(srcURL, defaultDataURI)
    }

    constructor(src: string, defaultDataURI: string, width?: number, height?: number) {
        super(width, height)
        this.src = src === "" ? defaultDataURI : src
    }
}


/* 這樣寫在uglifyjs會報錯，他不行直接在外面用async
export const BG = new Image()
export const Life = await SafeImage.New("./static/life.svg", "")
export const Score = await SafeImage.New("./static/score.svg", "")
export const Level = await SafeImage.New("./static/level.svg", "")
 */

(async () => {
    BG = new Image()
    BG.style.backgroundImage = "linear-gradient(4deg, #0ff .02%, rgb(165 189 207 / 20%) 90%, rgb(215 215 215 / 50%) 90%)"
    Life = await SafeImage.New("./static/life.svg", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNzAwcHQiIGhlaWdodD0iNzAwcHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMTc1IDgwIDM1MCA0NTAiPgogPGc+CiAgPHBhdGggZmlsbD0iI2NjMTYxNiIgZD0ibTQyOS41MiAyNTguNzJjMCAxMi44NzktNS42MDE2IDI1LjE5OS0xNS4xMjEgMzQuMTZsLTU1LjQ0MSA1MC45NjFjLTIuODAwOCAyLjIzODMtNS42MDE2IDMuMzU5NC04Ljk2MDkgMy4zNTk0cy02LjcxODgtMS4xMjExLTguOTYwOS0zLjM1OTRsLTU1LjQ0MS01MC45NjFjLTEwLjA3OC04Ljk2MDktMTUuMTIxLTIxLjI4MS0xNS4xMjEtMzQuMTZzNS42MDE2LTI1LjE5OSAxNS4xMjEtMzQuMTZjMTcuMzU5LTE2LjIzOCA0Ny4wMzktMTYuMjM4IDY0LjM5OC0wLjU1ODU5IDE3LjM1OS0xNS42OCA0Ny4wMzktMTUuNjggNjQuMzk4IDAuNTU4NTkgMTAuMDkgOC45NjA5IDE1LjEyOSAyMS4yODEgMTUuMTI5IDM0LjE2eiIvPgogIDxwYXRoIGZpbGw9IiNlMjJiNmIiIGQ9Im0zNTAgOTAuNzE5Yy0xMDQuNzIgMC0xODkuMjggODUuMTIxLTE4OS4yOCAxODkuMjggMCAxMDQuNzIgODUuMTIxIDE4OS4yOCAxODkuMjggMTg5LjI4IDEwNC43MiAwIDE4OS4yOC04NS4xMjEgMTg5LjI4LTE4OS4yOCAwLTEwNC43Mi04NC41NjItMTg5LjI4LTE4OS4yOC0xODkuMjh6bTAgMzUxLjY4Yy04OS42MDIgMC0xNjIuNC03Mi44MDEtMTYyLjQtMTYyLjQgMC04OS42MDIgNzIuODAxLTE2Mi40IDE2Mi40LTE2Mi40IDg5LjYwMiAwIDE2Mi40IDcyLjgwMSAxNjIuNCAxNjIuNCAwIDg5LjYwMi03Mi43OTcgMTYyLjQtMTYyLjQgMTYyLjR6Ii8+CiA8L2c+Cjwvc3ZnPgo=")
    Score = await SafeImage.New("./static/score.svg", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzAwcHQiIGhlaWdodD0iNzAwcHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMTAwIDMwMCA1MDAgNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogPGcgZmlsbD0iI0ZBRkYwMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI2Ij4KICA8cGF0aCBkPSJtNDQzLjg4IDI0MC41NWMtMC42NjAxNi0yLjAyNzMtMi40MTQxLTMuNTAzOS00LjUxOTUtMy44MTI1bC01OC4yNzctOC40NzI3LTI2LjA2Mi01Mi44MDljLTEuODk0NS0zLjgzMi04LjE1MjMtMy44MzItMTAuMDQ3IDBsLTI2LjA2MiA1Mi44MDktNTguMjc3IDguNDcyN2MtMi4xMDU1IDAuMzA4NTktMy44NTk0IDEuNzgxMi00LjUxOTUgMy44MTI1LTAuNjYwMTYgMi4wMjM0LTAuMTEzMjggNC4yNSAxLjQxOCA1LjczNDRsNDIuMTY4IDQxLjEwOS05Ljk1MzEgNTguMDM5Yy0wLjM1OTM4IDIuMTAxNiAwLjUwMzkxIDQuMjIyNyAyLjIzMDUgNS40NzY2IDEuNzI2NiAxLjI2MTcgNC4wMDc4IDEuNDIxOSA1Ljg5ODQgMC40MjU3OGw1Mi4xMjEtMjcuMzk4IDUyLjEyNSAyNy40MDJjMC44MTY0MSAwLjQyOTY5IDEuNzE0OCAwLjY0NDUzIDIuNjA1NSAwLjY0NDUzIDEuMTYwMiAwIDIuMzIwMy0wLjM1OTM4IDMuMjkzLTEuMDcwMyAxLjcyNjYtMS4yNTM5IDIuNTg1OS0zLjM3NSAyLjIzMDUtNS40NzY2bC05Ljk1MzEtNTguMDM5IDQyLjE2OC00MS4xMDljMS41MjM0LTEuNDg4MyAyLjA3MDMtMy43MTg4IDEuNDE0MS01LjczODN6Ii8+CiAgPHBhdGggZD0ibTEyMC42OCAyOTguNjljLTAuNjYwMTYgMi4wMjM0LTAuMTEzMjggNC4yNSAxLjQxOCA1LjczNDRsMzIuNjEzIDMxLjc5Ny03LjY5OTIgNDQuODkxYy0wLjM1OTM3IDIuMTAxNiAwLjUwMzkxIDQuMjIyNyAyLjIzMDUgNS40NzY2IDEuNzMwNSAxLjI2MTcgNC4wMTU2IDEuNDI5NyA1Ljg5ODQgMC40MjU3OGw0MC4zMTItMjEuMTkxIDQwLjMxMiAyMS4xOTFjMC44MTY0MSAwLjQyOTY5IDEuNzE0OCAwLjY0NDUzIDIuNjA1NSAwLjY0NDUzIDEuMTYwMiAwIDIuMzIwMy0wLjM1OTM4IDMuMjkzLTEuMDcwMyAxLjcyNjYtMS4yNTM5IDIuNTg1OS0zLjM3NSAyLjIzMDUtNS40NzY2bC03LjY5OTItNDQuODk1IDMyLjYxMy0zMS43OTNjMS41MjM0LTEuNDg4MyAyLjA3ODEtMy43MTA5IDEuNDE4LTUuNzM0NC0wLjY2MDE2LTIuMDI3My0yLjQxNDEtMy41MDM5LTQuNTE5NS0zLjgxMjVsLTQ1LjA3NC02LjU1ODYtMjAuMTU2LTQwLjg0Yy0xLjg4NjctMy44MzItOC4xNjAyLTMuODMyLTEwLjA0NyAwbC0yMC4xNTYgNDAuODQtNDUuMDc0IDYuNTU4NmMtMi4xMTMzIDAuMzA4NTktMy44NTk0IDEuNzg1Mi00LjUxOTUgMy44MTI1eiIvPgogIDxwYXRoIGQ9Im01NzkuMzIgMjk4LjY5Yy0wLjY2MDE2LTIuMDI3My0yLjQxNDEtMy41MDM5LTQuNTE5NS0zLjgxMjVsLTQ1LjA3NC02LjU1ODYtMjAuMTU2LTQwLjg0Yy0xLjg4NjctMy44MzItOC4xNjAyLTMuODMyLTEwLjA0NyAwbC0yMC4xNTYgNDAuODQtNDUuMDc0IDYuNTU4NmMtMi4xMDU1IDAuMzA4NTktMy44NTk0IDEuNzgxMi00LjUxOTUgMy44MTI1LTAuNjYwMTYgMi4wMjM0LTAuMTEzMjggNC4yNSAxLjQxOCA1LjczNDRsMzIuNjEzIDMxLjc5My03LjY5OTIgNDQuODk1Yy0wLjM1OTM4IDIuMTAxNiAwLjUwMzkxIDQuMjIyNyAyLjIzMDUgNS40NzY2IDAuOTcyNjYgMC43MTA5NCAyLjEzMjggMS4wNzAzIDMuMjkzIDEuMDcwMyAwLjg5MDYzIDAgMS43ODUyLTAuMjEwOTQgMi42MDU1LTAuNjQ0NTNsNDAuMzEyLTIxLjE5MSA0MC4zMTIgMjEuMTkxYzEuODk0NSAxLjAwMzkgNC4xNzE5IDAuODI4MTIgNS44OTg0LTAuNDI1NzggMS43MjY2LTEuMjUzOSAyLjU4NTktMy4zNzUgMi4yMzA1LTUuNDc2NmwtNy42OTkyLTQ0Ljg5MSAzMi42MTMtMzEuNzk3YzEuNTMxMi0xLjQ4NDQgMi4wODItMy43MTA5IDEuNDE4LTUuNzM0NHoiLz4KIDwvZz4KPC9zdmc+Cg==")
    Level = await SafeImage.New("./static/level.svg", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzAwcHQiIGhlaWdodD0iNzAwcHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBmaWxsPSJ5ZWxsb3ciIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNiIgZD0ibTQ5MCAyODB2LTI0NWgtMzV2MTcuNWgtMTY0LjMybDI0LjMyNCA3MC0yMy40NDkgNzBoMTYzLjQ1djg3LjVoLTEwNXY3MGgtODcuNXY3MGgtODcuNXY3MGgtNzB2MzVoNDkwdi0yNDV6bS0xNTAuNjgtMTIyLjUgMTEuNTUxLTM1LTExLjU1MS0zNWgxMTUuNjh2NzB6bTIyMC42OCAzMzIuNWgtMzUwdi0zNWg4Ny41di03MGg4Ny41di03MGgxNzV6Ii8+Cjwvc3ZnPgo=")
})()
