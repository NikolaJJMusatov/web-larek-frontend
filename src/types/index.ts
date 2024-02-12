export interface IProductList {
    total: number;
    items: IProductItem[];
}

export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IAppState {
    catalog: IProductList;
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IAdressForm {
    payment: string;
    adress: string;
}

export interface IContactsForm extends IAdressForm  {
    email: string;
    phone: string;
}

export interface IOrder extends IContactsForm {
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}