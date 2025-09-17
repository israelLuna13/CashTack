import { cookies } from "next/headers";

export default function getToken(){
    const token = cookies().get('CASTRACKER_TOKEN')?.value
    return token
}