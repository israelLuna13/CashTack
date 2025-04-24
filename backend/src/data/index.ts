import { db } from "../config/db";
import {exit} from 'node:process'
const claerData = async()=>{
    try {
        await db.sync({force:true})
        console.log('Data deleted sucessfully');
        exit(0)
    } catch (error) {
        // console.log(error);
        exit(1)
    }
}

if(process.argv[2] === '--clear')
{claerData()
}

