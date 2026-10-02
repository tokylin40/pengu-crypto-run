/* Endless HP runner. Prices are game scores, not market quotes. */
class PenguEngine {
 constructor(random=Math.random){this.random=random;this.reset()}
 reset(){this.time=0;this.lane=1;this.lanePosition=1;this.accumulator=0;this.route=[];this.health=3;this.energy=0;this.price=.01;this.peak=.01;this.coins=0;this.combo=0;this.shield=false;this.entities=[];this.nextRow=.65;this.done=false;this.invulnerable=0;this.notices=[];this.effects=[]}
 move(dir){if(!this.done)this.lane=Math.max(0,Math.min(2,this.lane+dir))}
 get level(){return Math.min(10,1+Math.floor((this.time+1e-9)/10))}
 get phase(){const t=Math.round(this.time*1e9)/1e9%48;return t<10?0:t<20?1:t<32?2:3}
 get speed(){return 1.5+Math.min(90,this.time)/90*2.5}
 get rowInterval(){return (.76-Math.min(90,this.time)/90*.38)*(this.phase===2?.8:1)}
 updatePrice(){this.energy=Math.max(Math.log(.5)/Math.log(100)*100,this.energy);this.price=Math.max(.005,.01*Math.pow(100,this.energy/100));this.peak=Math.max(this.peak,this.price)}
 row(){
  const r=this.random,phase=this.phase;
  if(this.level>=4&&!this.route.length){const patterns=[[0,1,2,1],[0,2,0,2],[1,1,0,1]];this.route=patterns[Math.floor(r()*patterns.length)].slice();if(r()<.5)this.route=this.route.map(l=>2-l)}
  const safe=this.route.length?this.route.shift():Math.floor(r()*3),blocked=(safe+1+Math.floor(r()*2))%3,other=3-blocked-safe;
  // One lane always stays clear. Bear markets contain mostly bears and a few holes.
  const hazard=()=>r()<(phase===2?.92:.38)?'bear':'rug';
  this.entities.push({lane:blocked,age:0,type:hazard(),reward:false});
  if(phase===2||r()<.45+this.level*.045)this.entities.push({lane:other,age:0,type:hazard(),reward:false});
  if(phase===2)return;
  const type=r()<.035?'diamond':phase===0?'toy':phase===1?'coin':r()<.5?'green':'fish';
  this.entities.push({lane:safe,age:0,type,reward:true});
 }
 // Fixed simulation steps make the clock and collisions independent of rendering FPS.
 step(dt){if(this.done||!Number.isFinite(dt)||dt<=0)return;this.accumulator+=dt;const tick=1/120;while(this.accumulator+1e-10>=tick&&!this.done){this.accumulator-=tick;this.tick(tick)}}
 tick(dt){
  const previousPhase=this.phase;this.time+=dt;
  this.lanePosition+=Math.sign(this.lane-this.lanePosition)*Math.min(Math.abs(this.lane-this.lanePosition),12.5*dt);
  this.invulnerable=Math.max(0,this.invulnerable-dt);
  if(this.phase===2&&previousPhase!==2){this.entities=[];this.route=[];this.combo=0;this.nextRow=this.time}
  if(this.time+1e-10>=this.nextRow){this.row();this.nextRow+=this.rowInterval}
  for(const e of this.entities){e.age+=dt*this.speed;if(e.age>=2.35&&!e.hit){e.hit=true;if(e.lane===Math.round(this.lanePosition))this.hit(e);if(this.health<=0){this.done=true;break}}}
  this.entities=this.entities.filter(e=>e.age<2.7);this.updatePrice();
 }

 hit(e){
  if(this.done||this.health<=0)return;const previousPrice=this.price,previousEffects=this.effects.length;
  if(e.reward){
   if(this.phase===2)return;
   if(e.type==='diamond'){this.shield=true;this.notices.push('鑽石手上線 💎');this.effects.push({kind:'shield',lane:e.lane,type:e.type})}
   else{this.coins++;this.combo++;this.energy+=(e.type==='coin'?.45:e.type==='green'?.48:.38)+Math.min(.18,Math.max(0,this.combo-10)*.01);this.effects.push({kind:'collect',lane:e.lane,type:e.type,combo:this.combo});if(this.combo%5===0)this.notices.push(`${this.combo} COMBO！企鵝起飛 🚀`)}
  }else if(this.invulnerable<=0){
   this.combo=0;
   if(e.type==='bear'){this.energy-=12;this.effects.push({kind:'penalty',lane:e.lane});this.notices.push('熊撞擊！價格下跌，HP 不變 🐻');this.invulnerable=.22}
   else if(e.type==='rug'){
    if(this.shield){this.shield=false;this.notices.push('Still holding. 💎');this.effects.push({kind:'block',lane:e.lane})}
    else{this.health--;this.effects.push({kind:'damage',lane:e.lane});this.notices.push('掉進洞！少一顆心 🕳️')}
    this.invulnerable=.28;
   }
  }
  this.updatePrice();if(this.health<=0)this.done=true;
  if(this.effects.length>previousEffects){const effect=this.effects[this.effects.length-1];effect.delta=this.price-previousPrice}
 }
}
if(typeof window!=='undefined')window.PenguEngine=PenguEngine;
if(typeof module!=='undefined')module.exports=PenguEngine;
