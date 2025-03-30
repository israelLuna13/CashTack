import express from 'express' 
import morgan from 'morgan'
import {connectDB} from "./config/connectionDatabse"
const app = express()


connectDB()
app.use(morgan('dev'))

app.use(express.json())



export default app