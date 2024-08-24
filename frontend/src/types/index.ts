export interface BlogType {
    _id: string
    title: string;
    content: string;
    author: string
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentType {
    _id: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    post: string;
    createdAt: string;
}  