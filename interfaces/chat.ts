export interface IMessage {
    senderId?: string
    message?: string
    response?: string
    agent?: boolean
    adminView?: boolean
    userView?: boolean
    ready?: boolean

    createdAt?: Date
    updatedAt?: Date
}