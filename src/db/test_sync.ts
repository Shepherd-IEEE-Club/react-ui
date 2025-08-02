// sync for tests

import {sequelize} from "./client.ts";
import * as models from '@woco/db/models'

beforeAll(async () => {
    await sequelize.sync({ force: true });
});
