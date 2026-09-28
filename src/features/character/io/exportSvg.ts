const characterStyles = `
  .body{fill:none;stroke:#5269c9;stroke-linecap:round;stroke-linejoin:round}
  .torso,.neck,.upper-limb,.lower-limb{stroke:#efc7a8}
  .pelvis,.leg{stroke:#5269c9}
  .head{fill:#efc7a8;stroke:#5269c9;stroke-width:9}
  .hand,.foot{fill:#efc7a8;stroke:#5269c9;stroke-width:8}
  .foot{fill:#46516a}
`

export function downloadCharacterSvg(source: SVGSVGElement): void {
  const svg = source.cloneNode(true) as SVGSVGElement
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.querySelector('title')?.remove()
  svg.querySelector('.bones')?.remove()
  svg.querySelector('.joints')?.remove()
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = characterStyles
  svg.prepend(style)

  const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, 'character.svg')
}
import { downloadBlob } from '../../../platform/download'

