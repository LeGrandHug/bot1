import * as THREE from 'three';

// Original procedural character inspired by the supplied clothing reference.
// Faces, garments and hair are actual geometry, with embedded procedural textures.
function fabricTexture(kind) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(256, 256); let seed = 37;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < pixels.data.length; i += 4) {
    const n = random(); const weave = kind === 'fleece' ? n * 100 : (i / 4 % 256 % 3 === 0 ? 40 : 0) + n * 30;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 90 + weave;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  if (kind === 'fleece') for (let i = 0; i < 3800; i++) {
    ctx.strokeStyle = random() > .5 ? '#c3c3c3' : '#626262'; ctx.lineWidth = .7;
    ctx.beginPath(); ctx.arc(random() * 256, random() * 256, 1 + random() * 2, 0, 5); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 3);
  return tex;
}
export function createCharacter({ zombie = false } = {}) {
  const root = new THREE.Group(); root.name = zombie ? 'Infected' : 'CastleSurvivor';
  const fleece = fabricTexture('fleece'), weave = fabricTexture('weave');
  const jacket = new THREE.MeshStandardMaterial({color:zombie?0x475042:0x694839,roughness:1,bumpMap:fleece,bumpScale:.012});
  const panels = new THREE.MeshStandardMaterial({color:zombie?0x343f35:0x54372b,roughness:.82,bumpMap:weave,bumpScale:.003});
  const pants = new THREE.MeshStandardMaterial({color:0x25282c,roughness:.94,bumpMap:weave,bumpScale:.005});
  const leather = new THREE.MeshStandardMaterial({color:0x171a1d,roughness:.66});
  const skin = new THREE.MeshStandardMaterial({color:zombie?0x91a080:0xc69b80,roughness:.72});
  const skinDark = new THREE.MeshStandardMaterial({color:zombie?0x606b50:0x88614e,roughness:.88});
  const lips = new THREE.MeshStandardMaterial({color:zombie?0x50473e:0x946253,roughness:.8});
  const hair = new THREE.MeshStandardMaterial({color:0x39271e,roughness:.78});
  const hairLight = new THREE.MeshStandardMaterial({color:0x72503a,roughness:.7});
  const metal = new THREE.MeshStandardMaterial({color:0x4b5054,roughness:.36,metalness:.8});
  const black = new THREE.MeshStandardMaterial({color:0x080a0c,roughness:.65});
  function mesh(geo,mat,pos,parent=root,name=''){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.name=name;m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
  function oval(s,pos,mat,parent=root,name=''){const m=mesh(new THREE.SphereGeometry(1,24,18),mat,pos,parent,name);m.scale.set(...s);return m;}
  function cube(s,pos,mat,parent=root,name=''){return mesh(new THREE.BoxGeometry(...s),mat,pos,parent,name);}
  function tube(points,r,mat,parent=root,name=''){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),16,r,6,false),mat,[0,0,0],parent,name);}
  function joint(pos,parent=root,name=''){const g=new THREE.Group();g.name=name;g.position.set(...pos);parent.add(g);return g;}
  function tailored(profile,mat,parent=root,pos=[0,0,0],power=2) {
    profile=[[profile[0][0],0,0],...profile,[profile.at(-1)[0],0,0]];
    const vertices=[],uv=[],indices=[],segments=40;
    profile.forEach(([y,w,d],ring)=>{for(let j=0;j<=segments;j++){
      const a=j/segments*Math.PI*2,s=Math.sin(a),c=Math.cos(a);
      vertices.push(Math.sign(s)*Math.abs(s)**(2/power)*w,y,Math.sign(c)*Math.abs(c)**(2/power)*d);
      uv.push(j/segments,ring/(profile.length-1));
      if(ring<profile.length-1&&j<segments){const v=ring*(segments+1)+j;indices.push(v,v+1,v+segments+1,v+1,v+segments+2,v+segments+1);}
    }});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(g,mat,pos,parent);
  }
  // Tapered torso with separate shoulder yoke, zipper and seams.
  tailored([[.85,.25,.145],[.91,.28,.16],[1.06,.275,.164],[1.28,.30,.18],[1.41,.34,.174],[1.48,.33,.16]],jacket,root,[0,0,.015],2.6).name='Fleece jacket';
  tailored([[1.40,.34,.175],[1.49,.33,.16],[1.56,.235,.135],[1.60,.125,.09]],panels,root,[0,0,.015],2.6);
  tailored([[.84,.245,.148],[.88,.279,.166],[.91,.28,.16]],panels,root,[0,0,.015],2.6);
  cube([.018,.72,.018],[0,1.24,-.179],metal,root,'Zipper');
  for(let y=.92;y<1.6;y+=.028)cube([.032,.006,.013],[0,y,-.19],metal);
  cube([.03,.065,.024],[.012,1.51,-.205],metal);
  const neck=joint([0,1.63,0],root,'Neck');
  oval([.105,.13,.095],[0,.02,0],skin,neck);
  const collar=mesh(new THREE.CylinderGeometry(.15,.175,.23,32,1,true),panels,[0,1.62,.012]);collar.scale.z=.85;
  tube([[-.15,1.59,-.06],[-.11,1.72,-.08],[0,1.73,-.10],[.11,1.72,-.08],[.15,1.59,-.06]],.004,panels);
  for(const side of [-1,1]) {
    tube([[side*.21,1.23,-.15],[side*.18,1.05,-.168],[side*.17,.94,-.158]],.006,panels);
    tube([[side*.23,1.18,-.158],[side*.2,1.04,-.17],[side*.18,.96,-.169]],.004,panels);
  }
  // Facial features: jaw, cheeks, brow, nose, eyes, ears and layered swept hair.
  const head=joint([0,1.79,-.008],root,'Head');
  oval([.139,.191,.137],[0,.04,0],skin,head,'Head skin');
  oval([.113,.095,.105],[0,-.075,-.028],skin,head,'Jaw');
  oval([.07,.042,.047],[0,-.112,-.075],skin,head,'Chin');
  for(const side of [-1,1]) {

    oval([.026,.055,.022],[side*.14,.018,.008],skin,head,'Ear');
    oval([.012,.03,.012],[side*.153,.018,-.006],skinDark,head);
    oval([.029,.009,.009],[side*.055,.047,-.129],new THREE.MeshStandardMaterial({color:0xd7d4c5}),head,'Eye');
    oval([.010,.009,.003],[side*.055,.047,-.142],new THREE.MeshStandardMaterial({color:zombie?0xc56732:0x657d7d}),head,'Iris');
    oval([.004,.006,.002],[side*.055,.047,-.146],black,head);
    tube([[side*.021,.06,-.135],[side*.054,.066,-.137],[side*.085,.058,-.122]],.004,skinDark,head);
    tube([[side*.02,.081,-.13],[side*.055,.088,-.129],[side*.095,.076,-.113]],.005,hair,head,'Brow');
  }
  oval([.021,.046,.027],[0,.016,-.133],skin,head,'Nose bridge');
  oval([.027,.017,.025],[0,-.019,-.155],skin,head);
  for(const side of [-1,1])oval([.01,.005,.009],[side*.018,-.026,-.158],skinDark,head);
  tube([[-.043,-.071,-.121],[0,-.066,-.141],[.043,-.071,-.121]],.006,lips,head,'Upper lip');
  tube([[-.04,-.076,-.124],[0,-.082,-.139],[.04,-.076,-.124]],.006,lips,head);
  // A subtle stubble layer under the mouth.
  for(let i=0;i<60;i++){const x=Math.sin(i*12.7)*.085,y=-.09-(i%7)*.006;oval([.0012,.002,.001],[x,y,-.108-Math.sqrt(Math.max(0,1-(x/.13)**2))*.014],skinDark,head);}
  const cap=mesh(new THREE.SphereGeometry(1,32,18,0,Math.PI*2,0,Math.PI*.61),hair,[0,.066,.014],head,'Hair cap');cap.scale.set(.155,.202,.155);
  for(let i=0;i<84;i++) {
    const a=i/84*Math.PI*2;
    const start=[.025+Math.sin(a)*.032,.259,.015+Math.cos(a)*.03];
    const middle=[Math.sin(a)*.145,.18,.014+Math.cos(a)*.146];
    const front=Math.cos(a)<0;
    const end=[Math.sin(a)*.142+(front?-.03:0),front?.063+(i%5)*.012:.04,.018+Math.cos(a)*.15-(front?.006:0)];
    tube([start,middle,end],.0025+(i%3)*.001,i%4===0?hairLight:hair,head,'Swept hair lock');
  }
  // Hip-based pivots keep feet attached when the walk cycle rotates legs.
  const legs=[],knees=[];
  for(const side of [-1,1]) {
    const hip=joint([side*.145,.88,0],root,side<0?'Left hip':'Right hip');legs.push(hip);
    tailored([[-.44,.092,.101],[-.37,.102,.109],[-.20,.123,.123],[-.05,.132,.132],[.03,.13,.125]],pants,hip).name='Thigh';
    const knee=joint([0,-.43,0],hip,'Knee');knees.push(knee);
    tailored([[-.34,.078,.077],[-.25,.085,.09],[-.15,.094,.10],[0,.092,.101],[.04,.092,.10]],pants,knee,[0,0,.008]).name='Shin';
    oval([.103,.10,.18],[0,-.34,-.058],leather,knee,'Boot');
    cube([.19,.035,.31],[0,-.405,-.055],black,knee,'Boot sole');
    cube([.16,.16,.028],[side*.045,-.21,-.124],pants,hip,'Cargo pocket');
    cube([.17,.04,.035],[side*.045,-.13,-.127],panels,hip);
    for(let i=0;i<3;i++)tube([[-.063,-.29+i*.026,-.18],[0,-.29+i*.026,-.193],[.063,-.29+i*.026,-.18]],.005,panels,knee,'Boot lace');
  }
  for(const y of [-.13,-.29]) {
    const strap=mesh(new THREE.CylinderGeometry(.139,.139,.044,24,1,true),leather,[0,y,0],legs[1]);strap.scale.z=1.07;
    cube([.04,.054,.022],[.095,y,-.11],metal,legs[1],'Strap buckle');
  }
  cube([.09,.25,.10],[.15,-.2,.025],leather,legs[1],'Holster');
  cube([.11,.055,.045],[.17,-.06,.025],black,legs[1]);
  const belt=mesh(new THREE.CylinderGeometry(.279,.279,.055,32,1,true),leather,[0,.87,0]);belt.scale.z=.6;
  cube([.075,.058,.018],[0,.87,-.177],metal,root,'Belt buckle');
  const arms=[],elbows=[];
  for(const side of [-1,1]) {
    const shoulder=joint([side*.315,1.46,0],root,side<0?'Left shoulder':'Right shoulder');arms.push(shoulder);
    tailored([[-.35,.088,.09],[-.23,.102,.103],[-.10,.112,.116],[.03,.10,.11],[.085,.065,.08]],jacket,shoulder,[side*.025,0,0]).name='Upper sleeve';
    const elbow=joint([side*.055,-.34,0],shoulder,'Elbow');elbows.push(elbow);
    tailored([[-.29,.080,.077],[-.22,.087,.085],[-.09,.098,.094],[.035,.088,.09]],jacket,elbow,[0,0,-.01]);
    const cuff=mesh(new THREE.CylinderGeometry(.087,.081,.075,24),panels,[0,-.29,-.012],elbow);
    oval([.075,.09,.047],[0,-.38,-.017],leather,elbow,'Fingerless glove');
    for(let finger=0;finger<4;finger++)oval([.014,.041,.016],[-.049+finger*.03,-.455,-.027],skin,elbow,'Finger');
    oval([.022,.05,.021],[-side*.076,-.385,-.028],leather,elbow);
  }
  // Pistol in the right hand. The muzzle marker drives the actual shot effects.
  const gun=joint([0,-.4,-.035],elbows[1],'Pistol');gun.rotation.x=-Math.PI/2;
  const grip=cube([.075,.14,.09],[0,.025,0],black,gun);grip.rotation.x=-.18;
  cube([.075,.069,.31],[0,.12,-.104],metal,gun,'Slide');
  cube([.07,.035,.26],[0,.075,-.11],black,gun);
  const barrel=mesh(new THREE.CylinderGeometry(.019,.019,.032,16),black,[0,.12,-.275],gun);barrel.rotation.x=Math.PI/2;
  cube([.019,.018,.025],[0,.165,-.222],black,gun,'Front sight');
  const muzzle=joint([0,.12,-.30],gun,'Muzzle');
  // Neutral handgun-ready pose; aiming raises both forearms.
  arms[1].rotation.x=.4;elbows[1].rotation.x=.7;
  arms[0].rotation.x=.12;elbows[0].rotation.x=.15;
  root.userData={legs,arms,knees,elbows,head,muzzle};
  return root;
}
export function animateCharacter(root,time,moving,aim,recoil=0) {
  const {legs,knees,arms,elbows}=root.userData;
  legs.forEach((l,i)=>{const phase=time*9+i*Math.PI;l.rotation.x=Math.sin(phase)*.43*moving;knees[i].rotation.x=Math.max(0,-Math.sin(phase))*.45*moving;});
  arms[1].rotation.x=(aim?1.38:.4)+recoil*.13;elbows[1].rotation.x=aim?.18:.7;
  arms[0].rotation.x=aim?1.3:Math.sin(time*9+Math.PI)*.3*moving+.12;
  arms[0].rotation.z=aim?-.28:0;elbows[0].rotation.x=aim?.3:.15;
}
