import axios from 'axios';

export default async function request (reqObject) {  
    try {
        return await axios(reqObject);            
    } catch (error) {
        console.error(error);
    }
}
