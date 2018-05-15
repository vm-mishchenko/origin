import {Injectable} from '@angular/core';

@Injectable()
export class Inquire {
    confirm(message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (confirm(message)) {
                resolve();
            } else {
                reject();
            }
        });
    }

    prompt(message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const result = prompt(message);

            if (result) {
                resolve(Boolean(result));
            } else {
                reject();
            }
        });
    }
}
