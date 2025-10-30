import{a3 as S,a6 as F,aF as j,_ as p,g as Z,s as q,a as H,b as J,p as K,o as Q,l as z,c as X,C as Y,G as ee,M as te,d as ae,x as re,E as ne}from"./mermaid.core-CrFJ_I5V.js";import{p as ie}from"./chunk-4BX2VUAB-aat7qeV6.js";import{p as se}from"./treemap-KMMF4GRG-_b60_Er1.js";import"./index-BE5pm9RX.js";import{d as I}from"./arc-DG2-tcsT.js";import{o as oe}from"./ordinal-Cboi1Yqb.js";import"./purify.es-B6FQ9oRL.js";import"./_baseUniq--_hBNEAI.js";import"./_basePickBy-DAElZAB7.js";import"./clone-CKYTEcEB.js";import"./init-Gi6I4Gst.js";function le(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function ue(){var e=ce,a=le,f=null,x=S(0),s=S(F),l=S(0);function o(t){var n,c=(t=j(t)).length,d,y,h=0,u=new Array(c),i=new Array(c),v=+x.apply(this,arguments),w=Math.min(F,Math.max(-F,s.apply(this,arguments)-v)),m,D=Math.min(Math.abs(w)/c,l.apply(this,arguments)),$=D*(w<0?-1:1),g;for(n=0;n<c;++n)(g=i[u[n]=n]=+e(t[n],n,t))>0&&(h+=g);for(a!=null?u.sort(function(A,C){return a(i[A],i[C])}):f!=null&&u.sort(function(A,C){return f(t[A],t[C])}),n=0,y=h?(w-c*$)/h:0;n<c;++n,v=m)d=u[n],g=i[d],m=v+(g>0?g*y:0)+$,i[d]={data:t[d],index:n,value:g,startAngle:v,endAngle:m,padAngle:D};return i}return o.value=function(t){return arguments.length?(e=typeof t=="function"?t:S(+t),o):e},o.sortValues=function(t){return arguments.length?(a=t,f=null,o):a},o.sort=function(t){return arguments.length?(f=t,a=null,o):f},o.startAngle=function(t){return arguments.length?(x=typeof t=="function"?t:S(+t),o):x},o.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:S(+t),o):s},o.padAngle=function(t){return arguments.length?(l=typeof t=="function"?t:S(+t),o):l},o}var pe=ne.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,de=structuredClone(pe),ge=p(()=>structuredClone(de),"getConfig"),fe=p(()=>{T=new Map,N=G.showData,re()},"clear"),me=p(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),z.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=p(()=>T,"getSections"),ve=p(e=>{N=e},"setShowData"),Se=p(()=>N,"getShowData"),L={getConfig:ge,clear:fe,setDiagramTitle:Q,getDiagramTitle:K,setAccTitle:J,getAccTitle:H,setAccDescription:q,getAccDescription:Z,addSection:me,getSections:he,setShowData:ve,getShowData:Se},xe=p((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ye={parse:p(async e=>{const a=await se("pie",e);z.debug(a),xe(a,L)},"parse")},we=p(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),Ae=we,Ce=p(e=>{const a=[...e.values()].reduce((s,l)=>s+l,0),f=[...e.entries()].map(([s,l])=>({label:s,value:l})).filter(s=>s.value/a*100>=1).sort((s,l)=>l.value-s.value);return ue().value(s=>s.value)(f)},"createPieArcs"),De=p((e,a,f,x)=>{z.debug(`rendering pie chart
`+e);const s=x.db,l=X(),o=Y(s.getConfig(),l.pie),t=40,n=18,c=4,d=450,y=d,h=ee(a),u=h.append("g");u.attr("transform","translate("+y/2+","+d/2+")");const{themeVariables:i}=l;let[v]=te(i.pieOuterStrokeWidth);v??=2;const w=o.textPosition,m=Math.min(y,d)/2-t,D=I().innerRadius(0).outerRadius(m),$=I().innerRadius(m*w).outerRadius(m*w);u.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=s.getSections(),A=Ce(g),C=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let E=0;g.forEach(r=>{E+=r});const W=A.filter(r=>(r.data.value/E*100).toFixed(0)!=="0"),b=oe(C);u.selectAll("mySlices").data(W).enter().append("path").attr("d",D).attr("fill",r=>b(r.data.label)).attr("class","pieCircle"),u.selectAll("mySlices").data(W).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...g.entries()].map(([r,M])=>({label:r,value:M})),k=u.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(r,M)=>{const R=n+c,B=R*O.length/2,V=12*n,U=M*R-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>b(r.label)).style("stroke",r=>b(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),P=y+t+n+c+_;h.attr("viewBox",`0 0 ${P} ${d}`),ae(h,d,P,o.useMaxWidth)},"draw"),$e={draw:De},Pe={parser:ye,db:L,renderer:$e,styles:Ae};export{Pe as diagram};
