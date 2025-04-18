import express from 'express' 
import morgan from 'morgan'
import {connectDB} from "./config/connectionDatabse"
import routerBudget from './routes/budget.route'
import routerAuth from './routes/auth.router'

const app = express()

 connectDB()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets',routerBudget)
app.use('/api/auth',routerAuth)


export default app