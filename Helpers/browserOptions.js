import dotenv from 'dotenv';
import useful from 'useful-library';

const config = useful.loadJsonFile('config.json');
dotenv.config();

export function browserConfig () {
    if (!process.env.BROWSER)
        return config.browserOptions.headless;
    return config.browserOptions[process.env.BROWSER];
}

export function contextConfig () {
    return config.contextOptions;
}
