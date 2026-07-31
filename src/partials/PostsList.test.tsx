import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { buildPost } from '../test/fixtures'
import PostsList from './PostsList'

function renderPostsList(
  props: Partial<React.ComponentProps<typeof PostsList>> = {},
) {
  return render(
    <MemoryRouter>
      <PostsList posts={[]} loading={false} error={false} {...props} />
    </MemoryRouter>,
  )
}

describe('PostsList', () => {
  it('renders its loading, error, and empty states', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PostsList posts={[]} loading error={false} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading...')

    rerender(
      <MemoryRouter>
        <PostsList posts={[]} loading={false} error />
      </MemoryRouter>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Error loading posts.')

    rerender(
      <MemoryRouter>
        <PostsList posts={[]} loading={false} error={false} />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: 'No Content Here ☹️' }),
    ).toBeInTheDocument()
  })

  it('renders titles, destinations, trusted HTML bodies, authors, and dates', () => {
    const created = new Date('2026-01-15T12:00:00Z')
    renderPostsList({
      posts: [
        buildPost({
          id: 'post-42',
          title: 'A new branch',
          body: '<strong>Trusted family update</strong>',
          user: 'Elijah',
          created,
        }),
      ],
    })

    expect(screen.getByRole('link', { name: 'A new branch' })).toHaveAttribute(
      'href',
      '/post/post-42',
    )
    expect(screen.getByText('Trusted family update').tagName).toBe('STRONG')
    expect(screen.getByText('by Elijah')).toBeInTheDocument()
    expect(
      screen.getByText(
        `${created.toDateString()} ${created.toLocaleTimeString()}`,
        { exact: false },
      ),
    ).toBeInTheDocument()
  })

  it('omits author and date metadata for Main posts', () => {
    const post = buildPost({ user: 'Main' })
    renderPostsList({ posts: [post] })

    expect(screen.queryByText(/by Main/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(post.created.toDateString(), { exact: false }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('News from the family.')).toBeInTheDocument()
  })

  it('shows the optional More button and invokes its action', async () => {
    const user = userEvent.setup()
    const onMore = vi.fn()
    const { rerender } = render(
      <MemoryRouter>
        <PostsList
          posts={[buildPost()]}
          loading={false}
          error={false}
          onMore={onMore}
        />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Load more posts' }))
    expect(onMore).toHaveBeenCalledOnce()

    rerender(
      <MemoryRouter>
        <PostsList posts={[buildPost()]} loading={false} error={false} />
      </MemoryRouter>,
    )
    expect(
      screen.queryByRole('button', { name: 'Load more posts' }),
    ).not.toBeInTheDocument()
  })
})
