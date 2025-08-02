// sync DB with models
// rather thats in memory or deplyoing
// this should only be done manually

import * as models from '@woco/db/models'

(async () => {
    const { sequelize } = await import('./client.ts');
    await sequelize.sync({ force: true });
})();
