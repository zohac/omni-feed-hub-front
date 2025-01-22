// types/RssFeedInfos.ts

export class RssFeedInfos {
  constructor(
    public title?: string,
    public description?: string,
    public link?: string,
    public image?: {
      link?: string
      url: string
      title?: string
    }
  ) {}
}
