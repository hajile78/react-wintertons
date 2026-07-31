const reactRoot = vi.hoisted(() => ({
  render: vi.fn(),
  createRoot: vi.fn(),
}))

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: reactRoot.createRoot,
  },
}))

vi.mock('./App', () => ({
  default: () => 'Application',
}))

describe('application entrypoint', () => {
  beforeEach(() => {
    vi.resetModules()
    reactRoot.createRoot.mockReturnValue({
      render: reactRoot.render,
      unmount: vi.fn(),
    })
  })

  it('mounts the application into #root', async () => {
    document.body.innerHTML = '<div id="root"></div>'
    const rootElement = document.getElementById('root')

    await import('./index')

    expect(reactRoot.createRoot).toHaveBeenCalledWith(rootElement)
    expect(reactRoot.render).toHaveBeenCalledOnce()
  })

  it('fails clearly when #root is missing', async () => {
    document.body.innerHTML = ''

    await expect(import('./index')).rejects.toThrow('Root element not found')
    expect(reactRoot.createRoot).not.toHaveBeenCalled()
  })
})
