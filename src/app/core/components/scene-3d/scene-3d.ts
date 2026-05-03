import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-scene-3d',
  standalone: true,
  template: `<div #canvasContainer class="fixed inset-0 w-full h-full -z-10 pointer-events-none"></div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class Scene3dComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  private dnaStrands: THREE.Group[] = [];
  private molecules: THREE.Group[] = [];
  private particles!: THREE.Points;
  private dataGrid!: THREE.Mesh;

  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private targetScrollZ = 25;

  ngOnInit() {
    this.initThreeJs();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollMax > 0) {
      const scrollPercent = window.scrollY / scrollMax;
      // Fly forward up to 40 units through the molecules
      this.targetScrollZ = 25 - (scrollPercent * 40);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private initThreeJs() {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();
    // Deep medical navy background for depth
    this.scene.fog = new THREE.FogExp2(0x0a192f, 0.02); 

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 25;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Cinematic Medical Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00ffff, 150, 100); 
    pointLightCyan.position.set(10, 10, 10);
    this.scene.add(pointLightCyan);

    const pointLightTeal = new THREE.PointLight(0x00ffaa, 150, 100);
    pointLightTeal.position.set(-10, -10, 10);
    this.scene.add(pointLightTeal);

    const pointLightBlue = new THREE.PointLight(0x0066ff, 150, 100);
    pointLightBlue.position.set(0, 15, -15);
    this.scene.add(pointLightBlue);

    // Glassy material for structures
    const nodeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.95,
      thickness: 1.5,
      ior: 1.5,
      emissive: 0x00ffff,
      emissiveIntensity: 0.1
    });

    const bondMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });

    // 1. Procedural DNA Helixes
    for (let j = 0; j < 5; j++) {
      const dna = new THREE.Group();
      const numBasePairs = 20;
      for (let i = 0; i < numBasePairs; i++) {
        const angle = i * 0.5;
        const yPos = (i - numBasePairs / 2) * 1.2;

        const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const node1 = new THREE.Mesh(sphereGeo, nodeMaterial);
        node1.position.set(Math.cos(angle) * 2, yPos, Math.sin(angle) * 2);

        const node2 = new THREE.Mesh(sphereGeo, nodeMaterial);
        node2.position.set(Math.cos(angle + Math.PI) * 2, yPos, Math.sin(angle + Math.PI) * 2);

        const linkGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
        const link = new THREE.Mesh(linkGeo, bondMaterial);
        link.position.set(0, yPos, 0);
        link.rotation.x = Math.PI / 2;
        link.rotation.z = -angle;

        dna.add(node1, node2, link);
      }
      dna.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 10);
      dna.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      
      dna.userData = {
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        yPos: dna.position.y,
        floatSpeed: Math.random() * 0.5 + 0.2
      };
      
      this.dnaStrands.push(dna);
      this.scene.add(dna);
    }

    // 2. Molecular Clusters
    for (let k = 0; k < 10; k++) {
      const molecule = new THREE.Group();
      const centerNode = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), nodeMaterial);
      molecule.add(centerNode);

      for (let i = 0; i < 4; i++) {
        const branchNode = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), nodeMaterial);
        branchNode.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
        
        const distance = branchNode.position.length();
        const cylinderGeo = new THREE.CylinderGeometry(0.05, 0.05, distance, 8);
        const bond = new THREE.Mesh(cylinderGeo, bondMaterial);
        
        bond.position.copy(branchNode.position).multiplyScalar(0.5);
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), branchNode.position.clone().normalize());
        
        molecule.add(branchNode, bond);
      }

      molecule.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
      
      // Add pulsing halo light
      const haloLight = new THREE.PointLight(0x00ffff, 10, 10);
      molecule.add(haloLight);

      molecule.userData = {
        rx: (Math.random() - 0.5) * 0.02,
        ry: (Math.random() - 0.5) * 0.02,
        yPos: molecule.position.y,
        floatSpeed: Math.random() * 1.0 + 0.5,
        light: haloLight,
        lightBaseIntensity: Math.random() * 10 + 5
      };

      this.molecules.push(molecule);
      this.scene.add(molecule);
    }

    // 3. Floating Medical Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 500;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(particlesGeo, particlesMat);
    this.scene.add(this.particles);

    // 4. Moving Light Waves (Data Grid Floor)
    const planeGeo = new THREE.PlaneGeometry(100, 100, 50, 50);
    const planeMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ffaa, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });
    this.dataGrid = new THREE.Mesh(planeGeo, planeMat);
    this.dataGrid.rotation.x = -Math.PI / 2;
    this.dataGrid.position.y = -15;
    this.scene.add(this.dataGrid);
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Parallax damping
    this.targetX = this.mouseX * 4;
    this.targetY = this.mouseY * 4;
    
    this.camera.position.x += (this.targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.camera.position.z += (this.targetScrollZ - this.camera.position.z) * 0.05;

    const time = Date.now() * 0.001;

    // Rotate and float DNA strands
    this.dnaStrands.forEach(dna => {
      dna.rotation.x += dna.userData['rx'];
      dna.rotation.y += dna.userData['ry'];
      dna.position.y = dna.userData['yPos'] + Math.sin(time * dna.userData['floatSpeed']) * 1.5;
    });

    // Rotate and float Molecules with pulsing lights
    this.molecules.forEach(mol => {
      mol.rotation.x += mol.userData['rx'];
      mol.rotation.y += mol.userData['ry'];
      mol.position.y = mol.userData['yPos'] + Math.cos(time * mol.userData['floatSpeed']) * 1.5;
      
      // Pulse the halo
      const light = mol.userData['light'] as THREE.PointLight;
      light.intensity = mol.userData['lightBaseIntensity'] + Math.sin(time * 3 + mol.userData['floatSpeed']) * 5;
    });

    // Slowly rotate particle field
    this.particles.rotation.y += 0.001;
    this.particles.rotation.x += 0.0005;

    // Undulate the data grid floor
    if (this.dataGrid) {
      const positionAttr = this.dataGrid.geometry.getAttribute('position');
      const positions = positionAttr.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Calculate Z displacement based on sine waves
        positions[i + 2] = Math.sin(x * 0.2 + time) * 1.5 + Math.cos(y * 0.2 + time) * 1.5;
      }
      positionAttr.needsUpdate = true;
    }

    // Interactive color shifting for fog based on mouse position
    const colorTopLeft = new THREE.Color(0x00ffff); // Cyan
    const colorTopRight = new THREE.Color(0x8a2be2); // Violet
    const colorBottomLeft = new THREE.Color(0x00ffaa); // Emerald
    const colorBottomRight = new THREE.Color(0x0a192f); // Deep Navy

    // Normalize mouse coords from [-1, 1] to [0, 1]
    const normX = (this.mouseX + 1) / 2;
    const normY = (this.mouseY + 1) / 2;

    const topColor = colorTopLeft.clone().lerp(colorTopRight, normX);
    const bottomColor = colorBottomLeft.clone().lerp(colorBottomRight, normX);
    const finalColor = topColor.lerp(bottomColor, normY);

    // Keep it dark so it acts as deep space fog
    finalColor.multiplyScalar(0.15); 
    
    // Add a slow sine wave pulse to the color intensity over time
    const intensityPulse = 0.8 + Math.sin(time * 0.5) * 0.2;
    finalColor.multiplyScalar(intensityPulse);

    this.scene.fog!.color.copy(finalColor);

    this.renderer.render(this.scene, this.camera);
  }
}

