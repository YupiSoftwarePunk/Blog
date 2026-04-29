export class Post {
    public title: string;
    public content: string;
    public authorId: number | string;
    public tags: string[];
    public date: Date;
    public image: any;

    constructor(title: string, content: string, authorId: number | string, tags: string[] = [], image: any = null) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.tags = tags;
        this.date = new Date();
        this.image = image;
    }

    public createNewPost() {
        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: this.title,
            content: this.content,
            authorId: this.authorId,
            tags: this.tags,
            date: this.date.toISOString().split('T')[0],
            views: "0",
            image: this.image
        };
    }
}