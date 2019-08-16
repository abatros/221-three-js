import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './101.html';
import * as THREE from 'three';
import {
  Mesh,
  SpotLight,
  Scene, Color, Vector3
} from 'three';


const TP = Template.p101;


FlowRouter.route('/101', {
  name: 'p101',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('p101',params);
    }
});

TP.onCreated(function(){
  const tp = this;
  tp.phase = new ReactiveVar(0);
  tp.etime = new ReactiveVar(0);
  tp.position = new ReactiveVar(new Vector3(0,0,0));
  tp.hd = new ReactiveVar(new Vector3(0,0,0));
})

TP.onRendered(function(){
//  const container = document.querySelector( '#scene-container' );
  const tp = this;
  const container = tp.find('#scene-container' );
  console.log(`container:`,container)
  const scene = new Scene();
  scene.background = new Color( 'skyblue' );
  const fov = 150; // AKA Field of View
//  const aspect = container.clientWidth / container.clientHeight;
  const aspect = 36/24;
  const near = 0.00001; // the near clipping plane
  const far = 1000; // the far clipping plane

  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 20 );
  camera.position.set( 0, 0.9, 40 );
  camera.position.set( 0, 4, 10 );
  tp.position.set(camera.position)

//  camera.position.set( -4, 4, 10 );
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
  scene.add(g1)
  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  console.log({container})

  renderer.setSize( container.clientWidth, container.clientHeight );
//  renderer.setSize(1700, 600 );
  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );
  renderer.render( scene, camera );

  (()=>{
    const q1 = new THREE.Quaternion(0,1,0,0).normalize();
    const q2 = new THREE.Quaternion(0,0,1,0).normalize();
    console.log(`q1:`,q1)
    console.log(`q2:`,q2)
    const r1 = new THREE.Euler().setFromQuaternion(q1, THREE.eulerOrder );
    const r2 = new THREE.Euler().setFromQuaternion(q2, THREE.eulerOrder );
    console.log(`r1:`,r1)
    console.log(`r2:`,r2)
    console.log(`multiply:`,q2.multiply(q1))
    const r3 = new THREE.Euler().setFromQuaternion(q2.multiply(q1), THREE.eulerOrder );
    console.log(`r3:`,r3)
  })();


  (()=>{
    const r1 = new THREE.Euler(0,1,0);
    const r2 = new THREE.Euler(0,0,1);
    console.log(`r1:`,r1)
    console.log(`r2:`,r2)
    const q1 = new THREE.Quaternion().setFromEuler(r1)
    console.log(`q1:`,q1)
    const q2 = new THREE.Quaternion().setFromEuler(r2)
    console.log(`q2:`,q2)
  })();



});



TP.helpers({
  etime: ()=>{
    return Template.instance().etime.get() || 0;
  },
  position: ()=>{
    return Template.instance().position.get()
  },
  hd: ()=>{
    return Template.instance().hd.get()
  },
  phase: ()=>{
    return Template.instance().phase.get() || new Vector3(0,0,0)
  },
});
