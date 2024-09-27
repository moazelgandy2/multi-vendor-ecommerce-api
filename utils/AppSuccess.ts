export class AppSuccess {
  success: boolean;
  constructor(public message: string, public data: any) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
