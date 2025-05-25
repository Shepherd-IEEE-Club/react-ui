import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@woco/server/appRouter'; // adjust this path

export const trpc = createTRPCReact<AppRouter>();
