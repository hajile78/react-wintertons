const express = require('express')
const cors = require('cors')
const fetch = require('axios')
const apicache = require('apicache')
const app = express();
const PORT = process.env.PORT || 3000 

let cache = apicache.middleware

const path = __dirname + '/build/'

app.set('trust proxy', 1)

app.use(express.static(path))
// Enable cors
app.use(cors())

app.get('/', function (req,res) {
    res.sendFile(path + "index.html");
});

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
app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`)
    return 0
})