
export interface ServiceOption {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

export interface Budget {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  selectedOptions: ServiceOption[];
  numPages: number;
  numLanguages: number;
  totalPrice: number;
  creationDate: Date;
}
