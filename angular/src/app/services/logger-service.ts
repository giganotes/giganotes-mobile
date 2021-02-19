import {Injectable} from '@angular/core';

@Injectable()
export class LoggerService {

    logFileName = 'thetapad.log';

    constructor() {
    }

    info(message: string): void {
        console.log(message);
    }

    debug(message: string): void {
      console.log(message);
    }

    error(message: string): void {
      console.log(message);
    }
}
