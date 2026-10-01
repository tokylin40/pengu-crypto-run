/* Endless HP runner. Prices are game scores, not market quotes. */
class PenguEngine {
 constructor(random=Math.random){this.random=random;this.reset()}
 reset(){this.time=0;this.lane=1;this.health=3;this.energy=0;this.price=.009;this.peak=.009;this.coins=0;this.combo=0;this.shield=false;this.entities=[];this.nextRow=.8;this.done=false;this.invulnerable=0;this.notices=[];this.effects=[]}
 move(dir){if(!this.done)this.lane=Math.max(0,Math.min(2,this.lane+dir))}
 get level(){return Math.min(10,1+Math.floor(this.time/12))}
 get phase(){const t=this.time%48;return t<10?0:t<20?1:t<32?2:3}
 get speed(){return (1+(this.level-1)*.12)*(this.phase===2?1.25:1)}
 get rowInterval(){return this.phase===2?.38:.9-(this.level-1)*.036}
 updatePrice(){this.energy=Math.max(0,Math.min(125,this.energy));this.price=.009*Math.pow(1/.009,this.energy/100);this.peak=Math.max(this.peak,this.price)}
 row(){const r=this.random,phase=this.phase,blocked=Math.floor(r()*3),safe=(blocked+1+Math.floor(r()*2))%3,other=3-blocked-safe;const hazard=phase===0?'cart':phase===1?'red':r()<.5?'bear':'rug';this.entities.push({lane:blocked,age:0,type:hazard,reward:false,penaltyOnly:phase===2});if(phase===2||r()<.35+this.level*.04)this.entities.push({lane:other,age:0,type:phase===2?'bear':'rug',reward:false,penaltyOnly:phase===2});if(phase===2)return;const type=r()<.08?'diamond':phase===0?'toy':phase===1?'coin':r()<.5?'green':'fish';this.entities.push({lane:safe,age:0,type,reward:true})}
 step(dt){if(this.done)return;dt=Math.min(.05,Math.max(0,dt));const previousPhase=this.phase;this.time+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);if(this.phase===2&&previousPhase!==2){this.entities=[];this.combo=0;this.nextRow=this.time;}if(this.time>=this.nextRow){this.row();this.nextRow=this.time+this.rowInterval}for(const e of this.entities){e.age+=dt*this.speed;if(e.age>=2.35&&!e.hit){e.hit=true;if(e.lane===this.lane)this.hit(e)}}this.entities=this.entities.filter(e=>e.age<2.7);this.updatePrice();if(this.health<=0)this.done=true}
 hit(e){if(e.reward){if(this.phase===2)return;if(e.type==='diamond'){this.shield=true;this.notices.push('鑽石手上線 💎');this.effects.push({kind:'shield',lane:e.lane,type:e.type})}else{this.coins++;this.combo++;this.energy+=(e.type==='coin'?1.3:e.type==='green'?1.4:1)+Math.min(1.3,Math.max(0,this.combo-10)*.065);this.effects.push({kind:'collect',lane:e.lane,type:e.type,combo:this.combo});if(this.combo%5===0)this.notices.push(`${this.combo} COMBO！企鵝起飛 🚀`)}}else if(this.invulnerable<=0){this.combo=0;if(e.penaltyOnly||this.phase===2){this.energy-=9;this.effects.push({kind:'penalty',lane:e.lane});this.notices.push('熊市回撤！扣分不扣血 🐻');this.invulnerable=.32;}else{if(this.shield){this.shield=false;this.notices.push('Still holding. 💎');this.effects.push({kind:'block',lane:e.lane})}else{this.health--;this.energy-=12;this.effects.push({kind:'damage',lane:e.lane});this.notices.push(e.type==='rug'?'我本來就打算長期持有。':e.type==='cart'?'借過！企鵝送貨中！':'Healthy correction. 😅')}this.invulnerable=.8;}}}
}
if(typeof window!=='undefined')window.PenguEngine=PenguEngine;
if(typeof module!=='undefined')module.exports=PenguEngine;
