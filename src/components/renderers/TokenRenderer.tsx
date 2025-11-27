import { Circle, Group, Text, Image as KonvaImage } from 'react-konva'
import { Token } from '@/types/game'
import { useGameStore } from '@/stores/gameStore'
import { useState, useEffect } from 'react'
import useImage from 'use-image'

interface TokenRendererProps {
  token: Token
}

export default function TokenRenderer({ token }: TokenRendererProps) {
  const updateComponent = useGameStore((state) => state.updateComponent)
  const [isDragging, setIsDragging] = useState(false)

  // Load token image if available
  const currentImage =
    token.currentSide === 'front' ? token.image : token.properties.backImage as string | undefined
  const [image] = useImage(currentImage || '', 'anonymous')

  const radius = 25
  const position = token.position || { x: 100, y: 100 }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (e: { target: { x: () => number; y: () => number } }) => {
    setIsDragging(false)
    updateComponent(token.id, {
      position: {
        x: e.target.x(),
        y: e.target.y(),
      },
    })
  }

  const handleDoubleClick = () => {
    if (token.flippable) {
      const newSide = token.currentSide === 'front' ? 'back' : 'front'
      updateComponent(token.id, { currentSide: newSide } as Partial<Token>)
    }
  }

  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDblClick={handleDoubleClick}
      opacity={isDragging ? 0.7 : 1}
    >
      {image ? (
        <KonvaImage
          image={image}
          width={radius * 2}
          height={radius * 2}
          offsetX={radius}
          offsetY={radius}
        />
      ) : (
        <>
          <Circle
            radius={radius}
            fill={getTokenColor(token.tokenType)}
            stroke="#fff"
            strokeWidth={2}
          />
          <Text
            text={token.name.substring(0, 3).toUpperCase()}
            fontSize={12}
            fill="#fff"
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
            width={radius * 2}
            offsetX={radius}
            offsetY={6}
          />
        </>
      )}
    </Group>
  )
}

// Helper to get color based on token type
function getTokenColor(tokenType: string): string {
  const colors: Record<string, string> = {
    sardine: '#8B4513',
    scallop: '#FFB6C1',
    water: '#4682B4',
    money: '#FFD700',
    default: '#888888',
  }
  return colors[tokenType.toLowerCase()] || colors.default
}
