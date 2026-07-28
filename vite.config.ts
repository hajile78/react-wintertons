import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/types/**',
        'src/index.tsx',
        'src/partials/Header_Old.tsx',
        'src/partials/PostsOldContainer.tsx',
        'src/partials/PostsOldList.tsx',
        'src/partials/FamilyLinks.tsx',
        'src/partials/LinkQuote.tsx',
      ],
    },
  },
})
