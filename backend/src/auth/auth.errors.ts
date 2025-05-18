import { HttpStatus } from "@nestjs/common";

export class UserWithEmailAlreadyExistsError extends Error {
    public httpStatusCode: number;

    constructor(message: string = 'User with this email already exists') {
        super(message);
        this.name = "UserWithEmailAlreadyExistsError";
        this.httpStatusCode = HttpStatus.BAD_REQUEST;
    }
}

export class UserNotFoundError extends Error {
    public httpStatusCode: number;

    constructor(message: string = 'User not found') {
        super(message);
        this.name = "UserNotFoundError";
        this.httpStatusCode = HttpStatus.NOT_FOUND;
    }
}
  
export class InvalidPasswordError extends Error {
    public httpStatusCode: number;

    constructor(message: string = 'Invalid password') {
        super(message);
        this.name = "InvalidPasswordError";
        this.httpStatusCode = HttpStatus.UNAUTHORIZED;
    }
}


export class ExpiredRefreshToken extends Error {
    public httpStatusCode: number;

    constructor(message: string = 'Expired Refresh Token') {
        super(message);
        this.name = "ExpiredRefreshToken";
        this.httpStatusCode = HttpStatus.UNAUTHORIZED;
    }
}
