class User {
    constructor(userId = null, username){
        this.userId = userId
        this.username = username
        this.blogPosts = []
    }

    addPost(post) {
        //validate that you are not adding duplicate trips
        this.blogPosts.push(post)
    }
}

class Post {
    constructor(title, subject, content, author){
        this.title = title
        this.subject = subject
        this.content = content
        this.author = author
    }
}

module.exports = {
    User: User,
    Post: Post
}