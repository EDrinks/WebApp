import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { UserSettingsService } from '../services/user-settings.service';

@Pipe({name: 'localeDate'})
export class LocaleDatePipe extends DatePipe implements PipeTransform {

  constructor(private userSettings: UserSettingsService) {
    super('en-US');
  }

  transform(value: any, format?: string, timezone?: string, locale?: string) {
    return super.transform(value, this.userSettings.dateFormat, timezone, locale);
  }
}
