import express from 'express';
import methodOverride from 'method-override';

const app = express();
const port = 3000;
// const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));


let posts = [];

app.get("/",(req,res)=>{
    res.render("index", {posts});
});

app.get("/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/new",(req,res)=>{
    const {title,author,content} = req.body;
    posts.push({title,author,content});     
    res.redirect("/");
});

// app.get("/post/:id",(req,res)=>{
//     const postId = req.params.id;
//     const post = posts[postId];
//     res.render("post",{post});
// });

app.get('/post/:title', (req, res) => {
    const post = posts.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === req.params.title);
    if (!post) return res.status(404).send('Post not found');
    res.render('post', { post });
});

app.get('/edit/:title', (req, res) => {
    const post = posts.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === req.params.title);
    if (!post) return res.status(404).send('Post not found');
    res.render('edit', { post });
});

// Update post route
app.put('/post/:title', (req, res) => {
    const postIndex = posts.findIndex(p => p.title.toLowerCase().replace(/\s+/g, '-') === req.params.title);
    if (postIndex === -1) return res.status(404).send('Post not found');
    
    posts[postIndex] = {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    };
    
    res.redirect(`/post/${req.body.title.toLowerCase().replace(/\s+/g, '-')}`);
});

// Delete post route
app.delete('/post/:title', (req, res) => {
    const postIndex = posts.findIndex(p => p.title.toLowerCase().replace(/\s+/g, '-') === req.params.title);
    if (postIndex === -1) return res.status(404).send('Post not found');
    
    posts.splice(postIndex, 1);
    res.redirect('/');
});


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});