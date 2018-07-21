import { Pipe } from '@angular/core';

@Pipe({name: 'price'})
export class PricePipe {

  transform(value: number) {
    return `${Number(value).toFixed(2)} €`;
  }
}
