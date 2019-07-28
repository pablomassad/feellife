import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    constructor(private storage: Storage) { }
    
    get(key: string): Promise<any> {
        return this.storage.get(key); 
    }

    set(key: string, value: any) {
        this.storage.set(key, value);
    }
}