import { Rect, Text, Group } from 'react-konva'
import { Area } from '@/types/game'

interface AreaRendererProps {
  area: Area
}

export default function AreaRenderer({ area }: AreaRendererProps) {
  const { x, y, width, height } = area.bounds

  return (
    <Group>
      {/* Area boundary */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(22, 199, 154, 0.1)"
        stroke="#16c79a"
        strokeWidth={2}
        dash={[10, 5]}
        cornerRadius={8}
      />

      {/* Area label */}
      <Text
        x={x + 10}
        y={y + 10}
        text={area.name}
        fontSize={14}
        fill="#16c79a"
        fontStyle="bold"
      />
    </Group>
  )
}
