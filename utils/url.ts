export function withSearchParams(url: string, params: Record<string, string>) {
  return `${url}?${new URLSearchParams(params).toString()}`
}
