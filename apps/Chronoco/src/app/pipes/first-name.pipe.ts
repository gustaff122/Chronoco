import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFirstName' })
export class FirstNamePipe implements PipeTransform {
  public transform(fullName: string): string {
    return fullName?.split(' ')[0] ?? '';
  }
}
