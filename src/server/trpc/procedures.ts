import {t} from "./init.ts";

import {requireUser} from "./middleware/requireUser.ts";

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(requireUser);


