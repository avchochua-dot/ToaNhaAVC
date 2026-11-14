// V06: provenance and regression checks for the corrected access geometry.
const V6={version:'V06',checks:[],sources:['L-1004','L-1005','L-1006','L-1007','L-1008','L-1009','L-1011','L-6011','L-6014','L-6015']};
// Add parking identifiers at ground level. Ground bays are not floor-1 objects.
for(const b of V5.bays.filter(b=>b.level===-3)){
 const n=b.id.replace('G-C','');const s=textSprite(n,b.x,b.y+.035,b.z+(b.angle===0?-1.9:1.9),trafficLabels,'parkingLabel',.28,'#f4e4a0');s.rotation.x=-Math.PI/2;
}
const syncBefore6=sync;
sync=function(){syncBefore6();trafficLabels.visible=V5.showMarks&&state.mode==='architecture'&&state.floor<0&&!V5.openRoof&&!V2.detail;};
// Retain the existing entrance canopy as provisional, independently of the ramp cover.
for(const m of objects)if(m.userData.accessPart==='entranceCanopy'||/Thanh treo mái đón/.test(m.userData.name||'')){
 m.userData.status='Hình khối mái đón kế thừa; chưa xác nhận đủ kích thước chi tiết. Không phải sàn che ramp.';
}
// Patch the reference and scope UI to remove obsolete V04/V05 assertions.
$('accessShowDeck').parentElement.lastChild.textContent='Hiện sàn cảnh quan che ramp';
const accessText=$('accessPanel').querySelectorAll('p');
accessText[0].innerHTML='Sân đỗ: cốt trệt 0,00 / +0,05 m<br>Sảnh đón: +1,45 m → tầng 1 +1,50 m<br>Che ramp: +2,85 / +2,20 / +1,45 m';
accessText[1].textContent='Chia bậc sân–sảnh và một số đoạn nối số hóa theo scan còn sơ bộ; xem Đối chiếu kiến trúc.';
$('parkingDrawing').textContent='Đối chiếu sân đỗ · L-1005';
$('reviewDrawing').textContent='Đối chiếu cốt hoàn thiện · L-1008';
$('architectureReview').querySelector('summary').textContent='Đối chiếu kiến trúc V06';
$('architectureReview').querySelector('p').textContent='Sửa sân, sảnh và che ramp theo bộ cảnh quan; các chi tiết chưa đủ kích thước được ghi riêng.';
const trafficParagraphs=$('trafficPanel').querySelectorAll('p');
trafficParagraphs[trafficParagraphs.length-1].textContent='Sân trệt: 11 ô tô theo L-1005. Ô đỗ hầm được đặt theo vùng L-1004; xe và chuyển động là minh họa.';
const scope6=$('scope').querySelector('.scopeBody');
for(const p of [...scope6.children]){if(p.tagName==='H3'&&/^V0[45]/.test(p.textContent)){let next=p.nextElementSibling;p.remove();while(next&&next.tagName!=='H3'){const n=next.nextElementSibling;next.remove();next=n;}}}
scope6.insertAdjacentHTML('afterbegin','<h3>V06 · Sân trệt, sảnh đón và che ramp</h3><p>Đã bỏ 5 xe đặt sai trên cao, bố trí 11 ô ngoài trời theo hai hàng 6 + 5 trên sân trệt; thu chiếu sảnh về sát nhà; bỏ cầu dẫn dài ngang sân; chuyển sàn cảnh quan +2,85 về vùng che ramp. Đã bổ sung trực tiếp các tờ 1004–1009 và 1008 vào thư viện đối chiếu.</p><p><b>Còn sơ bộ:</b> chia bậc từ sân đến sảnh, phân bố dốc thu nước, tọa độ các đoạn nối sàn cảnh quan, kích thước mái đón và từng ô kính. Xe chạy là minh họa, chưa phải kiểm tra quỹ đạo xe thiết kế.</p>');
// A visible diagnostic result, computed from actual objects rather than hardcoded counts.
function audit6(){
 const outside=V5.bays.filter(b=>b.id.startsWith('G-C'));
 const stairs=objects.filter(m=>m.userData.accessPart==='entryStair');
 const invalidDimensions=objects.filter(m=>m.isMesh&&m.geometry===unitBox&&(!Number.isFinite(m.position.y)||m.scale.x<=0||m.scale.y<=0||m.scale.z<=0));
 const rampEnds=V4.routes.every(r=>Math.abs(r.start-(r.id==='down'?0:-3.3))<.001&&Math.abs(r.end-(r.id==='down'?-3.3:0))<.001);
 const rampGaps=V4.routes.every(r=>r.points.every((p,i)=>!i||Math.hypot(...p.map((v,k)=>v-r.points[i-1][k]))<1));
 V6.checks=[
  ['11 ô ngoài trời, chia 6 + 5',outside.length===11&&outside.filter(b=>b.angle===0).length===6&&outside.filter(b=>b.angle===Math.PI).length===5],
  ['Ô ngoài trời nằm trên sân trệt',outside.every(b=>b.level===-3&&Math.abs(b.y-courtHeight6(b.x))<.001&&b.y<=.05)],
  ['Không còn ô xe trên sàn che ramp',!V5.bays.some(b=>b.y>0.1)],
  ['Không còn cầu dẫn ngang sân',!objects.some(m=>/Lối bộ nối Đại sảnh|Chân bậc vào sảnh/.test(m.userData.name||''))],
  ['Bậc tiếp cận sảnh đặt sát nhà',stairs.length===80&&stairs.every(m=>m.position.x>-4.5&&m.position.x<0)],
  ['Hai ramp nối cốt 0,00 ↔ −3,30',rampEnds&&rampGaps],
  ['Kích thước hình khối hợp lệ',invalidDimensions.length===0]
 ];
 $('audit6').innerHTML=V6.checks.map(([s,ok])=>'<div style="padding:7px 0;border-bottom:1px solid #2b4858;color:'+(ok?'#a3e0cf':'#ffb29a')+'">'+(ok?'✓ ':'⚠ ')+s+'</div>').join('');
 return {passed:V6.checks.every(x=>x[1]),checks:V6.checks,outdoorBays:outside.map(b=>({id:b.id,x:b.x,z:b.z,y:b.y})),ramps:V4.routes.map(r=>({id:r.id,start:r.start,end:r.end,width:r.width})),remaining:'Chia bậc, chuyển tiếp sàn che ramp, dốc thu nước, mái đón và kích thước mặt dựng còn sơ bộ.'};
}
$('architectureReview').querySelector('.content').insertAdjacentHTML('beforeend','<p><b>Kiểm tra bản sửa</b></p><div id="audit6"></div>');
const accessViewBefore6=accessView4;
accessView4=function(kind){accessViewBefore6(kind);if(kind==='access'){target.set(-10,1.2,4.6);span=36;yaw=-2.18;pitch=.62;}if(kind==='top'){target.set(-7,0,7);span=36;yaw=0;pitch=Math.PI/2-.001;}resize();updateCamera();showInfo('Sân trước & lối vào · V06','11 ô ngoài trời ở cốt trệt; bậc lên sảnh sát nhà. Dải +2,85 m che ramp, không bố trí xe. Chi tiết còn sơ bộ ghi trong bảng đối chiếu.','L-1005 / 1007 / 1008 / 6011');};
$('accessCloseup').onclick=()=>accessView4('access');$('accessTop').onclick=()=>accessView4('top');$('accessFront').onclick=()=>accessView4('front');
const statsBefore6=window.AVC.getStats;
Object.assign(window.AVC,{version:'V06',V6,audit:audit6,accessView:accessView4,getStats:()=>({...statsBefore6(),version:'V06',outdoorBays:V5.bays.filter(b=>b.level===-3).length,auditPassed:V6.checks.every(x=>x[1])}),sync:()=>sync()});
audit6();sync();needsRender=true;
