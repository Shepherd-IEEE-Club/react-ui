import { SessionOptions, getIronSession } from 'iron-session';
import type { Request, Response } from 'express';

// cookie stuff
export type SessionData = {
    user_id?: number
};

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD ?? 'dev_password_32_characters_long!!',
    cookieName: process.env.SESSION_COOKIE_NAME ?? 'dev_woco',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    },
};

export function getSession(req: Request, res: Response) {
    return getIronSession<SessionData>(req, res, sessionOptions);
}
