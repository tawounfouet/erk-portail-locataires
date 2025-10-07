import { IUser } from "@/types/user.type"

export const DEFAULT_USER: IUser = {
    id: "userid",
    email: "unknown@eureka-residences.com",

    first_name: "Unknown",
    last_name: "Unknown",
    phone: "+237 6XX XX XX XX XX",
    is_active: true,
    is_staff: false,
    is_tenant: false,
    date_joined: "1970-01-01",
    last_login: "1970-01-01",
    full_name: "Unknown Unknown",
    role_display: "Nothing"
}