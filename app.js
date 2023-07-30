const express = require('express'); // Import express
const app = express(); // Initialize express as app

const mongoose = require('mongoose'); // Import mongoose, which allows to interact with mongoDB using JaveScript instead of raw database queries

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Schema
const postsSchema = new mongoose.Schema({ // Create a new constant that holds the schema for the posts
    title: String,
    author: String, // email
    creation_date: { type: Date, default: Date.now }, // Actual creation date
    content: String
});

// Validate email
postsSchema.path('author').validate(function (author) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(author);
}, 'The e-mail field can   not be empty.')

const Post = mongoose.model('Post', postsSchema); //?

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tutorial');
    app.listen(3000, () => console.log("server started"));
};

main().catch(err => console.log(err));

// Create new post
app.post("/newPost", async (req, res) => {
    try {
        const new_post = new Post({
            title: req.body.title,
            author: req.body.author,
            creation_date: req.body.creation_date,
            content: req.body.content
        });
        // console.log(new_post.get())
        await new_post.save();
        res.send(new_post);
    }
    catch (error) {
        console.error("error!", error);
        return res.status(404).send("Post validation failed, author must be an email");
    }
});

// Get all posts sorted descending, by user and title
app.get("/posts", async (req, res) => {

    const direction = req.query.descending === "true" ? "descending" : "ascending";

    let desired_posts = await Post.find({
        title: req.query.title,
        author: req.query.author
    }).sort({ creation_date: direction })

    res.send(desired_posts);
});

// Get a post by ID
app.get("/posts/:id", async (req, res) => {
    try {
        // const post_id = req.params.id;
        // const found_post = await Post.find({ _id: post_id });
        const found_post = await Post.findById(req.params.id);
        res.send(found_post);
    }
    catch {
        console.error("ID not found!");
        return res.status(404).send("ID doesn't exist");
    }
});

// Delete posts
app.delete(["/posts", "/posts/:id"], async (req, res) => {
    try {
        if (req.params.id == null) {
            await Post.deleteMany({});
            return res.send("Posts deleted");
        }
        await Post.deleteOne({ _id: req.params.id });
        return res.send("Post deleted");
    }
    catch(error) {
        console.error("ID not found!", error);
        return res.status(404).send("ID doesn't exist");
    } ``
});
