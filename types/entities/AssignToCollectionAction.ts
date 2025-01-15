// src/domain/entities/assign.to.collection.action.ts

import type { ArticleCollection } from '~/types/entities/ArticleCollection'
import { ActionType } from '~/types/enums/ActionType'
import type { IBaseAction } from './Action'

export class AssignToCollectionAction implements IBaseAction {
  constructor(
    public id: number,
    public name: string,
    public type: ActionType.ASSIGN_TO_COLLECTION,
    public parameters: {
      collection: ArticleCollection
    }
  ) {}
}
