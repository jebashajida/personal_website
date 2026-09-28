import { clamp } from './utils.js';

/**
 * Small native WebGL sculpture renderer. No external assets or dependencies.
 * Rotates a procedural torus knot, rounded cube, and satellite forms.
 * Pixel ratio is capped, animation is throttled to 30 fps and suspended when
 * offscreen or hidden. Reduced-motion users start with a still composition.
 * dispose() releases buffers, shader programs, observers and event handlers.
 */
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const dot = (a,b) => a.reduce((sum,v,i)=>sum+v*b[i],0);
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const normalize = a => { const length=Math.hypot(...a)||1; return a.map(v=>v/length); };
const identity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
function multiply(a,b) {
  const out=new Array(16).fill(0);
  for(let c=0;c<4;c++) for(let r=0;r<4;r++) for(let k=0;k<4;k++) out[c*4+r]+=a[k*4+r]*b[c*4+k];
  return out;
}
const translation=(x,y,z)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1];
const scale=s=>[s,0,0,0,0,s,0,0,0,0,s,0,0,0,0,1];
const rotateX=a=>[1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1];
const rotateY=a=>[Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),0,Math.cos(a),0,0,0,0,1];
const rotateZ=a=>[Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1,0,0,0,0,1];
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);

function perspective(fov,aspect,near,far) {
  const f=1/Math.tan(fov/2), nf=1/(near-far);
  return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0];
}
function lookAt(eye,target) {
  const z=normalize(sub(eye,target)),x=normalize(cross([0,1,0],z)),y=cross(z,x);
  return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
}
function parametric(rows,columns,sample) {
  const positions=[], normals=[], indices=[];
  for(let i=0;i<=rows;i++) for(let j=0;j<=columns;j++) {
    const point=sample(i/rows,j/columns); positions.push(...point.position); normals.push(...point.normal);
  }
  for(let i=0;i<rows;i++) for(let j=0;j<columns;j++) {
    const a=i*(columns+1)+j,b=a+columns+1;
    indices.push(a,b,a+1,a+1,b,b+1);
  }
  return {positions,normals,indices};
}
function knot() {
  const curve=t=>[(2+Math.cos(3*t))*Math.cos(2*t)*.39,(2+Math.cos(3*t))*Math.sin(2*t)*.39,Math.sin(3*t)*.39];
  return parametric(196,16,(u,v)=>{
    const t=u*Math.PI*2, center=curve(t), tangent=normalize(sub(curve(t+.0001),curve(t-.0001)));
    const normalA=normalize(cross(tangent,[0,0,1])), normalB=normalize(cross(tangent,normalA));
    const normal=normalA.map((value,i)=>value*Math.cos(v*Math.PI*2)+normalB[i]*Math.sin(v*Math.PI*2));
    return {position:center.map((value,i)=>value+normal[i]*.2),normal};
  });
}
function torus(radius,tube) {
  return parametric(72,16,(u,v)=>{
    const a=u*Math.PI*2,b=v*Math.PI*2;
    return {position:[(radius+tube*Math.cos(b))*Math.cos(a),(radius+tube*Math.cos(b))*Math.sin(a),tube*Math.sin(b)], normal:[Math.cos(a)*Math.cos(b),Math.sin(a)*Math.cos(b),Math.sin(b)]};
  });
}
function sphere(radius) {
  return parametric(28,36,(u,v)=>{
    const a=u*Math.PI,b=v*Math.PI*2,n=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
    return {position:n.map(x=>x*radius),normal:n};
  });
}
function roundedCube(size=.9,radius=.12) {
  const positions=[],normals=[],indices=[];
  const faces=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[1,0,0],[0,0,-1]],[[0,-1,0],[1,0,0],[0,0,1]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[-1,0,0],[0,1,0]]];
  faces.forEach(([axis,a,b])=>{
    const patch=parametric(10,10,(u,v)=>{
      const p=axis.map((x,i)=>x*size/2+a[i]*(u-.5)*size+b[i]*(v-.5)*size);
      const q=p.map(x=>clamp(x,-size/2+radius,size/2-radius)),normal=normalize(sub(p,q));
      return {position:q.map((x,i)=>x+normal[i]*radius),normal};
    });
    const offset=positions.length/3; positions.push(...patch.positions); normals.push(...patch.normals); indices.push(...patch.indices.map(i=>i+offset));
  });
  return {positions,normals,indices};
}
function cylinder(radius,height) {
  const positions=[],normals=[],indices=[],segments=96;
  for(let i=0;i<=segments;i++) {
    const angle=i/segments*Math.PI*2,x=Math.cos(angle),z=Math.sin(angle);
    positions.push(x*radius,-height/2,z*radius,x*radius,height/2,z*radius); normals.push(x,0,z,x,0,z);
    if(i<segments){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  }
  for(const direction of [-1,1]){
    const center=positions.length/3;positions.push(0,direction*height/2,0);normals.push(0,direction,0);
    for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;positions.push(Math.cos(a)*radius,direction*height/2,Math.sin(a)*radius);normals.push(0,direction,0);if(i<segments)indices.push(center,center+i+1,center+i+2);}
  }
  return {positions,normals,indices};
}
function shadowDisk(radius) {
  const positions=[0,0,0], normals=[0,0,0],indices=[];
  for(let i=0;i<=64;i++){const angle=i/64*Math.PI*2,x=Math.cos(angle),z=Math.sin(angle);positions.push(x*radius,0,z*radius);normals.push(x,0,z);if(i<64)indices.push(0,i+1,i+2);}
  return {positions,normals,indices};
}
const vertexSource=`
attribute vec3 aPosition; attribute vec3 aNormal;
uniform mat4 uModel; uniform mat4 uViewProjection;
varying vec3 vNormal; varying vec3 vWorld; varying vec3 vLocalNormal;
void main(){ vec4 world=uModel*vec4(aPosition,1.0); vWorld=world.xyz;vNormal=mat3(uModel)*aNormal;vLocalNormal=aNormal;gl_Position=uViewProjection*world; }
`;
const fragmentSource=`
precision mediump float;
uniform vec3 uColor;uniform vec3 uCamera;uniform float uShadow;
varying vec3 vNormal;varying vec3 vWorld;varying vec3 vLocalNormal;
void main(){
 if(uShadow>0.5){float alpha=exp(-4.5*dot(vLocalNormal.xz,vLocalNormal.xz))*.22;gl_FragColor=vec4(.10,.15,.08,alpha);return;}
 vec3 n=normalize(vNormal);
 vec3 l=normalize(vec3(-3.0,6.0,5.0));vec3 l2=normalize(vec3(4.0,1.0,-2.0));vec3 view=normalize(uCamera-vWorld);
 float diffuse=max(dot(n,l),0.0), fill=max(dot(n,l2),0.0);float spec=pow(max(dot(n,normalize(l+view)),0.0),52.0);
 float rim=pow(1.0-max(dot(n,view),0.0),3.0);float ambient=.46+max(n.y,0.0)*.13;
 vec3 color=uColor*(ambient+diffuse*.43+fill*.12)+vec3(1.0,.99,.91)*spec*.25+uColor*rim*.12;
 gl_FragColor=vec4(color,1.0);
}
`;

export function mountScene(host, onState = () => {}) {
  const controller=new AbortController(),{signal}=controller;
  const state={available:false,wireframe:false,paused:matchMedia('(prefers-reduced-motion: reduce)').matches};
  const notify=()=>onState({...state});
  const empty={toggleWireframe(){},togglePause(){},reset(){},dispose(){controller.abort();}};
  const canvas=document.createElement('canvas'); canvas.setAttribute('aria-hidden','true');
  let gl;
  try { gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:false}); } catch { /* Static composition stays visible. */ }
  if(!gl){notify();return empty;}
  const shaders=[],buffers=[];
  function compile(type,source){const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;}
  let program;
  try {
    program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Unable to link WebGL shaders.');
  } catch {
    shaders.forEach(shader=>gl.deleteShader(shader));if(program)gl.deleteProgram(program);notify();return empty;
  }
  gl.useProgram(program);
  const location={position:gl.getAttribLocation(program,'aPosition'),normal:gl.getAttribLocation(program,'aNormal'),model:gl.getUniformLocation(program,'uModel'),viewProjection:gl.getUniformLocation(program,'uViewProjection'),color:gl.getUniformLocation(program,'uColor'),camera:gl.getUniformLocation(program,'uCamera'),shadow:gl.getUniformLocation(program,'uShadow')};
  function buffer(target,data){const result=gl.createBuffer();buffers.push(result);gl.bindBuffer(target,result);gl.bufferData(target,data,gl.STATIC_DRAW);return result;}
  function mesh(geometry,color,position,rotation=[0,0,0],isShadow=false) {
    const lines=[];for(let i=0;i<geometry.indices.length;i+=3){const[a,b,c]=geometry.indices.slice(i,i+3);lines.push(a,b,b,c,c,a);}
    return {positions:buffer(gl.ARRAY_BUFFER,new Float32Array(geometry.positions)),normals:buffer(gl.ARRAY_BUFFER,new Float32Array(geometry.normals)),triangles:buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(geometry.indices)),lines:buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(lines)),count:geometry.indices.length,lineCount:lines.length,color:rgb(color),position,rotation,isShadow};
  }
  const objects=[
    mesh(cylinder(1.57,.18),'#e9e9dd',[0,-1.35,0]),
    mesh(shadowDisk(1.15),'#304838',[0,-1.251,0],[0,0,0],true),
    mesh(knot(),'#d1e88b',[.03,.26,0],[.26,-.17,.15]),
    mesh(roundedCube(.93,.14),'#315849',[-1.2,-.7,.78],[.08,.30,-.12]),
    mesh(torus(.44,.145),'#e89b73',[1.27,-.32,.50],[.25,.8,-.3]),
    mesh(sphere(.27),'#edb790',[-1.13,1.35,-.2]),
  ];
  host.append(canvas);host.classList.add('scene-ready'); state.available=true;
  const camera=[4.2,2.8,7.4],view=lookAt(camera,[0,-.05,0]);
  let width=1,height=1,frame=0,last=0,time=0,yaw=0,pitch=0,targetYaw=0,targetPitch=0,drag=null,visible=true,disposed=false,dirty=true;
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
  const request=()=>{if(!frame && !disposed && visible && !document.hidden)frame=requestAnimationFrame(draw);};
  function draw(now){
    frame=0;if(disposed||!visible||document.hidden)return;
    if(!dirty && !state.paused && now-last<32){request();return;}
    const elapsed=Math.min((now-last)/1000,.06);last=now;
    if(!state.paused)time+=elapsed;
    yaw+=(targetYaw-yaw)*.16;pitch+=(targetPitch-pitch)*.16;
    const moving=Math.abs(targetYaw-yaw)+Math.abs(targetPitch-pitch)>.002;
    gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
    const projection=perspective(.53,width/height,.1,100);
    gl.uniformMatrix4fv(location.viewProjection,false,new Float32Array(multiply(projection,view)));
    gl.uniform3fv(location.camera,new Float32Array(camera));
    const global=multiply(rotateY(yaw),rotateX(pitch));
    for(const [index,item] of objects.entries()) {
      const float=index>1?Math.sin(time*.6+index)*.035:0;
      let model=multiply(global,translation(item.position[0],item.position[1]+float,item.position[2]));
      model=multiply(model,rotateX(item.rotation[0]));
      model=multiply(model,rotateY(item.rotation[1]+(index===2?time*.045:0)));
      model=multiply(model,rotateZ(item.rotation[2]));
      gl.uniformMatrix4fv(location.model,false,new Float32Array(model));
      gl.uniform3fv(location.color,new Float32Array(item.color));
      gl.uniform1f(location.shadow,item.isShadow?1:0);
      gl.bindBuffer(gl.ARRAY_BUFFER,item.positions);gl.enableVertexAttribArray(location.position);gl.vertexAttribPointer(location.position,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,item.normals);gl.enableVertexAttribArray(location.normal);gl.vertexAttribPointer(location.normal,3,gl.FLOAT,false,0,0);
      const useLines=state.wireframe && index>1;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,useLines?item.lines:item.triangles);
      gl.depthMask(!item.isShadow);
      gl.drawElements(useLines?gl.LINES:gl.TRIANGLES,useLines?item.lineCount:item.count,gl.UNSIGNED_SHORT,0);
      gl.depthMask(true);
    }
    dirty=false;
    if(!state.paused || moving)request();
  }
  function invalidate(){dirty=true;request();}
  function resize(){
    const rect=host.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    const ratio=Math.min(window.devicePixelRatio||1,1.75);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);invalidate();
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const intersection=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){last=performance.now();invalidate();}else{cancelAnimationFrame(frame);frame=0;}
  });intersection.observe(host);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=performance.now();invalidate();}
  },{signal});
  host.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    drag={x:event.clientX,y:event.clientY,yaw:targetYaw,pitch:targetPitch};
    host.setPointerCapture(event.pointerId);host.classList.add('dragging');
  },{signal});
  host.addEventListener('pointermove',event=>{
    if(!drag)return;
    targetYaw=drag.yaw+(event.clientX-drag.x)*.008;
    targetPitch=clamp(drag.pitch+(event.clientY-drag.y)*.006,-.7,.7);invalidate();
  },{signal});
  const endDrag=()=>{drag=null;host.classList.remove('dragging');};
  host.addEventListener('pointerup',endDrag,{signal});host.addEventListener('pointercancel',endDrag,{signal});host.addEventListener('lostpointercapture',endDrag,{signal});
  host.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowLeft')targetYaw-=.15;
    if(event.key==='ArrowRight')targetYaw+=.15;
    if(event.key==='ArrowUp')targetPitch=clamp(targetPitch-.15,-.7,.7);
    if(event.key==='ArrowDown')targetPitch=clamp(targetPitch+.15,-.7,.7);
    if(event.key==='Home'){targetYaw=0;targetPitch=0;}invalidate();
  },{signal});
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();cancelAnimationFrame(frame);frame=0;visible=false;
    state.available=false;host.classList.remove('scene-ready');notify();
  },{signal});
  const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change',event=>{state.paused=event.matches;invalidate();notify();},{signal});
  resize();notify();
  return {
    toggleWireframe(){if(!state.available)return;state.wireframe=!state.wireframe;invalidate();notify();},
    togglePause(){if(!state.available)return;state.paused=!state.paused;last=performance.now();invalidate();notify();},
    reset(){targetYaw=0;targetPitch=0;time=0;invalidate();},
    dispose(){
      disposed=true;cancelAnimationFrame(frame);controller.abort();resizeObserver.disconnect();intersection.disconnect();
      buffers.forEach(item=>gl.deleteBuffer(item));shaders.forEach(item=>gl.deleteShader(item));gl.deleteProgram(program);
      // Release the context too, so repeated mounts do not exhaust WebGL contexts.
      gl.getExtension('WEBGL_lose_context')?.loseContext();canvas.remove();host.classList.remove('scene-ready');
    },
  };
}
