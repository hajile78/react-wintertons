import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { api } from '../services/api'
import PostsForm from './PostsForm'

vi.mock('../services/api', () => ({
  api: {
    addPost: vi.fn(),
  },
}))

const addPost = vi.mocked(api.addPost)

async function fillPostForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Title'), 'Family news')
  await user.type(screen.getByLabelText('Post Body'), 'A useful update')
  await user.selectOptions(screen.getByLabelText('Author'), 'Katie')
  return user
}

describe('PostsForm', () => {
  it('marks every field required and rejects an empty submission', () => {
    render(<PostsForm />)

    expect(screen.getByLabelText('Title')).toBeRequired()
    expect(screen.getByLabelText('Post Body')).toBeRequired()
    expect(screen.getByLabelText('Author')).toBeRequired()

    fireEvent.submit(screen.getByRole('form', { name: 'Add new post' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please fill in all fields',
    )
    expect(addPost).not.toHaveBeenCalled()
  })

  it('submits exact values with the current system time', async () => {
    const now = new Date('2026-04-20T15:30:00Z')
    addPost.mockResolvedValue({})
    render(<PostsForm />)
    await fillPostForm()
    vi.useFakeTimers()
    vi.setSystemTime(now)

    await act(async () => {
      fireEvent.submit(screen.getByRole('form', { name: 'Add new post' }))
    })

    expect(addPost).toHaveBeenCalledWith(
      'Family news',
      'A useful update',
      'Katie',
      now,
    )
  })

  it('clears fields and shows success after the post is added', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    addPost.mockResolvedValue({})
    render(<PostsForm />)
    const user = await fillPostForm()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Post has been added',
    )
    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Post Body')).toHaveValue('')
    expect(screen.getByLabelText('Author')).toHaveValue('')
  })

  it('preserves input and shows an error when the API rejects', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    addPost.mockRejectedValue(new Error('Network error'))
    render(<PostsForm />)
    const user = await fillPostForm()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Post has not been added',
    )
    expect(screen.getByLabelText('Title')).toHaveValue('Family news')
    expect(screen.getByLabelText('Post Body')).toHaveValue('A useful update')
    expect(screen.getByLabelText('Author')).toHaveValue('Katie')
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error))

    act(() => vi.runOnlyPendingTimers())
  })
})
