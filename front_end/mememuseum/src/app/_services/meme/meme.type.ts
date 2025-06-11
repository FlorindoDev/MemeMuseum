export interface Meme {
    idMeme: number,
    image: string,
    description: string | "",
    createdAt?: Date,
    updatedAt?: Date,
    UserIdUser?: number
}