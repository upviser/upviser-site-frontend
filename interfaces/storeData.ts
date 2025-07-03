export interface IStoreData {
    _id?: string
    name?: string
    nameContact?: string
    email: string
    phone?: string
    locations?: {
        commercial?: boolean
        mapsLink?: string
        address?: string
        details?: string
        region?: string
        city?: string
        countyCoverageCode?: string
        streetName?: string
        streetNumber?: string
    }[]
    logo?: string
    logoWhite?: string
    instagram?: string
    facebook?: string
    tiktok?: string
}