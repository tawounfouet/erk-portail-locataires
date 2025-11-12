import { IUser } from "./user.type";

export interface ILoginCredentials
{
    email: string;
    password: string;
}

export interface IAuthTokens 
{
    access: string;
    refresh: string;
}

export interface ILoginResponse 
{
    success: boolean;
    token?: string;
    user?: IUser;
    expiresIn?: number;
    message?: string;
    response_status?: number;
}