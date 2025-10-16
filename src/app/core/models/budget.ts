
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

export type SortKey = 'date' | 'price' | 'name';

export interface MainFormValues {
  seo?: boolean | null | undefined;
  ads?: boolean | null | undefined;
  web?: boolean | null | undefined;
}


export interface PanelFormValues {
  numPages?: number | null; 
  numLanguages?: number | null;
}
