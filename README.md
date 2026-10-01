# Pengu Run · Road to $1

First prototype, 2026-10-01. Static canvas game, no build or installation required.

## Agreed scope
30-second three-lane runner. Keyboard arrows/A/D, touch swipe and on-screen buttons. Toys at 0–10s, token airdrop at 10–20s, bear chase at 20–27s, dream finish at 27–30s. Three lives, shield, collision drawdown, combo bonuses, local peak record, PNG result card, X share composer. GitHub Pages publishes the root index.html, with no build step. Fan creation, not official.

Start price is the user's hypothetical $0.009, not a live quote. $1 is a difficult game target; the run continues until 30 seconds even beyond $1. Simulation market cap uses a fixed supply of 62.86 billion PENGU and reference market caps PEPE $1,801,937,575, DOGE $14,787,233,434, from retrieved CoinGecko pages on 2026-10-01. Thus these thresholds occur before $1. Page contains links and labels; no automatic market updates.

## Validation evidence
- Node syntax checks: engine.js and game.js passed.
- Rule assertions: lane bounds, guaranteed reward lane free from same-row hazard, shield absorption, collision damage, $1 mapping and prices beyond $1, zero-health completion passed.
- DOM mock smoke: character ready, start, arrow input with button focus, swipe, pause freezes elapsed time, result display, restart resets health passed. This is not a real browser test.
- Local assets exist; generated PNG independently inspected by asset agent.
- Difficulty simulation (500 runs per synthetic strategy, not human playtesting): 35% target-selection strategy median $0.236, 0/500 at $1; 55% median $0.327, 1/500; 75% median $0.474, 7/500; perfect target selection median $0.791, 92/500. The synthetic strategy avoids hazards and can change lanes instantly, so human outcomes may differ.
- Initial difficulty was too generous: 35% strategy median $0.399. Replaced immediate combo bonuses with bonuses after 10 consecutive collections; do not revert without playtest evidence.
- Browser rendering and real iOS/Android/PC playtesting remain pending. Static project has no supported managed preview server. Optional WebMCP is feature-detected; supported runtime validation unavailable, not requested by user.

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
