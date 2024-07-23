export class JsonResponse {
  private data: any;
  private message: string;

  constructor(data: any, message: string) {
    this.data = data;
    this.message = message;
  }

  public toJson() {
    return JSON.stringify({
      data: this.data,
      message: this.message,
    });
  }
}
