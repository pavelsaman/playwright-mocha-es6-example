import dotenv from 'dotenv';
import config from '../config';


dotenv.config();

export function browserConfig () {
    if (!process.env.BROWSER)
        return config.browserOptions.headless;
    return config.browserOptions[process.env.BROWSER];
}

export function contextConfig () {
    return config.contextOptions;
}
