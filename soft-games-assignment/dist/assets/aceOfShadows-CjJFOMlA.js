import{A as m,a as C,S,d as w,t as g}from"./main-BUeuKrOs.js";const u=document.getElementById("aceOfShadowsCanvas"),f=960,E=720,p=f/2,y=E/2,r=144,l=new m({width:f,height:E,backgroundColor:16777215,view:u}),N=document.getElementById("fullscreenButton");N?.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():u?.requestFullscreen()});function T(n,e,s){g(l,n,e,s)}function v(n,e,s){return function d(o,c){if(o<0)return;const a=e[o],t=s.x+Math.floor((o-r)/10),i=s.y+Math.floor((o-r)/10);T(a,{x:t,y:i},c),a.zIndex=r-o,setTimeout(()=>d(o-1,c),n)}}async function I(){console.log("Ace of Shadows initialized"),l.stage.sortableChildren=!0;const n=await C.load("resources/card.png"),e=new Array(r),s=n.width*2,d=n.height/2,o=p-s,c=y-d;for(let t=0;t<r;t++){e[t]=S.from(n);const i=o-Math.floor(t/10),h=c-Math.floor(t/10);e[t].setTransform(i,h),e[t].zIndex=t,l.stage.addChild(e[t])}const a={x:o+300,y:c};v(1e3,e,a)(e.length-1,2e3),w(l)}await I();
