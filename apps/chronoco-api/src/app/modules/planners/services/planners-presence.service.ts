import { Injectable } from '@nestjs/common';
import { Users } from '../../../entities/users.entity';

interface PresentUser extends Pick<Users, 'id' | 'name'> {
}

@Injectable()
export class PlannersPresenceService {
  private rooms: Map<string, Set<PresentUser>> = new Map<string, Set<PresentUser>>();

  public join(planId: string, user: PresentUser): string[] {
    if (!this.rooms.has(planId)) {
      this.rooms.set(planId, new Set());
    }

    this.rooms.get(planId).add(user);
    return Array.from(this.rooms.get(planId)).map(u => u.name);
  }

  public leave(planId: string, user: PresentUser): string[] {
    const users = this.rooms.get(planId);

    if (!users) {
      return [];
    }

    users.delete(user);

    if (users.size === 0) {
      this.rooms.delete(planId);
    }

    return Array.from(users).map(u => u.name);
  }
}