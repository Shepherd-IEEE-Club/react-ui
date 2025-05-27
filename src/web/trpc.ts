import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@woco/server/appRouter.ts';

export const trpc = createTRPCReact<AppRouter>();
