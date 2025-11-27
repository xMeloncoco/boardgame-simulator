import { useRef, useEffect, useState } from 'react'
import { Stage, Layer } from 'react-konva'
import { useGameStore } from '@/stores/gameStore'
import TokenRenderer from './renderers/TokenRenderer'
import CardRenderer from './renderers/CardRenderer'
import ContainerRenderer from './renderers/ContainerRenderer'
import AreaRenderer from './renderers/AreaRenderer'
import { Token, Card, Container, Area } from '@/types/game'

interface GameCanvasProps {
  width?: number
  height?: number
}

export default function GameCanvas({ width = 1200, height = 800 }: GameCanvasProps) {
  const components = useGameStore((state) => state.components)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width, height })

  // Responsive canvas sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width: containerWidth, height: containerHeight } =
          containerRef.current.getBoundingClientRect()
        setCanvasSize({
          width: containerWidth,
          height: containerHeight,
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Separate components by type for rendering
  const areas: Area[] = []
  const containers: Container[] = []
  const cards: Card[] = []
  const tokens: Token[] = []

  components.forEach((component) => {
    switch (component.type) {
      case 'area':
        areas.push(component as Area)
        break
      case 'container':
        containers.push(component as Container)
        break
      case 'card':
        // Only render cards not in containers
        if (component.position) {
          cards.push(component as Card)
        }
        break
      case 'token':
        // Only render tokens not in containers
        if (component.position) {
          tokens.push(component as Token)
        }
        break
    }
  })

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0f3460',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Stage width={canvasSize.width} height={canvasSize.height}>
        {/* Background layer for areas */}
        <Layer>
          {areas.map((area) => (
            <AreaRenderer key={area.id} area={area} />
          ))}
        </Layer>

        {/* Main game layer */}
        <Layer>
          {tokens.map((token) => (
            <TokenRenderer key={token.id} token={token} />
          ))}
          {cards.map((card) => (
            <CardRenderer key={card.id} card={card} />
          ))}
          {containers.map((container) => (
            <ContainerRenderer key={container.id} container={container} />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
