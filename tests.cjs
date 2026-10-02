const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('./engine');
const e=new E(()=>.5);for(let level=1;level<=10;level++){e.time=(level-1)*10;assert.equal(e.level,level);assert.ok(Math.abs(e.speed-(1.5+(level-1)*2.5/9))<1e-9);if(level>1){assert.ok(e.speed>previousSpeed);assert.ok(e.rowInterval/(e.phase===2?.8:1)<previousInterval)}var previousSpeed=e.speed,previousInterval=e.rowInterval/(e.phase===2?.8:1);}e.time=120;assert.equal(e.level,10);e.reset();assert.equal(e.level,1);
// Rendering uses this same age: at higher levels the same object reaches collision sooner.
for(const t of [0,90]){e.reset();e.time=t;e.nextRow=99;e.entities=[{lane:1,age:2.25,reward:false,type:'rug'}];e.step(.05);assert.equal(e.health,t===0?3:2)}
e.reset();e.energy=100;e.updatePrice();assert.ok(Math.abs(e.price-1)<1e-9);
for(const width of [380,1060]){
 let clock=0,frame,images=[],els={},listeners={},fullscreenRequests=0;const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]||(()=>{})});const el=id=>els[id]??={hidden:false,style:{},dataset:{},classList:{add(){},remove(){}},getContext:()=>context,getBoundingClientRect:()=>({left:20,top:100,width,height:650}),addEventListener:(n,f)=>listeners[id+n]=f,append(){},setAttribute(n,v){this[n]=v}};class Image{constructor(){images.push(this);this.naturalWidth=1536;this.naturalHeight=1024}set src(v){this._src=v}get src(){return this._src}}
 const box={PenguEngine:E,Image,console,document:{getElementById:el,querySelector:el,body:el("body"),documentElement:{requestFullscreen:()=>{fullscreenRequests++;return Promise.reject(Error("browser policy"))}},addEventListener(){}},window:{matchMedia:()=>({matches:false}),innerWidth:width,addEventListener:(n,f)=>listeners[n]=f},performance:{now:()=>clock},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>frame=f,setTimeout(){}};vm.createContext(box);vm.runInContext(fs.readFileSync('i18n.js','utf8'),box);box.PenguI18n=box.window.PenguI18n;vm.runInContext(fs.readFileSync('game.js','utf8'),box);el('play').onclick();assert.equal(fullscreenRequests,1);assert.equal(vm.runInContext('mode',box),'running');
 const tap=(fraction,extra={})=>listeners.gamepointerdown({clientX:20+width*fraction,clientY:400,isPrimary:true,pointerType:'touch',button:0,preventDefault(){},...extra});
 for(const [fraction,lane] of [[.1,0],[.9,2],[.5,1],[0,0],[1,2]]){tap(fraction);assert.equal(vm.runInContext('engine.lane',box),lane)}
 tap(.1,{isPrimary:false});assert.equal(vm.runInContext('engine.lane',box),2);tap(.1,{pointerType:'mouse',button:2});assert.equal(vm.runInContext('engine.lane',box),2);
 el('pause').onclick();tap(.1);assert.equal(vm.runInContext('engine.lane',box),2);el('resume').onclick();clock=200;listeners.keydown({key:'ArrowLeft',target:{closest:()=>false},preventDefault(){}});assert.equal(vm.runInContext('engine.lane',box),1);
 vm.runInContext('engine.time=90',box);clock+=50;frame(clock);assert.equal(el('level').textContent,'LEVEL 10 / 10');assert.equal(el('speed').textContent,'4.00×');for(const lang of ['en','ko','ja','zh-Hant']){const state=vm.runInContext('JSON.stringify([engine.time,engine.lane,engine.health,mode])',box);el('language').value=lang;el('language').onchange();assert.equal(box.document.documentElement.lang,lang);assert.equal(vm.runInContext('JSON.stringify([engine.time,engine.lane,engine.health,mode])',box),state);assert.ok(el('.facts [data-fact="0"]').innerHTML.includes('https://'));vm.runInContext('finish()',box);assert.ok(el('result-title').textContent);el('language').value=lang;el('language').onchange();assert.ok(el('coins').textContent);vm.runInContext("mode='running'",box)}
 el('retry').onclick();assert.equal(el('level').textContent,'等級 1 / 10');
 el('play-settings').open=true;el('play-settings').ontoggle();assert.equal(vm.runInContext('mode',box),'paused');el('resume').onclick();assert.equal(el('play-settings').open,false);assert.equal(vm.runInContext('mode',box),'running');
 vm.runInContext('engine.nextRow=Infinity;engine.entities=[]',box);clock+=100;frame(clock);assert.ok(Math.abs(vm.runInContext('engine.time',box)-.1)<1e-8);
 vm.runInContext("engine.hit({lane:1,reward:true,type:'coin'})",box);clock+=17;frame(clock);assert.ok(el('price-delta').textContent.startsWith('+$0.000'));assert.equal(el('price-delta').hidden,false);
 images[0].onerror();images[0].onload();assert.equal(el('play').onclick,vm.runInContext('start',box));
 clock+=1000;frame(clock);assert.equal(vm.runInContext('mode',box),'paused');

}
assert.ok(!fs.readFileSync('index.html','utf8').includes('id="left"'));assert.ok(!fs.readFileSync('index.html','utf8').includes('id="right"'));
console.log('PASS: ten-level progression, collision speed, pricing, mobile/desktop direct taps, input guards, keyboard, pause and retry');

const i18nBox={window:{}};vm.runInNewContext(fs.readFileSync('i18n.js','utf8'),i18nBox);const translations=i18nBox.window.PenguI18n;for(const values of Object.values(translations.keys)){assert.equal(values.length,4);assert.ok(values.every(v=>typeof v==='string'&&v.length));const tokens=v=>[...v.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort().join(',');assert.ok(values.every(v=>tokens(v)===tokens(values[0])))}console.log('PASS: four languages, placeholder parity, source links, result translations and unchanged run state');

// Endless runs and bear score penalties, including entry cleanup and phase cycling.
const survival=new E(()=>.5);survival.nextRow=Infinity;for(let i=0;i<2000;i++){survival.entities=[];survival.nextRow=Infinity;survival.step(.05)}assert.ok(survival.time>99);assert.equal(survival.done,false);assert.equal(survival.price,.01);
survival.reset();survival.time=20;survival.energy=50;survival.row();assert.equal(survival.entities.length,2);assert.ok(survival.entities.every(e=>!e.reward&&e.type==='bear'));for(let i=0;i<3;i++){survival.invulnerable=0;survival.hit(survival.entities[0]);}survival.updatePrice();assert.equal(survival.health,3);assert.equal(survival.energy,14);assert.equal(survival.done,false);assert.equal(survival.coins,0);survival.hit({reward:true,type:'coin',lane:1});assert.equal(survival.coins,0);
survival.reset();survival.time=19.99;survival.entities=[{age:2.30,reward:true,type:'coin',lane:1}];survival.step(.02);assert.ok(survival.entities.every(e=>!e.reward));assert.equal(survival.coins,0);
survival.reset();for(let i=0;i<3;i++){survival.invulnerable=0;survival.hit({reward:false,type:'rug',lane:1});survival.step(.01)}assert.equal(survival.health,0);assert.equal(survival.done,true);
for(const [time,phase] of [[0,0],[10,1],[20,2],[32,3],[48,0],[68,2]]){survival.time=time;assert.equal(survival.phase,phase)}
console.log('PASS: no time limit/passive points, bear penalties never damage HP or reward points, clear bear entry, three HP hits end, repeating phases');

const acceleration=new E();let previous=0;for(let i=0;i<=12000;i++){acceleration.time=i/100;assert.ok(acceleration.speed>=previous);previous=acceleration.speed;}for(const boundary of [10,20,30,32,48,68,90]){acceleration.time=boundary-.001;const before=acceleration.speed;acceleration.time=boundary+.001;assert.ok(Math.abs(acceleration.speed-before)<.001)}acceleration.time=6;assert.ok(Math.abs(acceleration.speed-(1.5+6/90*2.5))<1e-9);acceleration.time=90;assert.equal(acceleration.level,10);assert.ok(Math.abs(acceleration.speed-4)<1e-9);
console.log('PASS: continuous monotonic speed, no phase/level-boundary jumps, level 10 cap');

// Price bounds and collision rules do not depend on the current market phase.
for(const time of [0,10,20,32]){
 const game=new E();game.time=time;game.energy=50;game.updatePrice();const before=game.price;
 game.hit({type:'bear',reward:false,lane:1});game.updatePrice();assert.equal(game.health,3);assert.ok(game.price<before);
 game.invulnerable=0;const price=game.price;game.hit({type:'rug',reward:false,lane:1});game.updatePrice();assert.equal(game.health,2);assert.equal(game.price,price);
 game.invulnerable=0;game.shield=true;game.hit({type:'rug',reward:false,lane:1});assert.equal(game.health,2);assert.equal(game.shield,false);
}
const floor=new E();assert.equal(floor.price,.01);for(let i=0;i<100;i++){floor.invulnerable=0;floor.hit({type:'bear',reward:false,lane:1});floor.updatePrice()}assert.ok(Math.abs(floor.price-.005)<1e-12);assert.equal(floor.health,3);floor.time=0;floor.hit({type:'coin',reward:true,lane:1});floor.updatePrice();assert.ok(floor.price>.005);
let seed=1;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);const distribution=new E(random);distribution.time=20;let bears=0,holes=0;for(let i=0;i<1000;i++){distribution.entities=[];distribution.row();assert.equal(distribution.entities.length,2);assert.notEqual(distribution.entities[0].lane,distribution.entities[1].lane);for(const item of distribution.entities){assert.equal(item.reward,false);if(item.type==='bear')bears++;else holes++}}assert.ok(bears>holes*8);assert.ok(holes>0);
assert.ok(!fs.readFileSync('index.html','utf8').includes('class="journey"'));assert.ok(!fs.readFileSync('game.js','utf8').includes("$('progress')"));for(const file of ['index.html','game.js','i18n.js'])assert.ok(!/\$1(?![0-9.])/.test(fs.readFileSync(file,'utf8')));
console.log('PASS: $0.01 start/$0.005 floor, bears only cut price, holes cost HP in every phase, shield, mostly-bear distribution, no target/price axis');

// Identical elapsed simulation at render rates down to 10 FPS.
for(const fps of [120,60,30,20,15,10]){const game=new E();game.nextRow=Infinity;for(let i=0;i<fps*10;i++)game.step(1/fps);assert.ok(Math.abs(game.time-10)<1e-8);assert.equal(game.level,2)}
// Rendered lane position is also the source of collision lane, not the future target.
const turning=new E();turning.nextRow=Infinity;turning.move(1);assert.equal(turning.lane,2);assert.equal(turning.lanePosition,1);turning.entities=[{lane:1,age:2.34,type:'rug',reward:false}];turning.step(1/120);assert.equal(turning.health,2);assert.ok(turning.lanePosition<1.5);turning.step(.2);assert.equal(turning.lanePosition,2);
const turningAway=new E();turningAway.nextRow=Infinity;turningAway.move(1);turningAway.entities=[{lane:1,age:2.25,type:'rug',reward:false}];turningAway.step(.1);assert.equal(turningAway.health,3);
const feedback=new E();feedback.hit({lane:1,type:'coin',reward:true});assert.ok(feedback.effects[0].delta>0);const beforeBear=feedback.price;feedback.hit({lane:1,type:'bear',reward:false});assert.ok(Math.abs(feedback.effects[1].delta-(feedback.price-beforeBear))<1e-12);feedback.invulnerable=0;feedback.hit({lane:1,type:'bear',reward:false});assert.ok(feedback.effects[2].delta<0);feedback.invulnerable=0;feedback.hit({lane:1,type:'bear',reward:false});assert.equal(feedback.effects[3].delta,0);
console.log('PASS: auto fullscreen attempt/fallback, settings pause, image retry, 10–120 FPS clocks, synchronized lane collision, actual price deltas');
for(const time of [30,60,90,120]){const routes=new E(()=>.5);routes.time=time;for(let i=0;i<12;i++){routes.entities=[];routes.row();const blocked=new Set(routes.entities.filter(e=>!e.reward).map(e=>e.lane));assert.ok(blocked.size<=2);for(const reward of routes.entities.filter(e=>e.reward))assert.ok(!blocked.has(reward.lane));}assert.ok(routes.route.length<=4)}
console.log('PASS: patterned rows always retain an unobstructed lane');
