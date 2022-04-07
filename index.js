const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs/promises')
const nunjucks = require('nunjucks')
const { randomUUID } = require('crypto')

const server = express()

nunjucks.configure(
    'views',
    {
        express: server
    }
)

server.use(bodyParser.urlencoded({ extended: true }))

server.get('/', (req, res) => {
    fs.readdir('./views/posts')
        .then(
            posts => res.render("index.njk", { posts: posts.reverse() })
        )
})

server.get('/post', (req, res) => res.render("post.njk"))

server.post('/post', (req, res) => {
    const postText = req.body['post-text']
    const now = new Date(Date.now())
    const filePath = "./views/posts/" + now.toLocaleTimeString().replace(/[ ,/:]/g, '-') + randomUUID() + ".txt"
    fs.writeFile(filePath, `<p>${postText}</p><p class="date">${now}</p>`)
        .then(() => res.redirect('/'))
})

server.listen(12345, () => console.log("Server started!"))