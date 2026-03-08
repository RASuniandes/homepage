export function camelToSnake (camelCase: string): string {
  return camelCase.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function camelToSnakeObject (
  obj: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [camelToSnake(key), value])
  )
}
