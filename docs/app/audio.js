export let WallHit;
export let BrickHit;
export let TrayHit;
export let LifeLost;
export let Win;
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
export async function InitAudio() {
    WallHit = await SafeAudio.New("./static/audio/wall_hit.mp3");
    BrickHit = await SafeAudio.New("./static/audio/brick_hit.mp3");
    TrayHit = await SafeAudio.New("./static/audio/tray_hit.mp3");
    LifeLost = await SafeAudio.New("./static/audio/life_lost.mp3");
    Win = await SafeAudio.New("./static/audio/win.mp3");
}
