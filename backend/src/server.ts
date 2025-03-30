import express from 'express' 
import morgan from 'morgan'
import {connectDB} from "./config/connectionDatabse"
import routerBudget from './routes/budget.route'

const app = express()

connectDB()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets',routerBudget)


export default app