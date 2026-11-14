// V04: rebuild the entry and basement circulation from KT 1010/1011, 2003,
// 3002, 6011, 6014, 6015. Remaining traced dimensions are marked explicitly.
const V4={routes:[],removed:[],accessObjects:[],facadeObjects:[],showLabels:true,showDeck:true,
 note:'Tuyến và cao độ đã hiệu chỉnh theo các tờ kiến trúc. Định vị chuyển tiếp theo scan; chưa thay thế kiểm tra kích thước thi công.',
 conflict:'Mặt cắt B–B ghi dốc khác tờ chi tiết 6014. V04 dùng tuyến chi tiết và cốt đầu/cuối; cần xác nhận thống nhất hồ sơ.'};
function removeV4(m){V4.removed.push(m.userData.name||'');m.parent?.remove(m);let i=objects.indexOf(m);if(i>=0)objects.splice(i,1);i=labels.indexOf(m);if(i>=0)labels.splice(i,1);}
// Remove the flat covering plane, provisional ramps/canopy/steps, and all repeated facade panels.
for(const m of [...objects])if(m.parent===site||m.userData.v3Family==='facade'||/Vách kính mặt dựng|Vách kính bên|Thanh đứng mặt dựng|Lam đứng nhôm|Đai sàn mặt dựng|Tường hầm/.test(m.userData.name||''))removeV4(m);
for(const s of [...labels])if(s.userData.cat==='branding')removeV4(s);
const access=new THREE.Group();access.userData={level:-3,name:'Lối tiếp cận V04'};model.add(access);
const accessPalette={paving:0xbec4be,road:0x65737d,step:0xc4ccc9,wall:0xe1e5df,soil:0x9ca798,plant:0x456f5b,metal:0x879b9e};
function abox(x,z,e,w,d,h,name,color=accessPalette.paving,extra={}){const m=box(access,x,z,e,w,d,h,'site',name,color,{source:'KT 6011 / 6014 / 6015',status:V4.note,v4:true,...extra});V4.accessObjects.push(m);return m;}
function rod4(a,b,r,name,color=accessPalette.metal,g=access,cat='site') {const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A);if(v.length()<1e-6)return;const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),7),material(color,cat));m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.userData={cat,name,level:g.userData.level,source:'KT 6015; định vị dọc tuyến số hóa',v4:true};g.add(m);objects.push(m);V4.accessObjects.push(m);return m;}
function surface4(points,name,color,extra={}) {const data=[];for(let i=1;i<points.length-1;i++)data.push(...points[0],...points[i],...points[i+1]);const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(data,3));geom.computeVertexNormals();const m=new THREE.Mesh(geom,material(color,'site'));m.userData={cat:'site',level:-3,name,v4:true,source:'KT 6014 / 6015',status:V4.note,...extra};access.add(m);objects.push(m);V4.accessObjects.push(m);return m;}
// Ground is built in separate polygons around the ramp footprint, not over it.
abox(-28,-8.5,-.2,56,3,.2,'Đường tiếp cận · cốt ±0,00',accessPalette.road);
abox(-28,-5.5,-.2,3.6,31,.2,'Lối bộ phía ngoài khu hầm · cốt ±0,00');
abox(25,-5.5,-.2,3,31,.2,'Lối bên ngoài nhà · cốt ±0,00');
abox(-24.4,23,-.2,49.4,2.5,.2,'Lối sau nhà · cốt ±0,00');
// Basement enclosure outside the two ramp openings.
abox(-24.45,-4.95,-3.5,49.1,.25,3.5,'Tường ngoài hầm phía ramp',0x9eaaa9,{accessPart:'basementWall'});
abox(-24.45,-4.7,-3.5,.25,19,3.5,'Tường hầm bên phía khối mở rộng',0x9eaaa9);
abox(-24.45,14.2,-3.5,24.45,.25,3.5,'Tường hầm khối mở rộng',0x9eaaa9);
// Routes are sampled along the actual straight + quarter-turn plan, with anchored elevations.
function rampRoute(id,name,plan,width,profile,source){let length=0;const ds=[0];for(let i=1;i<plan.length;i++){length+=Math.hypot(plan[i][0]-plan[i-1][0],plan[i][1]-plan[i-1][1]);ds.push(length);}const pts=plan.map((p,i)=>[p[0],profile(ds[i],length),p[1]]),edges=[];for(let i=0;i<pts.length;i++){const p=pts[i],a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[2]-a[2],l=Math.hypot(dx,dz),nx=-dz/l,nz=dx/l;edges.push([[p[0]+nx*width/2,p[1],p[2]+nz*width/2],[p[0]-nx*width/2,p[1],p[2]-nz*width/2]]);}for(let i=0;i<edges.length-1;i++){const a=edges[i],b=edges[i+1];surface4([a[0],a[1],b[1],b[0]],name+' · bản ramp',0x9ba5a9,{route:id,source});for(let k=0;k<2;k++){const A=a[k],B=b[k];surface4([A,B,[B[0],B[1]-.2,B[2]],[A[0],A[1]-.2,A[2]]],name+' · mép bản',0x879698,{route:id,source});rod4([A[0],A[1]+.15,A[2]],[B[0],B[1]+.15,B[2]],.055,name+' · gờ mép',0xd0d4c9);}}
 // Outer handrails follow ramp grade, leaving the lane clear.
 for(let k=0;k<2;k++){for(let i=0;i<edges.length;i+=4){const a=edges[i][k];rod4([a[0],a[1]+.15,a[2]],[a[0],a[1]+1.05,a[2]],.025,name+' · trụ lan can');}for(let i=0;i<edges.length-1;i++){const a=edges[i][k],b=edges[i+1][k];rod4([a[0],a[1]+1.05,a[2]],[b[0],b[1]+1.05,b[2]],.027,name+' · tay vịn');}}
 // Expansion/traction grooves, transverse to the local road axis.
 for(let i=1;i<edges.length-1;i+=2){const a=edges[i][0],b=edges[i][1];rod4([a[0],a[1]+.012,a[2]],[b[0],b[1]+.012,b[2]],.009,name+' · rãnh chống trượt',0x6b777b);}
 for(const idx of [0,pts.length-1]){const a=edges[idx][0],b=edges[idx][1];for(let n=0;n<12;n++){const t=n/12;const p=[a[0]+(b[0]-a[0])*t,a[1]+.015,a[2]+(b[2]-a[2])*t];rod4(p,[p[0]+.05,p[1],p[2]+.19],.025,name+' · rãnh thu nước',0x334b54);}}
 V4.routes.push({id,name,source,points:pts,edges,width,length,start:pts[0][1],end:pts.at(-1)[1]});return V4.routes.at(-1);}
const upPlan=[];const ur=3.75,uc=[6.9,1.2];for(let i=0;i<=28;i++){const a=Math.PI+i*Math.PI/56;upPlan.push([uc[0]+ur*Math.cos(a),uc[1]+ur*Math.sin(a)]);}for(let i=1;i<=48;i++)upPlan.push([6.9+(23.6-6.9)*i/48,-2.55]);
// 6014 transition grades retained; low-transition length is fitted to the endpoint constraint.
const up=rampRoute('up','Xe từ hầm đi lên',upPlan,4.3,(s,L)=>{const transition=2,low=(.156*L-3.3-.08)/.118;return s<low?-3.3+.038*s:s<low+transition?-3.3+.038*low+.116*(s-low):-.156*(L-s);},'KT186 · L-6014 · ưu tiên chi tiết; xem cảnh báo B–B');
const downPlan=[];for(let i=0;i<=48;i++)downPlan.push([-23.55+(23.55-6.1)*i/48,-2.55]);for(let i=1;i<=28;i++){const a=-Math.PI/2+i*Math.PI/56;downPlan.push([-6.1+3.75*Math.cos(a),1.2+3.75*Math.sin(a)]);}
const down=rampRoute('down','Xe đi xuống hầm',downPlan,3.4,(s,L)=>{const t=s/L;return -3.3*(t<.9?t/.95:(.9/.95+(t-.9)/1.9));},'KT187 · L-6015 · cốt ±0,00 đến −3,30');
// A separate pedestrian emergency stair, next to the down-ramp straight section.
for(let i=0;i<22;i++){const x=-23.05+i*15.3/22;abox(x,-.85,-.15*(i+1),15.3/22+.015,.9,.15,'Bậc thoát nạn cạnh ramp · '+(i+1),accessPalette.step,{source:'KT187 · 6015 · 22×150 = 3300',accessPart:'escape'});rod4([x,.9-.15*i,-.8],[x,-.15*i,-.8],.018,'Lan can bậc thoát nạn');}
rod4([-23.05,.9,-.8],[-7.75,-2.4,-.8],.028,'Tay vịn bậc thoát nạn');
// Kink-free bottom landing joins both curved mouths to basement FFL -3.30.
abox(-4.1,1.2,-3.5,9.4,3.25,.2,'Chiếu bằng nối hai miệng ramp · −3,30',0xadb4b4,{accessPart:'rampLanding'});

// Floor 1 starts at axis A; only upper floors overhang towards the ramp.
for(const m of objects){if(m.userData.level!==1||m.userData.cat!=='slab'||m.geometry!==unitBox)continue;const low=m.position.z-m.scale.z/2,high=m.position.z+m.scale.z/2;if(low<0&&high>0){m.scale.z=high;m.position.z=high/2;}else if(high<=0)m.visible=false;}
abox(-28,-3.9,-.2,4.45,3.4,.2,'Đoạn nối đường ngoài → ramp xuống',accessPalette.road);
abox(23.6,-4.7,-.2,4.4,4.3,.2,'Đoạn nối ramp lên → đường ngoài',accessPalette.road);
abox(-24.4,14.45,-.2,24.4,8.55,.2,'Sân ngoài phía sau khối hầm',accessPalette.paving);
for(const r of [up,down]){const i=r.id==='up'?55:23,p=r.points[i],q=r.points[i+1],dx=q[0]-p[0],dz=q[2]-p[2],l=Math.hypot(dx,dz),ux=dx/l,uz=dz/l,nx=-uz,nz=ux;const v=(a,b)=>[p[0]+ux*a+nx*b,p[1]+.03,p[2]+uz*a+nz*b];surface4([v(-.7,-.09),v(.2,-.09),v(.2,-.4),v(.9,0),v(.2,.4),v(.2,.09),v(-.7,.09)],'Mũi tên tuyến '+r.id,0xf1d66f,{route:r.id});}

// V06: ground courtyard and ramp cover are separate surfaces (1005/1007/1008).
const GROUND6={x0:-23.05,x1:-4.41,z0:0,z1:15.5};
function courtHeight6(x){return .05*Math.max(0,Math.min(1,(x+23.05)/18.64));}
// Small surface patches also preserve occlusion in the CPU fallback painter.
for(let ix=0;ix<20;ix++)for(let iz=0;iz<16;iz++){
 const x0=-23.05+18.64*ix/20,x1=-23.05+18.64*(ix+1)/20,z0=15.5*iz/16,z1=15.5*(iz+1)/16;
 surface4([[x0,courtHeight6(x0),z0],[x1,courtHeight6(x1),z0],[x1,courtHeight6(x1),z1],[x0,courtHeight6(x0),z1]],'Sân đỗ xe ngoài trời · cốt trệt 0,00 / +0,05',0xbec4be,{accessPart:'groundCourt',source:'L-1005 / 1008; mặt sân có dốc thoát nước',status:'Cốt biên theo hồ sơ; phân bố dốc giữa các điểm thu nước chưa số hóa đầy đủ'});
}
abox(-24.4,0,-.2,1.35,15.5,.2,'Lối từ cổng vào sân trệt',accessPalette.paving);
abox(-24.4,15.5,-.2,24.4,7.5,.2,'Sân ngoài phía sau bãi đỗ',accessPalette.paving);
// Entry landing is a narrow strip against axis 1, not a bridge across the courtyard.
abox(-1.51,0,1.25,1.51,15.5,.2,'Sảnh đón sát nhà · FFL +1,45 / SSL +1,40',0xd0d4cc,{accessPart:'entryLanding',ffl:1.45,source:'L-1005 / 1008 / 1011'});
const stairRun6=2.9,stairX6=-1.51-stairRun6;
for(let i=0;i<10;i++){const top=.05+(1.45-.05)*(i+1)/10;for(let j=0;j<8;j++)abox(stairX6+i*stairRun6/10,2.5+j,.05,stairRun6/10,1,top-.05,'Bậc tiếp cận sảnh sát nhà · '+(i+1),accessPalette.step,{accessPart:'entryStair',source:'L-1005 / 1008; vị trí theo mặt bằng, chia bậc sơ bộ cần đối chiếu chi tiết'});}
// Ground paving continues beneath the stairs and up to the landing edge.
for(let ix=0;ix<3;ix++)for(let iz=0;iz<16;iz++){
 const x0=-4.41+2.9*ix/3,x1=-4.41+2.9*(ix+1)/3,z0=15.5*iz/16,z1=15.5*(iz+1)/16;
 surface4([[x0,.05,z0],[x1,.05,z0],[x1,.05,z1],[x0,.05,z1]],'Sân trệt sát chân thang sảnh',0xbec4be,{accessPart:'groundCourt',source:'L-1005 / 1008'});
}
abox(-.3,3.3,1.45,.3,3,.05,'Ngưỡng nối sảnh đón +1,45 → tầng 1 +1,50',0xd4d7cd,{accessPart:'entryLanding',source:'L-1011 / 1008'});
// Ramp-cover landscape terrace stays entirely north of A (Z<=0); no vehicle bays.
// Dimensions of the terrace itself follow 6011: 18.44 x 4.96 m. Placement of its
// connection to the overall site is traced against 1005, not a surveyed coordinate.
const terraceStart6=-23.05,terraceZ6=-4.96,terraceDepth6=4.96;
abox(terraceStart6,terraceZ6,2.65,12.83,terraceDepth6,.2,'Sàn cảnh quan che ramp · FFL +2,85 / SSL +2,80',0xc4ccc3,{accessPart:'landscapeDeck',ffl:2.85,source:'L-6011 / 1005 / 1008'});
function steps6(x,w,from,to,z,depth,n){for(let i=0;i<n;i++){const top=from+(to-from)*(i+1)/n;abox(x+i*w/n,z,top-.18,w/n,depth,.18,'Bậc chuyển cốt sàn che ramp · '+(i+1),accessPalette.step,{accessPart:'landscapeDeck',source:'L-6011'});}}
steps6(-10.22,.79,2.85,2.2,terraceZ6,terraceDepth6,5);
abox(-9.43,terraceZ6,2,2.089,terraceDepth6,.2,'Chiếu cảnh quan · +2,20',0xc4ccc3,{accessPart:'landscapeDeck',source:'L-6011'});
steps6(-7.341,1,2.2,1.45,terraceZ6,terraceDepth6,5);
abox(-6.341,terraceZ6,1.25,6.341,terraceDepth6,.2,'Lối nối sảnh ở đầu ramp · +1,45',0xc4ccc3,{accessPart:'landscapeDeck',source:'L-6011 / 1005; đoạn nối định vị theo scan'});
// Planting is on the cover's inner edge; the ground courtyard remains open.
for(const [x,len,y] of [[-12.66,2.8,2.85],[-9.86,2.03,2.2],[-7.83,2.36,1.45]]){
 abox(x,-1.7,y,len,1.7,.75,'Bồn hoa trên sàn che ramp',0xd5d9ce,{accessPart:'landscapeDeck',source:'L-6011'});
 abox(x+.12,-1.58,y+.75,len-.24,1.46,.04,'Đất bồn hoa',0x63765c,{accessPart:'landscapeDeck'});
 for(let q=x+.35;q<x+len-.15;q+=.5){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),material(0x537858,'site'));m.position.set(q,y+.95,-.7);m.userData={cat:'site',level:-3,name:'Cây bồn hoa che ramp',v4:true,accessPart:'landscapeDeck'};access.add(m);objects.push(m);}
}
// Thin glazed guard on terrace, kept out of the vehicle lane.
const terraceRail6=abox(-23.05,-.06,2.85,10.39,.06,.85,'Lan can kính sàn che ramp · cao 850 mm',0x94b7bc,{accessPart:'landscapeDeck',source:'L-6011'});terraceRail6.material=terraceRail6.material.clone();terraceRail6.material.transparent=true;terraceRail6.material.opacity=.35;
// Canopy on the axis-1 entrance, with suspended rods. No invented structural rebar.
abox(-3.5,.6,5.55,3.5,7.8,.15,'Mái đón Đại sảnh · phía trục 1',0xb9ced0,{accessPart:'entranceCanopy',source:'KT084 / KT088; hình khối theo mặt đứng và B–B'});
for(const z of [1,2.5,4,5.5,7.5])rod4([0,9,z],[-3.5,5.7,z],.035,'Thanh treo mái đón trục 1');
// Floor 1 front facade opens directly into the great lobby, matching KT1011.
const oldFacades=V4.removed.length;
const facadeBands=[[1,1.5,5.7],[2,5.7,9],[3,9,15.6],[5,15.6,22.5],[7,22.5,29.1],[9,29.1,35.7],[11,35.7,44.0]];
const strips={front:[1,.45,.8,.65,1.15,.7,.6,1.4,.55,1.7,.9,.45,1.2,.8,.6,1.65,.7,1.15,.5,1.4],back:[1.2,.6,1.3,.7,.65,1.5,.6,1.05,1.2,.8,1.7,.5,.85,1.4,.6,1.55,.8],side:[1,.8,.45,1.6,.75,1.1,.6,1.75,.55,1.2,.9,.6,1.5,.7,.45,1.65,.8]};
function facade4(face,band){const [first,base,top]=band,alongX=face==='north'||face==='south',limit=alongX?23.8:(first===1?22.1:23.8),origin=alongX?-.1:(first===1?0:-1.7),arr=strips[face==='west'?'front':face==='east'?'back':'side'];let cursor=origin,scale=limit/arr.reduce((a,b)=>a+b,0);for(let j=0;j<arr.length;j++){const size=arr[j]*scale,opaque=j%2===0;for(let lv=first;lv<14;lv++){const lo=Math.max(base,LEVELS[lv].z),hi=Math.min(top,lv<13?LEVELS[lv+1].z:44.0);if(hi<=lo+.01)continue;const g=floorGroups[lv],isEntry=face==='west'&&lv===1;let e=lo+.035,h=hi-lo-.07,cat=opaque?'wall':'glass';let start=cursor;
 // Entrance opening z=3.30..6.30; leave the low part clear and add lintel separately.
 const slices=isEntry?[[start,Math.min(start+size,3.3)],[Math.max(start,6.3),start+size]]:[[start,start+size]];
 for(const [a,b]of slices){if(b-a<.01)continue;const m=alongX?box(g,a,face==='north'?(first===1?0:-1.72):22.04,e,b-a,.14,h,cat,'Mặt đứng '+face+' · '+(opaque?'mảng đặc':'ô kính'),opaque?0xe4e5dc:0x91b6ba):box(g,face==='west'?-.22:23.64,a,e,.14,b-a,h,cat,'Mặt đứng '+face+' · '+(opaque?'mảng đặc':'ô kính'),opaque?0xe4e5dc:0x91b6ba);m.userData.source='KT082–085; nhóm cao độ ô kính theo mặt đứng';m.userData.status='Đã sửa nhịp đặc–rỗng và nhóm tầng; bề rộng từng ô còn số hóa theo scan, chưa gán đủ mã VK.';m.userData.v4facade=true;V4.facadeObjects.push(m);}
 if(!opaque){const m=alongX?box(g,start,face==='north'?(first===1?-.03:-1.75):22.08,hi-.04,size,.05,.04,'wall','Đố ngang kính',0x7e989a):box(g,face==='west'?-.25:23.68,start,hi-.04,.05,size,.04,'wall','Đố ngang kính',0x7e989a);m.userData.v4facade=true;}
 }cursor+=size;}
 // Full opaque horizontal band only at the top of a designed multi-storey window group.
 const lv=first,g=floorGroups[lv],m=alongX?box(g,origin,face==='north'?(first===1?-.01:-1.73):22.04,top-.45,limit,.16,.45,'wall','Dải đặc kết thúc nhóm kính',0xe2e5dc):box(g,face==='west'?-.23:23.64,origin,top-.45,.16,limit,.45,'wall','Dải đặc kết thúc nhóm kính',0xe2e5dc);m.userData.v4facade=true;
}
for(const b of facadeBands)for(const face of ['west','east','north','south'])facade4(face,b);
// The door and lintel live on X=0, facing the +1.50 landing.
box(floorGroups[1],-.25,3.3,1.5,.15,3,2.7,'glass','Cửa chính Đại sảnh · trục 1',0x72a6ae,{source:'KT021 · 1011',v4facade:true});box(floorGroups[1],-.25,3.3,4.2,.15,3,1.5,'wall','Dải trên cửa Đại sảnh',0xe3e7df,{v4facade:true});
textSprite('CÔNG TY CP THỦY ĐIỆN A VƯƠNG',-.5,36.1,4.7,floorGroups[11],'branding',2.6,'#eee8d2');
textSprite('ĐẠI SẢNH · +1,50 m',-1.4,4.7,5,floorGroups[1],'branding',1.8,'#e4f5ed');
const accessLabels=[];for(const [name,x,y,z]of [['XE XUỐNG HẦM',-17,1,-2.55],['XE TỪ HẦM LÊN',17,1,-2.55],['HẦM · −3,30 m',-.7,-2.4,3.3],['SẢNH ĐÓN · +1,45',-1,2.1,8],['CHE RAMP · +2,85',-17,3.5,-2.3],['SÂN ĐỖ XE · CỐT TRỆT',-14,.65,7.5]]){const s=textSprite(name,x,y,z,access,'accessLabel',1.4,'#d5f3e7');accessLabels.push(s);}
// Focused, unambiguous quick views for checking against the drawing axes.
function accessView4(kind){if(V2.detail)closeAssembly();V3.zone='all';state.floor=-1;state.mode='architecture';state.cut='none';state.explode=0;state.categories.site=true;$('cat-site').checked=true;V3.style='solid';state.ghost=false;$('ghost').checked=false;state.categories.foundation=false;$('cat-foundation').checked=false;state.plan=false;sync();if(kind==='front'){target.set(0,21,10);span=62;yaw=-Math.PI/2;pitch=.001;}else if(kind==='top'){target.set(-2,0,7);span=45;yaw=0;pitch=Math.PI/2-.001;}else{target.set(-5,1.3,4.5);span=39;yaw=-2.2;pitch=.6;}resize();updateCamera();showInfo('Khu vực tiếp cận · V04','Đại sảnh trục 1: +1,50 m. Hai tuyến xe nối ±0,00 với hầm −3,30 m. '+V4.conflict,'ĐỐI CHIẾU KT1010 / 1011 / 6011 / 6014 / 6015');}
const oldSync4=sync;sync=function(){oldSync4();for(const s of accessLabels)s.visible=V4.showLabels&&state.categories.labels&&state.categories.site&&state.floor<0&&!V2.detail;for(const m of V4.accessObjects)if(m.userData.accessPart==='landscapeDeck')m.visible=m.visible&&V4.showDeck;for(const m of objects)if(m.userData.accessPart==='landscapeDeck')m.visible=m.visible&&V4.showDeck;if(!V2.detail)$('statusText').textContent=state.mode==='rebar'?'V04 · Thép khái quát':'V04 · '+(state.mode==='architecture'?'Kiến trúc hiệu chỉnh':'Khung kết cấu');};
$('accessCloseup').onclick=()=>accessView4('access');$('accessFront').onclick=()=>accessView4('front');$('accessTop').onclick=()=>accessView4('top');$('accessShowDeck').onchange=e=>{V4.showDeck=e.target.checked;sync();};$('accessShowLabels').onchange=e=>{V4.showLabels=e.target.checked;sync();};
$('accessSources').onclick=()=>{refFilter='Tất cả';openRef(REFS.findIndex(r=>r.pages==='KT · 186'));};
const oldReset4=reset;reset=function(){oldReset4();V4.showDeck=true;V4.showLabels=true;$('accessShowDeck').checked=true;$('accessShowLabels').checked=true;target.set(-1,20,8);span=86;yaw=-2.15;pitch=.38;resize();updateCamera();sync();};$('reset').onclick=reset;
const stats3=window.AVC.getStats;window.AVC.getStats=()=>({...stats3(),version:'V04'});
const scopeBody=$('scope').querySelector('.scopeBody');scopeBody.insertAdjacentHTML('afterbegin','<h3>V04 · Lối vào và ramp hầm</h3><p>Đã đặt cửa Đại sảnh phía trục 1; dựng hai tuyến xe thẳng–cong, cốt ±0,00 / −3,30; sảnh cảnh quan +1,50 / +2,20 / +2,85. Có góc nhìn riêng và tắt sảnh cảnh quan để kiểm tra khoảng trống ramp.</p><p><b>Điểm chưa thống nhất:</b> '+V4.conflict+' Bề rộng ô kính và một số đoạn nối sân được số hóa từ scan; chưa xác nhận đầy đủ từng mã VK. Hình học kết cấu và lớp thép kế thừa V03 vẫn còn sơ bộ.</p>');
Object.assign(window.AVC,{version:'V04',V4,accessView4,reset:()=>reset(),sync:()=>sync()});reset();
