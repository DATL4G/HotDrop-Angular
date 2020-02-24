import * as staging from './environment';

export const environmentStage = staging.environment;
export const dialogWidth: string = '300px';
export const snackbarDuration: number = 3000;

export const settingsOptions: Array<String> = [
    'Connectivity',
    'Patreon'
];

export const dependencies: Array<String> = [
    'Angular',
    'FontAwesome',
    'GSAP',
    'jQuery',
    'Socket.IO',
    'NGX-Device-Detector',
];

export const dependencyLinks: Array<string> = [
    'https://angular.io',
    'https://fontawesome.com',
    'https://greensock.com/gsap/',
    'https://jquery.com',
    'https://socket.io',
    'https://koderlabs.github.io/ngx-device-detector/',
];
