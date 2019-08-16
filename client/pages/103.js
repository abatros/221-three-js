import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './103.html';
import * as THREE from 'three';
import {
  Mesh,
  SpotLight,
  Scene, Color, Vector3

} from 'three';
//import {OrbitControls} from 'three-orbitcontrols';
const OrbitControls = require('three-orbitcontrols')
console.log(`OrbitControls:`,OrbitControls)


const TP = Template.p103;


FlowRouter.route('/103', {
  name: 'p103',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('p103',params);
    }
});


TP.onCreated(function(){
  const tp = this;
  tp.phase = new ReactiveVar();
  tp.etime = new ReactiveVar();
  tp.position = new ReactiveVar();
  tp.hd = new ReactiveVar();
  tp.stopped = new ReactiveVar(false)
})

TP.helpers({
  etime: ()=>{
    return Template.instance().etime.get()
  },
  position: ()=>{
    return Template.instance().position.get()
  },
  hd: ()=>{
    return Template.instance().hd.get()
  },
  phase: ()=>{
    return Template.instance().phase.get()
  },
  fixed3: (x)=>{return x.toFixed(3);}

});

TP.events({
  'click .js-start-stop-button': (e,tp)=>{
    console.log(e.currentTarget)
    if (e.currentTarget.value == "Resume") {
      e.currentTarget.value = "Stop"
      tp.stopped.set(false)
    } else {
      e.currentTarget.value = "Resume"
      tp.stopped.set(true)
    }
  }
})




TP.onRendered(function(){
//  const container = document.querySelector( '#scene-container' );
  const tp = this;
  const container = tp.find('#scene-container' );
  console.log(`container:`,container)
  const scene = new Scene();
  scene.background = new Color( 'skyblue' );
  const fov = 80; // AKA Field of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.00001; // the near clipping plane
  const far = 100; // the far clipping plane

  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 20 );
  camera.position.set( 0, 0.9, 40 );
  camera.position.set( 0, 4, 10 );
//  camera.position.set( -4, 4, 10 );

  controls = new OrbitControls( camera, container );

  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 1, 0.05, 8 );
  const g1 = new THREE.GridHelper(30,60)
  // create a default (white) Basic material
//  const material = new THREE.MeshBasicMaterial();
//  const material = new THREE.MeshBasicMaterial( { color: 0x800080 } );
  const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );

  // create a Mesh containing the geometry and material
  const mesh = new THREE.Mesh( geometry, material );

  // add the mesh to the scene
  scene.add( mesh );
  scene.add(g1);
  /*
  // Create a directional light
    const light = new THREE.DirectionalLight( 0xffffff, 5.0 );

    // move the light back and up a bit
    light.position.set( 10, 10, 10 );

    // remember to add the light to the scene
    scene.add( light );
    */

  const ambientLight = new THREE.AmbientLight( 0xffffff, 2 );
//  scene.add( ambientLight );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 0 );

  scene.add( ambientLight, mainLight );


  // create the renderer
  //const renderer = new THREE.WebGLRenderer();
  const renderer = new THREE.WebGLRenderer( { antialias: true } );

  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );


  THREE.Utils = {
      cameraLookDir: function(camera) {
          var vector = new THREE.Vector3(0, 0, -1);
          vector.applyEuler(camera.rotation, THREE.eulerOrder);
          return vector;
      }
  };


  function animate() {
    window.requestAnimationFrame( animate );
    // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

    // render, or 'create a still image', of the scene
    renderer.render( scene, camera );

  }
//animate();


  const cpos = {
    x: -4, y:4, z:10
  }


  console.log(`camera.quaternion1:`,camera.quaternion);
  camera.lookAt(0,0.05,3.75);
  console.log(`camera.quaternion2:`,camera.quaternion);



  let phase = 'descent';tp.phase.set(phase);


  let last_frame_hit = performance.now();
  function play() {
    renderer.setAnimationLoop( () => {
      if (tp.stopped.get() == true) return;
      if (false) {
        mesh.rotation.z += 0.01;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
      }

      const _hit = performance.now();
//      if (hd)
      tp.etime.set(_hit - last_frame_hit);
//      console.log(`${_hit - last_frame_hit}`,camera.position.y)
      last_frame_hit = _hit;
//      cpos.z -= 0.01;
//      camera.position.set(cpos.x,cpos.y,cpos.z);
//      if (hd.y<0.2) camera.rotateX(+0.001); else
//      if (hd.z<5) camera.rotateX(+0.001); else
//      camera.rotateX(0)

      tp.position.set(camera.position)
      let hd = THREE.Utils.cameraLookDir(camera).add(camera.position)
      tp.hd.set(hd)
      switch(phase) {
        case 'descent':
        camera.translateZ(-0.008)
        //console.log(`camera.position:`,camera.position)
        if (camera.position.y < 0.85) {phase = 'rotation'; tp.phase.set(phase);}
        break;

        case 'rotation':
        camera.translateZ(-0.008)
        camera.rotateX(+0.003);
//        console.log(`camera.lookAt:`,hd)
        if (camera.position.y > 0.99) {phase = 'right-turn'; tp.phase.set(phase);}
        break;

        case 'right-turn':
        camera.translateZ(-0.008)
        camera.rotateZ(-0.001);
        camera.rotateY(-0.001);
//        console.log(`RIGHT-TURN camera.lookAt:`,hd)
        if (camera.position.y > 1.6) {phase = 'climb-right'; tp.phase.set(phase);}
        break;

        case 'climb-right':
        camera.translateZ(-0.008)
        //camera.rotateX(+0.0005);
//        camera.rotateZ(-0.001);
        camera.rotateY(-0.003);
//        console.log(`CLIMB-RIGHT position=>`,camera.position,hd)
//        console.log(`CLIMB-RIGHT HD=>`,hd)
//        if (camera.position.y > 2) phase = 'enter-down-wind';
//        if (hd.z < -0.9) {phase = 'enter-down-wind'; tp.phase.set(phase);}
        if (hd.z >2) {phase = 'enter-down-wind'; tp.phase.set(phase);}
        if (camera.position.y < 0.5) {phase = 'CRASH'; tp.phase.set(phase);}
        //if (camera.hd.x < 0) camera.rotateX(0.001)
        break;

        case 'enter-down-wind':
        camera.lookAt(new Vector3(10,3,20))
        camera.translateZ(-0.008)
//        console.log(`camera=> x:${hd.x} y:${hd.y} z:${hd.z}`)
        if (camera.position.z > 8) {
          phase = 'right-turn-to-base-leg1'; tp.phase.set(phase);
        }
        break;

        case 'right-turn-to-base-leg1':
        camera.translateZ(-0.008)
        camera.rotateZ(-0.001);
        if (camera.position.z > 8.2) {
          phase = 'right-turn-to-base-leg2'; tp.phase.set(phase);
        }
        break;

      }



      renderer.render( scene, camera );
    });
  }
  play();

})
