<script lang="ts">
  import { onMount } from 'svelte'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  import { artworkCategories, type ArtworkCategoryId, type ArtworkPieceId } from '../model/artworkCatalog'
  import { createArtworkPiece } from '../model/objectFactory'
  import { downloadBlob } from '../../../platform/download'

  let viewport: HTMLDivElement
  let category: ArtworkCategoryId = $state('forms')
  let projection: 'perspective' | 'orthographic' = $state('perspective')
  let view: 'threeQuarter' | 'front' | 'side' | 'top' = $state('threeQuarter')
  let objectCount = $state(0)
  let renderError = $state('')
  let ready = $state(false)
  let addToScene: ((id: ArtworkPieceId) => void) | undefined
  let clearScene: (() => void) | undefined
  let changeProjection: ((value: 'perspective' | 'orthographic') => void) | undefined
  let changeView: ((value: typeof view) => void) | undefined
  let exportScene: (() => void) | undefined

  const colors = ['#287c79', '#ef8354', '#54478c', '#e5b44f', '#3668a5', '#ba5360']
  const objectLimit = 48
  const pieces = $derived(artworkCategories.find((item) => item.id === category)?.pieces ?? [])

  onMount(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f1eee7')
    scene.add(new THREE.HemisphereLight('#ffffff', '#a7a39b', 2.2))
    const keyLight = new THREE.DirectionalLight('#ffffff', 3)
    keyLight.position.set(-4, 8, 6)
    scene.add(keyLight)
    const grid = new THREE.GridHelper(12, 12, '#9a9a94', '#d3d0c8')
    grid.position.y = -0.015
    scene.add(grid)

    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    let controls: OrbitControls
    let disposed = false
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: true })
    } catch {
      renderError = '3D preview is unavailable. Enable WebGL in this browser or device.'
      return () => {}
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    viewport.append(renderer.domElement)

    function applyView() {
      const radius = view === 'threeQuarter' ? 7 : 8
      if (view === 'front') camera.position.set(0, 2.8, radius)
      else if (view === 'side') camera.position.set(radius, 2.8, 0)
      else if (view === 'top') camera.position.set(0, radius, 0.01)
      else camera.position.set(radius * 0.72, radius * 0.58, radius * 0.72)
      controls.target.set(0, 0.8, 0)
      controls.update()
      renderer.render(scene, camera)
    }

    function resize() {
      if (disposed) return
      const width = Math.max(1, viewport.clientWidth)
      const height = Math.max(1, viewport.clientHeight)
      renderer.setSize(width, height, false)
      const aspect = width / height
      if (camera instanceof THREE.PerspectiveCamera) camera.aspect = aspect
      else {
        const halfHeight = 5
        camera.left = -halfHeight * aspect
        camera.right = halfHeight * aspect
        camera.top = halfHeight
        camera.bottom = -halfHeight
      }
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    function setCamera() {
      controls?.dispose()
      const aspect = Math.max(1, viewport.clientWidth) / Math.max(1, viewport.clientHeight)
      camera = projection === 'perspective'
        ? new THREE.PerspectiveCamera(42, aspect, 0.1, 100)
        : new THREE.OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 0.1, 100)
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = false
      controls.addEventListener('change', () => renderer.render(scene, camera))
      applyView()
    }

    addToScene = (id) => {
      const index = objectCount
      const piece = createArtworkPiece(id, colors[index % colors.length])
      piece.userData.artworkPiece = true
      piece.position.set(((index % 3) - 1) * 1.8, 0, -Math.floor(index / 3) * 1.8)
      scene.add(piece)
      objectCount += 1
      renderer.render(scene, camera)
    }
    clearScene = () => {
      for (const piece of scene.children.filter((child) => child.userData.artworkPiece)) {
        piece.traverse((object) => {
          const mesh = object as THREE.Mesh
          mesh.geometry?.dispose()
          if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose())
          else mesh.material?.dispose()
        })
        scene.remove(piece)
      }
      objectCount = 0
      renderer.render(scene, camera)
    }
    changeProjection = (value) => {
      projection = value
      setCamera()
    }
    changeView = (value) => {
      view = value
      applyView()
    }
    exportScene = () => renderer.domElement.toBlob((blob) => {
      if (blob) downloadBlob(blob, '3d-artwork.png')
      else renderError = 'Could not export this 3D preview.'
    }, 'image/png')
    ready = true

    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(resize)
    if (observer) observer.observe(viewport)
    else window.addEventListener('resize', resize)
    setCamera()
    resize()

    return () => {
      disposed = true
      observer?.disconnect()
      if (!observer) window.removeEventListener('resize', resize)
      controls.dispose()
      addToScene = undefined
      clearScene = undefined
      changeProjection = undefined
      changeView = undefined
      exportScene = undefined
      ready = false
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh
        renderable.geometry?.dispose()
        if (Array.isArray(renderable.material)) renderable.material.forEach((material) => material.dispose())
        else renderable.material?.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  })

  function addPiece(id: ArtworkPieceId) {
    if (objectCount >= objectLimit) return
    addToScene?.(id)
  }
</script>

<section class="three-workspace" aria-labelledby="three-title">
  <header class="workspace-heading">
    <div><p class="eyebrow">3D DESIGN</p><h1 id="three-title">Build a scene</h1><p>Choose an artwork group, add forms, and set the camera.</p></div>
    <button class="export-button" type="button" onclick={() => exportScene?.()} disabled={!ready}>Export PNG</button>
  </header>

  <div class="toolbar">
    <label class="category-picker">Artwork group
      <select bind:value={category}>
        {#each artworkCategories as item}<option value={item.id}>{item.name}</option>{/each}
      </select>
    </label>
    <div class="piece-list" aria-label="Add a 3D object">
      {#each pieces as piece}<button type="button" onclick={() => addPiece(piece.id)} disabled={!ready || objectCount >= objectLimit}>+ {piece.name}</button>{/each}
    </div>
    <span class="object-count">{objectCount}/{objectLimit} objects</span>
  </div>

  <div class="workarea">
    <div class="viewport-wrap">
      <div class="viewport" bind:this={viewport}>
        {#if objectCount === 0 && !renderError}<span class="empty-hint">Select a form above to start your scene.</span>{/if}
        {#if renderError}<span class="render-error" role="status">{renderError}</span>{/if}
      </div>
    </div>
    <aside class="camera-panel" aria-label="Camera settings">
      <fieldset><legend>Projection</legend>
        <button type="button" aria-pressed={projection === 'perspective'} onclick={() => changeProjection?.('perspective')}>Perspective</button>
        <button type="button" aria-pressed={projection === 'orthographic'} onclick={() => changeProjection?.('orthographic')}>Orthographic</button>
      </fieldset>
      <fieldset><legend>View</legend>
        <button type="button" aria-pressed={view === 'threeQuarter'} onclick={() => changeView?.('threeQuarter')}>3/4</button>
        <button type="button" aria-pressed={view === 'front'} onclick={() => changeView?.('front')}>Front</button>
        <button type="button" aria-pressed={view === 'side'} onclick={() => changeView?.('side')}>Side</button>
        <button type="button" aria-pressed={view === 'top'} onclick={() => changeView?.('top')}>Top</button>
      </fieldset>
      <button class="clear-button" type="button" onclick={() => clearScene?.()} disabled={!objectCount}>Clear scene</button>
      <p>Drag to orbit · scroll to zoom</p>
    </aside>
  </div>
</section>

<style>
  .three-workspace { min-height: 100%; padding: clamp(18px, 3vw, 36px); color: #202722; }
  .workspace-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
  .workspace-heading h1 { margin: 3px 0 6px; font-size: clamp(24px, 3vw, 34px); }
  .workspace-heading p { margin: 0; color: #68716a; }
  .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .12em; }
  button, select { min-height: 38px; border: 1px solid #c9cec7; border-radius: 8px; background: #fff; color: inherit; padding: 0 12px; font: inherit; cursor: pointer; }
  button:hover:not(:disabled), button[aria-pressed="true"] { border-color: #287c79; background: #e5f0eb; }
  button:disabled { cursor: not-allowed; opacity: .5; }
  .export-button { background: #287c79; border-color: #287c79; color: #fff; }
  .toolbar { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; margin-bottom: 16px; }
  .category-picker { display: grid; gap: 5px; color: #59625c; font-size: 12px; }
  .piece-list { display: flex; flex-wrap: wrap; gap: 7px; }
  .object-count { margin-left: auto; padding: 10px 4px; color: #69726b; font-size: 13px; }
  .workarea { display: grid; grid-template-columns: minmax(0, 1fr) 215px; gap: 14px; }
  .viewport-wrap { min-width: 0; }
  .viewport { position: relative; min-height: 420px; height: min(65vh, 680px); overflow: hidden; border: 1px solid #d6d7d0; border-radius: 12px; background: #f1eee7; }
  .viewport :global(canvas) { display: block; width: 100%; height: 100%; }
  .empty-hint, .render-error { position: absolute; inset: 50% auto auto 50%; width: max-content; max-width: 90%; transform: translate(-50%, -50%); color: #727a72; font-size: 14px; pointer-events: none; }
  .render-error { color: #a43d3d; }
  .camera-panel { display: flex; flex-direction: column; gap: 16px; padding: 16px; border: 1px solid #e0e1db; border-radius: 12px; background: #faf9f6; }
  fieldset { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin: 0; padding: 0; border: 0; }
  legend { margin-bottom: 8px; font-size: 13px; font-weight: 700; }
  fieldset button { padding: 0 7px; font-size: 12px; }
  .clear-button { margin-top: auto; }
  .camera-panel p { margin: 0; color: #737b74; font-size: 12px; }
  @media (max-width: 720px) {
    .workspace-heading { align-items: flex-start; }
    .workarea { grid-template-columns: 1fr; }
    .viewport { height: 55vh; min-height: 320px; }
    .camera-panel { display: grid; grid-template-columns: 1fr 1fr; }
    .clear-button { margin: 0; }
    .object-count { width: 100%; margin: 0; padding: 0; }
  }
</style>
