import { useState } from 'react'
import CSS from 'csstype'
import Alert from './Alert'

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'stretch',
}

const PostsForm: React.FC = () => {
  interface FormElements extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement
    post: HTMLInputElement
    author: HTMLSelectElement
  }

  interface PostsForm extends HTMLFormElement {
    readonly elements: FormElements
  }

  const [alert, setAlert] = useState({ show: false, message: '', type: '' })
  const handleAlert = (show = false, type = '', message = '') => {
    setAlert({ show, type, message })
  }

  const handleSubmit = (e: React.FormEvent<PostsForm>) => {
    e.preventDefault()
    const currentTarget = e.currentTarget
    const url = 'https://api.wintertons.us/post'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity: {
          title: currentTarget.postTitle.value,
          body: currentTarget.post.value,
          user: currentTarget.author.value,
          created: new Date(),
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          console.log(e)
          currentTarget.postTitle.value = ''
          currentTarget.post.value = ''
          currentTarget.author.value = ''
          return handleAlert(true, 'success', 'Post has been added')
        }
        throw new Error()
      })
      .catch((err) => {
        handleAlert(true, 'danger', 'Quote has Not been added')
        console.log(err)
      })
  }
  return (
    <>
      <h2>Add new post</h2>
      <form id="addPostForm" onSubmit={handleSubmit} autoComplete="off">
        {alert.show && <Alert {...alert} removeAlert={handleAlert} />}
        <fieldset style={styles}>
          <label htmlFor="postTitle">Title</label>
          <input type="text" name="postTitle" />
          <label htmlFor="post">Post Body</label>
          <textarea name="post" style={{ height: '33vh' }}></textarea>
          <label htmlFor="author">Author</label>
          <select name="author">
            <option value="select"></option>
            <option value="Elijah">Elijah</option>
            <option value="Katie">Katie</option>
            <option value="Kalob">Kalob</option>
            <option value="Sam">Sam</option>
            <option value="Ben">Ben</option>
          </select>
        </fieldset>
        <button type="submit">Add Post</button>
      </form>
    </>
  )
}

export default PostsForm
