export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    id: number
    name: string;
    email: string;
    password: string;
}