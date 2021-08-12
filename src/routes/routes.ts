import {Express, Request, Response} from 'express';
import { Util } from "../common/util";
import { initCommentRoutes } from './comment.routes';
import { initPostRoutes } from './post.routes';
import { initUserRoutes } from './user.routes';

export function initRoutes(app: Express) {
    app.get('/api', (req: Request, res: Response) => Util.sendSuccess(res, "Blog Api Works"));

    initUserRoutes(app);
    initPostRoutes(app);
    initCommentRoutes(app);

    /* ALL OTHER REQUESTS */
    app.all('*', (req: Request, res: Response) => Util.sendError(res, "Route Not Found"));
}