import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-three-d-viewer',
  standalone: true,
  templateUrl: './three-d-viewer.component.html',
  styleUrls: ['./three-d-viewer.component.scss']
})
export class ThreeDViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: any;
  private model!: THREE.Group;
  private animationId!: number;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThree();
    this.loadModel();
    this.animate();
  }

  private initThree(): void {
    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 4);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: window.innerWidth > 768, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2.0;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 2, 10);
    pointLight.position.set(-5, 5, -5);
    this.scene.add(pointLight);

    // Handle Resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    const modelUrl = 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

    loader.load(
      modelUrl,
      (gltf: any) => {
        this.model = gltf.scene;
        this.model.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
        this.model.position.y = -1;

        this.scene.add(this.model);
      },
      undefined,
      (error: any) => {
        console.error('Error loading model', error);
      }
    );
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.controls) {
      this.controls.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const container = this.rendererContainer.nativeElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}
