import express from 'express' 
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import {connectDB} from "./config/connectionDatabse"
import routerBudget from './routes/budget.route'
import routerAuth from './routes/auth.router'
import { swaggerSpec } from './config/swagger'

const app = express()

 connectDB()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets',routerBudget)
app.use('/api/auth',routerAuth)
app.use('/api/docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec))


export default app