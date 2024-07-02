export class JsonResponse {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }
  processObject(obj: object): string {
    return JSON.stringify(obj);
  }
  processObjectArray(objArray: object[]): string {
    return JSON.stringify(objArray);
  }

  processData(): any {
    if (Array.isArray(this.data)) {
      return this.processObjectArray(this.data);
    } else if (typeof this.data === "object") {
      return this.processObject(this.data);
    } else {
      return this.data;
    }
  }
}
