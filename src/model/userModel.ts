export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface CreateUserModel {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserModel {
    name: string;
    email: string;
    password: string;
}
