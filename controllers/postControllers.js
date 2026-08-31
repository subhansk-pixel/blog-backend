import Post from '../models/Post.js'
export const createPost =  async( req, res) => {
   const { title, content } = req.body
   
   const imageUrl = req.file ? req.file.path : null


try {
     const post = await Post.create({ title, content, imageUrl, author: req.userId })
     res.status(201).json(post)

    } catch (error) {
        res.status(500).json({ message: error.message})
    
}
}  

export const getPosts = async( req, res) => {
 try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1})
    res.status(200).json(posts)
 } catch (error) {
    res.status(500).json({ message: error.message})
 }   
    

}
export const getPost = async( req, res) => {
 try {
    const post = await Post.findById(req.params.id).populate( 'author', 'username')
    
    res.status(200).json({post})
 } catch (error) {
    res.status(500).json({ message: error.message})
    }
    
}
 
export const deletePost = async ( req, res) => {
    try {
        const post =  await Post.findById(req.params.id)
       
        if (post.author.toString() !== req.userId){
            return res.status(403).json({ message: 'Not authorized' })
        }
         await post.deleteOne()
         res.status(200).json({ post})
        

    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}