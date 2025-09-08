import { useState, FormEvent } from 'react'
import CSS from 'csstype'
import Form from '../components/common/Form'
import { api } from '../services/api'

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'stretch',
}

interface FormElements extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  post: HTMLInputElement
  author: HTMLSelectElement
}

interface PostsFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

const PostsForm: React.FC = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  
  const handleSubmit = async (e: FormEvent<PostsFormElement>) => {
    e.preventDefault()
    const currentTarget = e.currentTarget
    
    try {
      await api.addPost(
        currentTarget.postTitle.value,
        currentTarget.post.value,
        currentTarget.author.value,
        new Date()
      )
      
      currentTarget.postTitle.value = ''
      currentTarget.post.value = ''
      currentTarget.author.value = ''
      setAlert({ show: true, type: 'success', message: 'Post has been added' })
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: 'Post has not been added' })
      console.error(err)
    }
  }

  return (
    <Form
      id="addPostForm"
      title="Add new post"
      onSubmit={handleSubmit}
      alert={alert}
    >
      <fieldset style={styles}>
        <label htmlFor="postTitle">Title</label>
        <input type="text" name="postTitle" required />
        <label htmlFor="post">Post Body</label>
        <textarea name="post" style={{ height: '33vh' }} required></textarea>
        <label htmlFor="author">Author</label>
        <select name="author" required>
          <option value="">Select an author</option>
          <option value="Elijah">Elijah</option>
          <option value="Katie">Katie</option>
          <option value="Kalob">Kalob</option>
          <option value="Sam">Sam</option>
          <option value="Ben">Ben</option>
        </select>
      </fieldset>
    </Form>
  )
}

export default PostsForm
