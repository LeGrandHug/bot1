import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createCharacter,animateCharacter} from './character.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x20262c);
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.01,100);camera.position.set(2.4,1.8,-4.1);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;document.body.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.12,0);controls.minDistance=.65;controls.maxDistance=7;controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.85;
scene.add(new THREE.HemisphereLight(0xd7e5ef,0x77716a,2));
for(const [color,intensity,x,y,z] of [[0xffd3a6,4,-3,4,-3],[0xc4dff8,3,3,2,2]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);light.castShadow=true;scene.add(light);}
const base=new THREE.Mesh(new THREE.CylinderGeometry(.8,.88,.06,64),new THREE.MeshStandardMaterial({color:0x333a3f,roughness:.85}));base.position.y=-.05;base.receiveShadow=true;scene.add(base);
const model=createCharacter();scene.add(model);let walk=false,aim=false,exporting=false;const clock=new THREE.Clock();
document.getElementById('pose').onclick=()=>{walk=!walk;document.getElementById('pose').textContent=walk?'Arrêter la marche':'Tester la marche';};
document.getElementById('aim').onclick=()=>{aim=!aim;};
document.getElementById('export').onclick=async()=>{const state=document.getElementById('state');state.textContent='Exportation…';exporting=true;const data=model.userData;try{animateCharacter(model,0,0,false);model.updateMatrixWorld(true);model.userData={};const buffer=await new GLTFExporter().parseAsync(model,{binary:true});const url=URL.createObjectURL(new Blob([buffer],{type:'model/gltf-binary'}));const link=document.createElement('a');link.href=url;link.download='survivant.glb';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);state.textContent='Modèle exporté. Géométrie et textures incluses.';}catch(error){state.textContent='Export impossible : '+error.message;console.error(error);}finally{model.userData=data;exporting=false;}};
function loop(){requestAnimationFrame(loop);if(!exporting)animateCharacter(model,clock.getElapsedTime(),walk?1:0,aim);controls.update();renderer.render(scene,camera);}loop();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
