const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('./engine');
const e=new E(()=>.5);for(let level=1;level<=10;level++){e.time=(level-1)*3;assert.equal(e.level,level);assert.ok(Math.abs(e.speed-(1+(level-1)*.12))<1e-9);if(level>1){assert.ok(e.speed>previousSpeed);assert.ok(e.rowInterval<previousInterval)}var previousSpeed=e.speed,previousInterval=e.rowInterval;}e.time=30;assert.equal(e.level,10);e.reset();assert.equal(e.level,1);
// Rendering uses this same age: at higher levels the same object reaches collision sooner.
for(const t of [0,27]){e.reset();e.time=t;e.nextRow=99;e.entities=[{lane:1,age:2.25,reward:false,type:'red'}];e.step(.05);assert.equal(e.health,t===0?3:2)}
e.reset();e.energy=100;e.updatePrice();assert.ok(Math.abs(e.price-1)<1e-9);
for(const width of [380,1060]){
 let clock=0,frame,images=[],els={},listeners={};const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]||(()=>{})});const el=id=>els[id]??={hidden:false,style:{},classList:{add(){},remove(){}},getContext:()=>context,getBoundingClientRect:()=>({left:20,top:100,width,height:650}),addEventListener:(n,f)=>listeners[id+n]=f,setAttribute(){}};class Image{constructor(){images.push(this);this.naturalWidth=1536;this.naturalHeight=1024}set src(v){this._src=v}get src(){return this._src}}
 const box={PenguEngine:E,Image,console,document:{getElementById:el,addEventListener(){}},window:{matchMedia:()=>({matches:false}),innerWidth:width,addEventListener:(n,f)=>listeners[n]=f},performance:{now:()=>clock},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>frame=f,setTimeout(){}};vm.createContext(box);vm.runInContext(fs.readFileSync('game.js','utf8'),box);el('play').onclick();
 const tap=(fraction,extra={})=>listeners.gamepointerdown({clientX:20+width*fraction,clientY:400,isPrimary:true,pointerType:'touch',button:0,preventDefault(){},...extra});
 for(const [fraction,lane] of [[.1,0],[.9,2],[.5,1],[0,0],[1,2]]){tap(fraction);assert.equal(vm.runInContext('engine.lane',box),lane)}
 tap(.1,{isPrimary:false});assert.equal(vm.runInContext('engine.lane',box),2);tap(.1,{pointerType:'mouse',button:2});assert.equal(vm.runInContext('engine.lane',box),2);
 el('pause').onclick();tap(.1);assert.equal(vm.runInContext('engine.lane',box),2);el('resume').onclick();clock=200;listeners.keydown({key:'ArrowLeft',target:{closest:()=>false},preventDefault(){}});assert.equal(vm.runInContext('engine.lane',box),1);
 vm.runInContext('engine.time=27',box);clock+=50;frame(clock);assert.equal(el('level').textContent,'LEVEL 10 / 10');assert.equal(el('speed').textContent,'2.08×');el('retry').onclick();assert.equal(el('level').textContent,'LEVEL 1 / 10');
}
assert.ok(!fs.readFileSync('index.html','utf8').includes('id="left"'));assert.ok(!fs.readFileSync('index.html','utf8').includes('id="right"'));
console.log('PASS: ten-level progression, collision speed, pricing, mobile/desktop direct taps, input guards, keyboard, pause and retry');
