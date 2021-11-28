const express = require('express')
const cors = require('cors')
const fetch = require('axios')
const apicache = require('apicache')
const app = express();
const port = 5000 

let cache = apicache.middleware

app.set('trust proxy', 1)

// Enable cors
app.use(cors())

// create a GET route
app.get('/api/:slug', cache('1 hour'), async (req, res) => { 
    const slug = req.params.slug
    console.log(`slug: ${slug}`)
    const server = 'https://apiwintertons.uc.r.appspot.com'
    const endPoint = slug ? `postsBy/${slug}` : `getPost/${id}`
    const data = await fetch.get(`${server}/${endPoint}`).then((r) => r.data)
    res.send(data)
        
});

// console.log that your server is up and running
app.listen(port, () => {
    console.log(`API Listening on port ${port}`)
    return 0
})