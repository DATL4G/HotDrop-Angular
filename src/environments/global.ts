import * as staging from './environment';
import * as production from './environment.prod';

export const environmentStage = staging.environment;
export const dialogWidth: string = '300px';
export const snackbarDuration: number = 3000;

export const settingsOptions: Array<String> = [
    'Account',
    'Connectivity',
    'Pro Version'
];

export const accountOptions: Array<String> = [
    'Google',
    'InteraApps Auth',
    'GitHub',
    'Anonymous'
];