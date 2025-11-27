import { Rect, Group, Text, Circle } from 'react-konva'
import { Container } from '@/types/game'
import { useGameStore } from '@/stores/gameStore'

interface ContainerRendererProps {
  container: Container
}

export default function ContainerRenderer({ container }: ContainerRendererProps) {
  const updateComponent = useGameStore((state) => state.updateComponent)

  const position = container.position || { x: 50, y: 50 }
  const itemCount = container.contents.length

  const handleDragEnd = (e: { target: { x: () => number; y: () => number } }) => {
    updateComponent(container.id, {
      position: {
        x: e.target.x(),
        y: e.target.y(),
      },
    })
  }

  // Different rendering based on container type
  if (container.containerType === 'bag') {
    return (
      <Group x={position.x} y={position.y} draggable onDragEnd={handleDragEnd}>
        {/* Bag shape */}
        <Rect
          width={60}
          height={70}
          fill="#8B4513"
          stroke="#654321"
          strokeWidth={2}
          cornerRadius={5}
        />
        <Circle x={30} y={20} radius={20} fill="#654321" />

        {/* Item count */}
        <Text
          text={itemCount.toString()}
          fontSize={20}
          fill="#FFD700"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          width={60}
          offsetY={-25}
        />

        {/* Label */}
        <Text
          text={container.name}
          fontSize={10}
          fill="#fff"
          align="center"
          width={60}
          offsetY={-80}
        />
      </Group>
    )
  }

  if (container.containerType === 'deck') {
    return (
      <Group x={position.x} y={position.y} draggable onDragEnd={handleDragEnd}>
        {/* Stack of cards effect */}
        <Rect
          x={2}
          y={2}
          width={60}
          height={90}
          fill="#1a1a2e"
          stroke="#16c79a"
          strokeWidth={1}
          cornerRadius={3}
        />
        <Rect
          x={1}
          y={1}
          width={60}
          height={90}
          fill="#1a1a2e"
          stroke="#16c79a"
          strokeWidth={1}
          cornerRadius={3}
        />
        <Rect
          width={60}
          height={90}
          fill="#1a1a2e"
          stroke="#16c79a"
          strokeWidth={2}
          cornerRadius={3}
        />

        {/* Item count */}
        <Text
          text={itemCount.toString()}
          fontSize={18}
          fill="#fff"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          width={60}
          height={90}
        />

        {/* Label */}
        <Text
          text={container.name}
          fontSize={10}
          fill="#fff"
          align="center"
          width={60}
          offsetY={-15}
        />
      </Group>
    )
  }

  // Default: pile/discard/hand
  return (
    <Group x={position.x} y={position.y} draggable onDragEnd={handleDragEnd}>
      <Rect
        width={80}
        height={40}
        fill="#2a2a4e"
        stroke="#16c79a"
        strokeWidth={2}
        cornerRadius={5}
      />
      <Text
        text={`${container.name}\n(${itemCount})`}
        fontSize={12}
        fill="#fff"
        align="center"
        verticalAlign="middle"
        width={80}
        height={40}
      />
    </Group>
  )
}
