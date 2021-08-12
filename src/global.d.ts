declare module 'cors';

declare namespace Express {
    export interface Request {
        user?: User;
    }

    interface User {
        id?: string;
        email?: string;
        userType: string;
    }
}