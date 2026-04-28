export class Post {
    public title: string;
    public content: string;
    public authorId: number | string;
    public tags: string[];
    public date: Date;

    constructor(title: string, content: string, authorId: number | string, tags: string[] = []) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.tags = tags;
        this.date = new Date();
    }

    public createNewPost() {
        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: this.title,
            content: this.content,
            authorId: this.authorId,
            tags: this.tags,
            date: this.date.toISOString().split('T')[0],
            views: "0"
        };
    }
}