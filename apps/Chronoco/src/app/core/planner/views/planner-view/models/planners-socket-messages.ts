export enum PlannersSocketMessages {
  PRESENCE_SNAPSHOT = 'PRESENCE_SNAPSHOT',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
}

export enum PlannersClientMessages {
  JOIN_PLANNER = 'JOIN_PLANNER',
}

export interface PlannersClientPayloads {
  [PlannersClientMessages.JOIN_PLANNER]: {
    planId: string;
  };
}