export interface User {
    idUser?: number,
    nickName: string,
    email: string,
    profilePic: string | null,
    createdAt?: Date,
    updatedAt?: Date
}