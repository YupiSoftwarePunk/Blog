export class Comment {
    public postId: number | string;
    public authorId: number | string;
    public text: string;
    public date: Date;

    constructor(postId: number | string, authorId: number | string, text: string) {
        this.postId = postId;
        this.authorId = authorId;
        this.text = text;
        this.date = new Date();
    }
}