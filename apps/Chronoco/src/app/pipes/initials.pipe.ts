import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appInitials' })
export class InitialsPipe implements PipeTransform {
  public transform(fullName: string): string {
    if (!fullName) return '';
    
    return fullName
      .trim()
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}
