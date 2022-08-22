export interface IUser {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    followers: any[];
    following: any[];
    profilePicture?: string;
    coverPicture?: string;
    about?: string;
    livesIn?: string;
    worksAt?: string;
    relationshipStatus?: string;
};