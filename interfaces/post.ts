export interface IPost {
    userId: string;
    description?: string;
    likes: any[];
    image?: string;
    createdAt?: string | any;
    updatedAt?: string | any;
}

export interface IFollowingPosts {
    followingPosts: IPost[]
}