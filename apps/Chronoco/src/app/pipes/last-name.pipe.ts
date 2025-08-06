import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appLastName' })
export class LastNamePipe implements PipeTransform {
  public transform(fullName: string): string {
    const parts = fullName?.split(' ') ?? [];
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }
}
