export class ExpressError extends Error {
  constructor(message, status) {
    super(); //calls the error constructor
    //adding message and
    this.message = message;
    this.status = status;
    // console.error(this.stack);
  }
}
