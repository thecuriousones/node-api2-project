// implement your posts router here
const Post = require("./posts-model.js")
const express = require('express')
const router = express.Router()


// Posts Endpoints

// [GET] /api/posts (R of CRUD, fetch all posts)
router.get('/', (req,res)=>{
    Post.find()
        .then(posts =>{
            console.log(posts);
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({
              message: "The posts information could not be retrieved",
            });
          });
})

// [GET] /api/posts/:id (R of CRUD, fetch post by :id)
router.get('/:id', (req,res)=>{
    Post.findById(req.params.id)
        .then(post =>{
            if (post) {
                res.status(200).json(post);
            }else(
                res.status(404).json({message: "The post with the specified ID does not exist"})
            )
        })
        .catch(error => {
            res.status(500).json({
              message: "The post information could not be retrieved",
            });
          });
})

// [POST] /api/posts (C of CRUD, create new post from JSON payload)
router.post('/', (req,res)=>{
    const newPost = req.body
    if(!newPost.title || !newPost.contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    }else{
        Post.insert(newPost)
            .then(post =>{
                res.status(201).json(post)
            })
            .catch(error => {
                res.status(500).json({
                  message: "There was an error while saving the post to the database",
                });
              });
    }
        
})
// [PUT] /api/posts/:id (U of CRUD, update post with :id using JSON payload)
router.put('/:id', async (req,res)=>{
    const post = req.body
    const {id} = req.params
    try{
        if(!post.title || !post.contents){
            res.status(400).json({message: "Please provide title and contents for the post"})
        }else{
            const updatedPost = await Post.update(id,post)
            if(!updatedPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }else{
                res.status(200).json(updatedPost)
            }
        }        
    }catch(err){
        res.status(500).json({message: "The post information could not be modified"})
    }
})

// [DELETE] /api/posts/:id (D of CRUD, remove post with :id)
router.delete('/:id', async (req,res)=>{
    try{
        const {id} = req.params
        const deletedPost = await Post.remove(id)
        if(!deletedPost){
            res.status(404).json({message: "The post with the specified ID does not exist"})
        }else{
            res.status(200).json(deletedPost)
        }
    }catch(err){
        res.status(500).json({message: "The post could not be removed"})
    }
})

// [GET] /api/posts/:id/comments (R of CRUD, fetch comment by :id)
router.get('/:id/comments', (req,res)=>[
    Post.findCommentById(req.params.id)
        .then(post =>{
            if (post) {
               res.status(200).json(post);
             }else(
               res.status(404).json({message: "The post with the specified ID does not exist"}))
        })
        .catch(error => {
            res.status(500).json({
              message: "The comments information could not be retrieved",
            });
          })
        
])








module.exports = router;
