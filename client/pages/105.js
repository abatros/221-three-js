import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './105.html';
import * as THREE from 'three';
import {
  Mesh,
  SpotLight,
  Scene, Color, Vector3
} from 'three';


const TP = Template.p105;

const scene = new Scene();
const heat = new ReactiveVar(0);

TP.onCreated(function(){

})

TP.helpers({
  heat: ()=>{
    return heat.get()
  },
})

TP.onRendered(function(){
  const showing_HUD = true;
  const tp = this;
  const container = tp.find('#scene-container' );
  console.log(`container:`,container)

//  const {innerWidth:width, innerHeight:height} = window;
  const {clientWidth:width, clientHeight:height} = container;
  console.log(width,height)
  const camera = new THREE.PerspectiveCamera( 45, width/height, 1, 500 );
  camera.position.y = 100;
  camera.position.z = 100;
	camera.position.x = 100;
	camera.lookAt(scene.position);
  console.log('scene.position:',scene.position)
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width,height);
  renderer.autoClear = false;

  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );



  // Let there be light!
  var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 50, 50, 50 );
	scene.add(light);

  // And the box.
  var geometry = new THREE.BoxGeometry( 20, 20, 20 );
  var material = new THREE.MeshPhongMaterial( {color: 0xcccccc} );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  // Ok, now we have the cube. Next we'll create the hud. For that we'll
  // need a separate scene which we'll render on top of our 3D scene. We'll
  // use a dynamic texture to render the HUD.

  // We will use 2D canvas element to render our HUD.

  if (showing_HUD) {
    sceneHUD = new THREE.Scene();
    var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );
    cameraHUD.position.y = 100;
    cameraHUD.position.z = 100;
  	cameraHUD.position.x = 100;
  	camera.lookAt(scene.position);

//    const renderer = new THREE.WebGLRenderer({antialias: true});
//    renderer.setSize(width,height);
//    renderer.autoClear = false;
//    renderer.setPixelRatio( window.devicePixelRatio );

    // add the automatically created <canvas> element to the page
    //container.appendChild( renderer.domElement );


    /*
    // Let there be light!
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
  	light.position.set( 50, 50, 50 );
  	scene.add(light);

    // And the box.
    var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    var material = new THREE.MeshPhongMaterial( {color: 0xcccccc} );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // Create the camera and set the viewport to match the screen dimensions.

    // Create also a custom scene for HUD.

  	// Create texture from rendered graphics.
  	var hudTexture = new THREE.Texture(hudCanvas)
  	hudTexture.needsUpdate = true;
    hudTexture.minFilter = THREE.LinearFilter;

    // Create HUD material.
    var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
    material.transparent = true;
    */


    var geometry = new THREE.CircleGeometry( 5, 32 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var circle = new THREE.Mesh( geometry, material );
    sceneHUD.add( circle );

    /*
    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry( width, height );
    var plane = new THREE.Mesh( planeGeometry, material );
    sceneHUD.add( plane );
    */
  }



  let last_frame_hit = performance.now();

  // Now we have two scenes. Only thing we need now is a render loop!
  function animate() {

    const _hit = performance.now();
    heat.set((_hit - last_frame_hit).toFixed(2));

    // Rotate cube.
    cube.rotation.x += 0.01;
    cube.rotation.y -= 0.001;
    cube.rotation.z += 0.0003;

    // Render scene.
    renderer.render(scene, camera);

    // Update HUD graphics.
    if (showing_HUD) {
      renderer.render(sceneHUD, cameraHUD);
    }

    last_frame_hit = _hit;


    // Request new frame.
    requestAnimationFrame(animate);

  };

  // Start animation.
  animate();



})


FlowRouter.route('/105', {
  name: 'p105',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('p105',params);
    }
});
