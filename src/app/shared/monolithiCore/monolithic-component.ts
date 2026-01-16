import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';

@Component({
  selector: 'app-monolith-core',
  template: `<div #canvasContainer class="canvas-3d"></div>`,
  styles: [`.canvas-3d { width: 100%; height: 100vh; background: #000; }`]
})
export class MonolithCoreComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') container!: ElementRef;
  @Input() eras: any[] = [];

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private groups: THREE.Group[] = []; // Stores both Image + Particles
  private frameId: number | null = null;

  ngAfterViewInit() {
    this.initThree();
    if (this.eras && this.eras.length > 0) {
      this.createMonoliths();
    }
    this.animate();
  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.05);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.nativeElement.appendChild(this.renderer.domElement);
    
    this.camera.position.z = 10;
  }

private createMonoliths() {
  const loader = new THREE.TextureLoader();

  this.eras.forEach((era, i) => {
    const group = new THREE.Group();

    // 1. PARTICLES (Cloud size increased to match bigger images)
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let j = 0; j < 6000; j++) {
      vertices.push(
        (Math.random() - 0.5) * 60, // Wider spread
        (Math.random() - 0.5) * 60, 
        (Math.random() - 0.5) * 20
      );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const pMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: i % 2 === 0 ? 0xd4af37 : 0x00f3ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, pMaterial);
    group.add(particleSystem);

    // 2. BIGGER IMAGE PLANE (Increased from 12x7 to 18x10)
    const texture = loader.load(era.image);
    texture.anisotropy = 16;
    
    const imgMat = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true, 
      opacity: 1, 
      side: THREE.DoubleSide 
    });

    // Make image bigger here:
    const imagePlane = new THREE.Mesh(new THREE.PlaneGeometry(18, 10), imgMat);
    group.add(imagePlane);

    group.position.z = -i * 40; // Increased spacing for bigger objects
    this.scene.add(group);
    this.groups.push(group);
  });
}

public navigateSpace(index: number) {
  const targetZ = -index * 40 + 15; // Adjusted offset for bigger images
  const targetGroup = this.groups[index];

  // 1. Move Camera
  gsap.to(this.camera.position, {
    z: targetZ,
    duration: 2.0,
    ease: "power3.inOut"
  });

  // 2. TRIGGER 360 ROTATION ONLY ON SLIDE CHANGE
  if (targetGroup) {
    // We reset to 0 first, then spin to 360
    gsap.fromTo(targetGroup.rotation, 
      { y: 0 }, 
      { 
        y: Math.PI * 2, 
        duration: 2.0, 
        ease: "expo.inOut" 
      }
    );
  }
}

private animate() {
  this.frameId = requestAnimationFrame(() => this.animate());
  
  // REMOVED: Automatic drift rotation is gone. 
  // The scene stays still until you scroll.

  this.renderer.render(this.scene, this.camera);
}

  ngOnDestroy() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
  }
}