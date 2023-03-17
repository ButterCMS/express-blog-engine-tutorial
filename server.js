var express = require('express'), 
partials = require('express-partials'),
axios = require('axios')
require( 'dotenv' ).config()

const app = express()

app.use(partials());
app.set('view engine', 'ejs')
app.use(express.static('public'))

let posts = []

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://api.buttercms.com/v2/posts/?exclude_body=true&auth_token=${process.env.READ_API}`)  
    posts = response.data.data
    res.render('index', {
      title: 'Home',
      searchValue: null,
      filteredPosts: null,
      posts
    })
  }catch(err) {
    res.status(500).send('An error occured')
  }
})

app.get('/search', (req, res) => {
   const filteredPosts = posts.filter((post) => (
    post.title.trim().toLowerCase().includes(req.query.search.trim().toLowerCase())
  ))
  res.render('index', {
    title: 'Home',
    searchValue: req.query.search,
    posts,
    filteredPosts
  })
})

app.get('/blog/:slug', async (req, res) => {
  try {
    const response = await axios.get(`https://api.buttercms.com/v2/posts/${req.params.slug}/?auth_token=${process.env.READ_API}`)
    res.render('blogDetail', {
      title: 'Blog',
      post: response.data.data
    })
  }catch(err) {
    res.status(500).send('An error occured')
  }
})

app.listen(5000, () => {
  console.log('Server started')
})