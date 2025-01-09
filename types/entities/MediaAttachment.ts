export class MediaAttachment {
  constructor(
    public id: number,
    public url: string,
    public type?: string,
    public width?: number,
    public height?: number,
    public length?: number,
    public title?: string
  ) {}

  static fromApiResponse(apiData: any): MediaAttachment {
    return new MediaAttachment(
      apiData.id,
      apiData.url,
      apiData.type,
      apiData.width,
      apiData.height,
      apiData.length,
      apiData.title
    )
  }
}
