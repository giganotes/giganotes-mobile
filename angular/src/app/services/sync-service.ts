import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { LoggerService } from './logger-service';
import {InteropService} from './interop.service';

@Injectable()
export class SyncService {

    private subject = new Subject<any>();
    private _isSyncing = false;

    public lastSyncDate: Date = null;

    constructor(private loggerSerivce: LoggerService,
                private authService: AuthService,
                private interopService: InteropService) {
    }

    isSyncing(): boolean {
        return this._isSyncing;
    }

    async callSync(): Promise<void> {
      await this.interopService.synchronize();
    }

    async doSync(): Promise<void> {
        try {
            if (this._isSyncing) {
                return;
            }
            this.lastSyncDate = new Date();
            this._isSyncing = true;
            await this.callSync();
            this._isSyncing = false;
            this.subject.next({ type: 'success' })
        } catch (e) {
            console.log(e)
            this.subject.next({ type: 'error', message: 'Cannot connect to server' })
        }
    }


    getMessages(): Observable<any> {
        return this.subject.asObservable();
    }
}
