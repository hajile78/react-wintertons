import type { ReactElement, ReactNode } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from '@tanstack/react-query'
import {
  MemoryRouter,
  type MemoryRouterProps,
} from 'react-router-dom'
import {
  render,
  type RenderOptions,
} from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import ModalContext from '../context/ModalContext'
import type { ModalContextType } from '../types/ModalContextType'

export function createTestQueryClient(config: QueryClientConfig = {}) {
  const { defaultOptions, ...queryClientConfig } = config
  const {
    queries,
    mutations,
    ...otherDefaultOptions
  } = defaultOptions ?? {}

  return new QueryClient({
    ...queryClientConfig,
    defaultOptions: {
      ...otherDefaultOptions,
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        ...queries,
      },
      mutations: {
        retry: false,
        ...mutations,
      },
    },
  })
}

type ProviderOptions = {
  auth?: boolean
  modal?: NonNullable<ModalContextType>
  queryClient?: QueryClient
  router?: MemoryRouterProps
}

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & ProviderOptions

export function renderWithProviders(
  ui: ReactElement,
  {
    auth = false,
    modal,
    queryClient = createTestQueryClient(),
    router,
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  function Providers({ children }: { children: ReactNode }) {
    let content = children

    if (modal) {
      content = (
        <ModalContext.Provider value={modal}>
          {content}
        </ModalContext.Provider>
      )
    }

    if (auth) {
      content = <AuthProvider>{content}</AuthProvider>
    }

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...router}>{content}</MemoryRouter>
      </QueryClientProvider>
    )
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Providers, ...renderOptions }),
  }
}

export * from '@testing-library/react'
