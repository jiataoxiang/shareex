class Post {
    constructor(post_id, title, date, user_id, content, type) {
        this.post_id = post_id;
        this.title = title;
        this.date = date;
        this.user_id = user_id;
        this.content = content;
        this.attachments = [];
        this.type;
    }
}

export default Post;
