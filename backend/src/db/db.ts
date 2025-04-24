import { PrismaClient } from "@prisma/client";
import  dotenv from 'dotenv'
dotenv.config({ path: "../../.env"})

 const prismaClient = new PrismaClient({
    datasources:{
        db:{
            url: process.env.DATABASE_URL
        }
    }
})
export default prismaClient