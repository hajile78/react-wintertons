import { vi } from 'vitest'

type JsonResponseOptions = {
  ok?: boolean
  status?: number
}

export function mockFetchJson(
  body: unknown,
  { ok = true, status = 200 }: JsonResponseOptions = {},
) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function setStoredValue<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function setSystemTime(now: string | Date) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(now))
}

export function mockRandom(value: number) {
  return vi.spyOn(Math, 'random').mockReturnValue(value)
}
