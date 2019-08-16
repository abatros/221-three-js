import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './104.html';
import * as THREE from 'three';
import {
  Mesh,
  SpotLight,
  Scene, Color, Vector3
} from 'three';


const TP = Template.p104;

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
    var hudCanvas = document.createElement('canvas');

    // Again, set dimensions to fit the screen.
    hudCanvas.width = width;
    hudCanvas.height = height;

    // Get 2D context and draw something supercool.
    var hudBitmap = hudCanvas.getContext('2d');
  	hudBitmap.font = "Normal 16px monospace";
    hudBitmap.textAlign = 'left';
    hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
    hudBitmap.fillText('Initializing...', width / 2, height / 2);

    // Create the camera and set the viewport to match the screen dimensions.
    var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

    // Create also a custom scene for HUD.
    sceneHUD = new THREE.Scene();

  	// Create texture from rendered graphics.
  	var hudTexture = new THREE.Texture(hudCanvas)
  	hudTexture.needsUpdate = true;
    hudTexture.minFilter = THREE.LinearFilter;

    // Create HUD material.
    var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
    material.transparent = true;

    // Create plane to render the HUD. This plane fill the whole screen.
    var planeGeometry = new THREE.PlaneGeometry( width, height );
    var plane = new THREE.Mesh( planeGeometry, material );
    sceneHUD.add( plane );
  }



  let last_frame_hit = performance.now();

  // Now we have two scenes. Only thing we need now is a render loop!
  function animate() {

    const _hit = performance.now();
    heat.set((_hit - last_frame_hit).toFixed(2));

    // Rotate cube.
    cube.rotation.x += 0.01;
    cube.rotation.y -= 0.01;
    //cube.rotation.z += 0.03;

    // Render scene.
    renderer.render(scene, camera);

    // Update HUD graphics.
    if (showing_HUD) {
      hudBitmap.clearRect(0, 0, width, height);
      hudBitmap.fillText("RAD [x:"
          +(cube.rotation.x % (2 * Math.PI)).toFixed(1)+", y:"
          +(cube.rotation.y % (2 * Math.PI)).toFixed(1)+", z:"
          +(cube.rotation.z % (2 * Math.PI)).toFixed(1)+"]" , width / 2, height / 2);

      hudBitmap.fillText(`heat: ${(_hit - last_frame_hit).toFixed(1)}`,10,40);


    	hudTexture.needsUpdate = true;
      // Render HUD on top of the scene.
      renderer.render(sceneHUD, cameraHUD);
    }

    last_frame_hit = _hit;


    // Request new frame.
    requestAnimationFrame(animate);

  };

  // Start animation.
  animate();



})


FlowRouter.route('/104', {
  name: 'p104',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('p104',params);
    }
});
