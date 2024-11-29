import type { ComponentProps, JSXElementConstructor } from 'react'

function isElement(prop: unknown): prop is JSX.Element {
  if (
    typeof prop !== 'object' ||
    prop == null ||
    !Object.hasOwn(prop, '$$typeof')
  ) {
    return false
  }
  if (
    'type' in prop &&
    Object.hasOwn(prop, 'type') &&
    (typeof prop.type === 'function' ||
      typeof prop.type === 'string' ||
      typeof prop.type === 'symbol')
  ) {
    return true
  }
  return false
}

/**
 *
 * @example
 *
 * ```tsx
 * function Fuga() {
 *   return <div id="hoge"><Hoge className="fuga-hoge"/></div>
 * }
 *
 * const el = Fuga();
 * assert(extractProps(el, "div")!.id === "hoge");
 * assert(extractProps(el, Hoge)!.className === "fuga-hoge");
 * ```
 *
 **/
export function extractProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
>({ type, props }: JSX.Element, componentType: T): ComponentProps<T> {
  if (type === componentType) {
    return props
  }
  const foundProps = Object.values(props).reduce<ComponentProps<T>[]>(
    (acc, prop) => {
      if (!isElement(prop)) {
        return acc
      }
      const hit = extractProps(prop, componentType)
      if (!hit) {
        return acc
      }
      return [...acc, hit]
    },
    [],
  )
  if (!foundProps[0]) {
    throw new Error(`Props of ${componentType} not found`)
  }
  return foundProps[0]
}
