// server/admin.ts
import AdminJS from 'adminjs'
import * as AdminJSSequelize from '@adminjs/sequelize'
import AdminJSExpress from '@adminjs/express'

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
})

import { sequelize } from '@woco/db/'
