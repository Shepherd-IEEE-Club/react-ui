import type { Request, Response } from 'express';
import { appRouter } from '../src/server/trpc/appRouter.ts';
import { createContext } from '@woco/server/context';
import { createFakeSession } from './fake_session';
import type { SessionData } from '@woco/lib/session';
import {CreateExpressContextOptions} from "@trpc/server/adapters/express";


export async function makeTestCaller(sessionOverrides: Partial<SessionData> = {}) {
    const req = {
        headers: {
            cookie: 'dummy=value',
        },
        session: createFakeSession(sessionOverrides),
        get: () => undefined,
        header: () => undefined,
        accepts: () => false,
        acceptsCharsets: () => false,
        acceptsEncodings: () => false,
        acceptsLanguages: () => false,
        range: () => undefined,
    } as unknown as Request;


    const res = {
        getHeader: () => undefined,
        setHeader: () => {},
        end: () => {},
    } as unknown as Response;

    const opts: CreateExpressContextOptions = {
        req,
        res,
        info: {} as any,
    };

    const ctx = await createContext(opts);
    return appRouter.createCaller(ctx);
}