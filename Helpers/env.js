import dotenv from 'dotenv';


dotenv.config();

export function lang () {
    return process.env.OUTLET_ENV.split('-')[1];
}

export function env () {
    return process.env.OUTLET_ENV.split('-')[0];
}

export function envWithLang () {
    return process.env.OUTLET_ENV;
}