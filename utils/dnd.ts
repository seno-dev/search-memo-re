import { KeyboardSensor, PointerSensor } from '@dnd-kit/core'

import type { KeyboardEvent, PointerEvent } from 'react'

export class SmartPointerSensor extends PointerSensor {
  static override activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        return (
          event.isPrimary &&
          event.button === 0 &&
          !isInteractive(event.target as Element)
        )
      },
    },
  ]
}

export class SmartKeyboardSensor extends KeyboardSensor {
  static override activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: KeyboardEvent) => {
        return !isInteractive(event.target as Element)
      },
    },
  ]
}

const interactiveTags = ['button', 'input', 'textarea', 'select', 'option']

function isInteractive(el: Element | null) {
  return el?.tagName && interactiveTags.includes(el.tagName.toLowerCase())
}
