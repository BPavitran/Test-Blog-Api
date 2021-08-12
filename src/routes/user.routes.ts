import { Express } from "express";
import { UserEp } from "../endpoints/user.ep";

export function initUserRoutes(app: Express) {
    app.get('/api/users', UserEp.getAllUsers);

    app.post('/api/signIn', UserEp.signIn);
    app.post('/api/update-user', UserEp.updateUser);
    app.post('/api/delete-user', UserEp.deleteUserById);
}