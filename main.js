import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { AmbientLight, DirectionalLight } from 'three'
import vertex from './src/shaders/vertex.glsl'
import fragment from './src/shaders/fragment.glsl'
import Balrog from '/balcopia.glb?url'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { Vector3 } from 'three'
/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Scene
 */
const scene = new THREE.Scene()
const loader = new GLTFLoader()
loader.load(Balrog, (gltf) => {
	let model
	gltf.scene.traverse((el) => {
		if (el instanceof THREE.Mesh) {
			model = el
		}
	})
	console.log(model)
	// scene.add(model)
	model.geometry.scale(3, 3, 3)
	const sampler = new MeshSurfaceSampler(model).build()
	createParticles(sampler)
})
// scene.background = new THREE.Color(0xdedede)

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshStandardMaterial({ color: 'coral' })
// const geometry = new THREE.BoxGeometry(1, 1, 1)

/**
 * Plane
 */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.y += 0.5
// scene.add(mesh)
function createParticles(sampler) {
	const geometry = new THREE.BufferGeometry()
	const num = 5000
	const bound = 40

	const positionArray = new Float32Array(num * 3)
	const colorArray = new Float32Array(num * 3)

	const pos = new THREE.Vector3()

	for (let i = 0; i < num; i++) {
		// const x = Math.random() * bound - bound / 2
		// const y = Math.random() * bound - bound / 2
		// const z = Math.random() * bound - bound / 2

		sampler.sample(pos)
		const [x, y, z] = pos

		const r = Math.random()
		const g = Math.random()
		const b = Math.random()

		positionArray.set([x, y, z], i * 3)
		colorArray.set([r, g, b], i * 3)
	}

	console.log([positionArray])
	geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

	const material = new THREE.ShaderMaterial({
		fragmentShader: fragment,
		vertexShader: vertex,
		transparent: true,
	})

	const particles = new THREE.Points(geometry, material)
	scene.add(particles)
}
/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(4, 4, 4)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, 1.5)
const directionalLight = new DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}