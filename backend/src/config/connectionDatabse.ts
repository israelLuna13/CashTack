import colors from 'colors'
import { db } from './db';

export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()//that create tables automaticaly
        console.log(colors.bgGreen.black("Database is working"));
        
    } catch (error) {
        //console.log(colors.bgRed.white(error));
        console.log(colors.bgRed.black("Failed connection to database"));
        
    }
}