interface IContact {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
}


export interface IMessage {
  chatId: string;
  text: string;
  media?: any;
  location?: any;
  poll?: any;
  contact?: IContact;
  options: any;
}