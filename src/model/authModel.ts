export interface LoginRequestModel {
  email: string;
  password: string;
}

export interface LoginResponseModel {
  token: string;
}

export interface generateTokenModel {
    id: number
    email: string
}

export interface verifyTokenModel {
    token: string
    jwtSecret: string
}

export interface comparePasswordModel {
    password: string
    hash: string
}
