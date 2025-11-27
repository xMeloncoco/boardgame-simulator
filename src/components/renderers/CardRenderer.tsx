import { Rect, Group, Text, Image as KonvaImage } from 'react-konva'
import { Card } from '@/types/game'
import { useGameStore } from '@/stores/gameStore'
import { useState } from 'react'
import useImage from 'use-image'

interface CardRendererProps {
  card: Card
}

export default function CardRenderer({ card }: CardRendererProps) {
  const updateComponent = useGameStore((state) => state.updateComponent)
  const [isDragging, setIsDragging] = useState(false)

  const currentImage = card.faceUp ? card.frontImage : card.backImage
  const [image] = useImage(currentImage || '', 'anonymous')

  const position = card.position || { x: 100, y: 100 }
  const { width, height } = card.size

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (e: { target: { x: () => number; y: () => number } }) => {
    setIsDragging(false)
    updateComponent(card.id, {
      position: {
        x: e.target.x(),
        y: e.target.y(),
      },
    })
  }

  const handleDoubleClick = () => {
    updateComponent(card.id, { faceUp: !card.faceUp } as Partial<Card>)
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
        <KonvaImage image={image} width={width} height={height} />
      ) : (
        <>
          <Rect
            width={width}
            height={height}
            fill={card.faceUp ? '#FFFFFF' : '#1a1a2e'}
            stroke="#16c79a"
            strokeWidth={2}
            cornerRadius={5}
          />
          <Text
            text={card.faceUp ? card.name : '?'}
            fontSize={14}
            fill={card.faceUp ? '#000' : '#fff'}
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
            width={width}
            height={height}
            padding={10}
            wrap="word"
          />
        </>
      )}
    </Group>
  )
}
