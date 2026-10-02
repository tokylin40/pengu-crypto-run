# Pengu Run · Snow Survival

目前版本 v10，2026-10-02。開始／重玩／繼續按鈕直接嘗試瀏覽器全螢幕；不支援或遭拒時，維持自動滿版，無需另按。設定集中於齒輪選單，開啟即暫停。

本次更新：
- 邏輯使用 120 Hz 固定步長；10–120 FPS 下同樣 10 秒到 LEVEL 2，不再因低幀率放慢。超過 2 秒的長停頓自動暫停，避免恢復瞬間連續撞擊。
- 點擊與方向鍵使用相同的換道位置，角色與碰撞共用 lanePosition；單格約 80ms，跨兩格約 160ms，移除鍵盤獨有的 100ms 限制。
- 低價顯示五位小數；收集與熊撞擊顯示實際增減額，抵達價格下限時顯示下限提示。
- LEVEL 4 後加入交錯、折返與短暫保持路線；每排仍有一條安全線。價格、熊／洞、HP、LEVEL 1–10 的既有規則保留。
- 修正角色圖片首次失敗後，重試成功仍無法開始的問題。
- `node tests.cjs` 涵蓋上述規則、全螢幕呼叫遭拒的備援、設定暫停／恢復、價格跳字與圖片重試。

前版規則與歷史證據：

目前版本 v9，2026-10-02。手機與 PC 的三線雪地生存遊戲；靜態 Canvas，GitHub Pages 不需建置。

- 價格為遊戲成績：起價 $0.01，最低 $0.005，不是即時市場報價。
- 熊只扣價格、不扣 HP；洞在任何階段都扣 1 HP。3 HP 用完結束，沒有時間上限。鑽石護盾擋一次洞。
- 每 48 秒循環玩具、空投、熊市、牛市；20–32 秒熊市不提供獎勵，障礙約 92% 熊、8% 洞。每排保留一條安全線。
- 速度從 1.5× 持續提升至 4×；每 10 秒升一級，90 秒達 LEVEL 10。一般生成間隔從 0.76s 縮至 0.38s，熊市再乘 0.8。
- 降低收集與連擊加價；沒有 $1 目標或價格軸。價格置於上方中央，LEVEL 在旁突出顯示。PEPE / DOGE 固定模擬市值里程碑保留，資料基準仍為 2026-10-01。
- 點空白跑道直接換線；PC 也支援 ← → / A D。英文預設，中文、英文、韓文、日文同步規則。角色與雪景保持既有 NFT 美術。
- 開始遊戲後以動態 viewport 高度及安全區配置資訊列和跑道；資訊列不蓋在 canvas 上。`layout-preview.html` 可檢查 390×740、360×640、844×390、1024×768 的實際 iframe 版面。

驗證：`node tests.cjs` 通過價格底線、四階段熊／洞傷害、護盾、熊市無獎勵與障礙分布、十級連續加速、點擊與鍵盤、暫停／重玩、四語及移除價格軸。難度模型（非真人）：每 220ms 判斷，6% 決策失誤，每局最多 240s，100 種種子；舊版 90/100 達 $1，新版 5/100，最高價中位數 $0.084；完美模型仍可突破，無人工價格上限。線上 PC、390×740 直式、360×640 小螢幕、844×390 橫式已檢查邊界；不拉伸 Canvas，資訊列與跑道不重疊。小螢幕日文音效按鈕禁止折行；橫式護盾隨角色縮放，通知氣泡移到上方避免遮住角色。實體手機手感與音效仍需試玩。

以下保留歷史版本紀錄；規則以此處 v9 為準。

---

# 初始版本與歷史紀錄

First prototype, 2026-10-01. Static canvas game, no build or installation required.

## Agreed scope
30-second three-lane runner. Keyboard arrows/A/D and direct lane taps/clicks; no lower arrow buttons. Toys at 0–10s, token airdrop at 10–20s, bear chase at 20–27s, dream finish at 27–30s. Three lives, shield, collision drawdown, combo bonuses, local peak record, PNG result card, X share composer. GitHub Pages publishes the root index.html, with no build step. Fan creation, not official.

Start price is the user's hypothetical $0.009, not a live quote. $1 is a difficult game target; the run continues until 30 seconds even beyond $1. Simulation market cap uses a fixed supply of 62.86 billion PENGU and reference market caps PEPE $1,801,937,575, DOGE $14,787,233,434, from retrieved CoinGecko pages on 2026-10-01. Thus these thresholds occur before $1. Page contains links and labels; no automatic market updates.

## Validation evidence
- Node syntax checks: engine.js and game.js passed.
- Rule assertions: lane bounds, guaranteed reward lane free from same-row hazard, shield absorption, collision damage, $1 mapping and prices beyond $1, zero-health completion passed.
- DOM mock smoke: character ready, start, arrow input with button focus, swipe, pause freezes elapsed time, result display, restart resets health passed. This is not a real browser test.
- Local assets exist; generated PNG independently inspected by asset agent.
- Difficulty simulation (500 runs per synthetic strategy, not human playtesting): 35% target-selection strategy median $0.236, 0/500 at $1; 55% median $0.327, 1/500; 75% median $0.474, 7/500; perfect target selection median $0.791, 92/500. The synthetic strategy avoids hazards and can change lanes instantly, so human outcomes may differ.
- Initial difficulty was too generous: 35% strategy median $0.399. Replaced immediate combo bonuses with bonuses after 10 consecutive collections; do not revert without playtest evidence.
- v2 live desktop rendering and keyboard controls passed; real iOS/Android playtesting remains pending. Static project has no supported managed preview server. Optional WebMCP is feature-detected; supported runtime validation unavailable, not requested by user.

## Assets and collaboration
One asset-only agent used built-in imagegen for transparent penguin character (blue bucket hat and round glasses), inspected RGBA output. Main agent authored implementation and tests. No external AI cross-validation.

## Next validation
Tony to try phone and PC: readability, swipe/keys, 30s tempo, difficulty and desire to replay. Tune only after actual feedback; preserve current rules and baseline data for comparison.

## GitHub Pages publishing
Settings → Pages → Deploy from a branch → main → / (root).
The NFT edition uses nft-pengu.png, snow-world.png and game-atlas.png in the root directory; no private Site metadata or credentials are included.

## NFT snow edition · v2

User-supplied NFT is the reference for a transparent character cutout. Illustrated snowy valley and nine collectible/hazard sprites replace the prototype backdrop and emoji objects. Added falling snow, snow trails, collectible starbursts, combo feedback, rotating diamond shield, collision flash/shake, phase lighting and final sprint streaks. Mobile uses fewer particles; reduced-motion preferences disable shake, speed streaks and orbit motion. Rule changes are limited to a visual-effects event queue; price, difficulty, health and timing calculations are unchanged.

Validation: both JavaScript syntax checks and engine event assertions passed. Desktop/mobile DOM mock smoke covers loaded artwork, canvas rendering, collect/shield/damage effects, start, pause/resume, game end and retry. Live GitHub Pages rendering and keyboard controls are verified after deployment; real iOS/Android device performance remains for playtesting.

## Character motion · v3

Added `nft-runner.png`: four alternating waddling run poses, a smiling celebration pose and a surprised recoil pose. Canvas animates at 9 poses/sec, leans during lane changes, and selects temporary reaction poses for collection/shield/impact. Pause freezes the visual clock; retry resets reactions. Intro previews the same four poses. Reduced motion keeps a steady run pose and disables preview animation. Original still artwork remains as a load-failure fallback. Game rules are unchanged.

Built-in image generation was used, with the existing NFT cutout as the identity reference. Final art prompt: create a transparent 3-column/2-row atlas, same character scale and baseline, preserve blue fish-decorated bucket hat, black glasses, black igloo shirt and orange feet; cells 1–4 alternate feet and flipper swings; cell 5 cheerful raised flipper; cell 6 wide-eyed impact recoil; clean 2D NFT outlines, no labels or backdrop. Final asset was inspected for six separated poses and transparent cell gaps. No external AI or delegated agent participated in v3.

Validation: JavaScript syntax and diff checks passed. Animated/reduced-motion DOM mock checks cover four run poses versus steady pose, celebration/impact selection and expiration, pause freezing and retry resetting. Live deployment rendering is checked after publication. Physical phone frame rate remains unverified.

## Anatomy and clothing correction · v4

Tony flagged v3 flippers and clothing. Inspection found rounded mitten-like wing tips and inconsistent sleeve/collar/hem shapes. The atlas is redrawn against the original NFT cutout with restrained flat tapered wing swings, simple V-neck black shirt, consistent sleeve joins and white lower belly. Preserve the fish hat, glasses and small igloo emblem. Animation/state rules remain unchanged. Asset cache version increments to 4 in both canvas and CSS preview.

Built-in image generation, same main agent, no independent AI review. Correction prompt: six-cell transparent atlas; replace round mitten-like appendages with exactly two natural flat tapered black flippers attached behind short sleeves; consistent V collar, shirt hem and chest igloo; four restrained run steps, happy sideways wave and surprised recoil; preserve original hat, glasses and colors; no background/glow/labels. All six poses visually inspected: mitten-like tips replaced with flat tapered wings; clean consistent collar and hem; hat fish and glasses preserved; all figures fit within their cells. RGBA inter-column gap samples are fully transparent. JavaScript syntax and diff checks passed. Live rendering checked after publication.

Live v4 scale inspection also found the enlarged atlas feet overlapping the progress bar. Raised the atlas anchor by 8% of its box height and moved the ground shadow upward; canvas rules and hit timing remain unchanged.

The generated second row begins slightly before the nominal 512px grid boundary. Canvas/preview source windows use 496px row height and 500px second-row origin to preserve the hat while excluding the adjacent-row strip. This is a render crop; the source image is retained.

Added another 4% anchor clearance for the 5px running bob. Six opaque pose bounds clear the progress overlay in the desktop canvas calculation.

## Direct lane input and ten levels · v5

Tap or click the left/middle/right third of the canvas to select that lane immediately, including a direct two-lane jump. Removed lower arrow buttons and swipe-only handling. Keyboard arrows/A/D remain. Ignore secondary touch pointers and right mouse clicks; ready/paused/result states cannot move. Progress overlay allows pointers through to the canvas. Tap feedback appears at the selected point.

During the existing 30-second run, level increases every 3 seconds, capped at 10. Movement speed = 1 + 0.12 × (level − 1): 1.00× at level 1 through 2.08× at level 10. Row interval decreases from 0.900s to 0.576s. Entity age advances with the current speed, and rendering/collision use the same age to remain aligned. Rows spawn until 28.8s so the last level remains active. HUD shows level and speed; retry resets level 1. Price mapping, damage, shields and combo reward values are unchanged.

Validation: `node tests.cjs`, both JavaScript syntax checks and diff check passed. Tests cover all ten levels, monotonic speed/spawn interval, high-level collision timing, price=$1 at 100 energy, phone/desktop pointer mapping (including edges/two-lane jump), secondary-touch/right-click guards, pause, keyboard and restart. Live desktop canvas input/rendering checked after deployment; physical phone performance still pending.

Synthetic difficulty check, 300 runs per strategy (instant lane changes and hazard avoidance, not human playtesting): 35% reward-target strategy median $0.084, 0/300 reaching $1; 55% median $0.154, 0/300 reaching $1; perfect reward selection median $0.929, 105/300 reaching $1. This retains a reachable but demanding target; higher speed's human difficulty needs actual playtesting.

### v6：四語介面
- 右上角提供繁體中文、English、한국어、日本語。預設中文，記住本機選擇；切換時保留遊戲進度。
- 操作、故事、結算、分享草稿及下載戰績卡皆使用同一份 `i18n.js` 字典；史實來源連結與固定市值基準保持一致。
- `node tests.cjs` 驗證四語字典、參數完整性、來源連結、結算及切換語言不改變進度；同時保留既有換線與 LEVEL 測試。
- 韓文與日文為初版翻譯，尚未經母語玩家校閱；實體手機操作仍待玩家驗收。

### v7：不限時 HP、生存循環與開闊視野（取代 v5 的 30 秒規則）
- 3 HP；一般無護盾撞擊扣 1 HP、扣 12 能量，第三次結束。保留護盾擋一次及一般 0.8 秒撞擊保護。
- 每 48 秒循環：玩具 0–10s、空投 10–20s、熊市 20–32s、牛市 32–48s。熊市進入時清空舊物件，禁止獎勵與被動加分；每排兩個陷阱、一條安全線。熊市撞擊只扣 9 能量，不扣 HP、不消耗護盾，扣分冷卻 0.32s；熊市生成的陷阱即使跨階段仍只扣分。
- 移除所有時間上限與被動漲分；一般每排有 39%–75% 機率出現第二個陷阱，獎勵在安全線。連擊額外能量上限由 2.2 調為 1.3，避免長局太快破關。LEVEL 每 12 秒升一級，108 秒達 LEVEL 10；一般 1.00–2.08×、熊市額外 1.25×；熊市每 0.38 秒一排，持續產生物件。
- 英文為新訪客預設，手動選語言仍記憶。四語說明、戰績卡與分享文字更新為 HP 模式。
- HP、價格、時間、LEVEL、故事橫幅移到 canvas 外的資訊區；手機跑道比例由 .76 改 .58，增加約 31% 高度。跑道內不再有大型故事提示，保留短暫角色氣泡及連擊回饋。
- 音效增加低頻下降撞擊、三音收集、護盾上升音及結束音。撞擊使用 0.48 秒 ±12px、±1deg 搖晃、紅色閃光與更多粒子；減少動態效果設定停用震動。
- `node tests.cjs` 及語法／diff 檢查通過：跨 100 秒不結束／不自動加分、熊市無獎勵及三次撞擊 HP 不變、進入熊市清理殘留獎勵、一般 3 次扣血結束、循環階段、四語、換線、暫停／重玩。實體手機手感、音效主觀音量及新長局難度仍待 Tony 試玩。

### v8：螢幕內完整遊玩、補齊翻譯與連續加速（歷史版本）
- 開始／重玩／繼續時進入固定 `100dvh` 遊玩版面，隱藏原頁首、標題、說明及頁尾。資訊列與跑道共用 viewport 高度，不再以加長頁面冒充滿版；語言、音效、全螢幕及離開按鈕集中於資訊列。安全區 padding 避開手機瀏海。Canvas 根據剩餘高度重算，低高度畫面縮小角色並上移碰撞位置；切換視窗與手機工具列高度後重算。
- 「全螢幕」嘗試瀏覽器 Fullscreen API，失敗仍維持滿版版面並提示限制；可按「離開遊玩」回原頁面，暫停保留進度。實體 iOS/Android Fullscreen API 可用性仍待裝置確認。
- 翻譯補齊：等級、護盾、連擊、連擊加成、扣分／扣血字、目標標籤、故事年份／模式、休息標籤、音效開關狀態、全螢幕／離開、下載卡品牌及標題。PENGU RUN / OPEN PENGU / Pudgy Toys 等品牌名保留。
- 速度為 `1 + min(108, time)/108 × 1.08`，每秒平順加速 0.01×，108 秒到 2.08× 後維持；LEVEL 每 12 秒加一級，上限 10。取消熊市 1.25× 突然跳速。一般生成間隔也隨時間連續縮短，熊市仍維持較密集的扣分陷阱。
- Node tests、JS 語法、diff 檢查通過。連續 12,001 個時間樣本速度單調不減，LEVEL／階段交界前後無速度跳變；保留 HP、熊市、四語、點擊／鍵盤、暫停／重玩的測試。線上 viewport 邊界另行確認；實體手機與母語玩家驗收仍待 Tony 試玩。
