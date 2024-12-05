//тип данных товара
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//состояние страницы
export interface IAppState {
	catalog: IProductItem[];
	basket: string[];
	order: IOrder | null;
}

//данные из формы доставки и метода оплаты
export interface IAdressForm {
	payment: string;
	address: string;
}

//данные из формы контактов
export interface IContactsForm {
	email: string;
	phone: string;
}

//данные заказа
export interface IOrder extends IAdressForm, IContactsForm {
	items: string[];
	total: number;
}

//данные заказа на отправку серверу
export interface IOrderResult {
	id: string;
	total: number;
}

//данные ошибки ввода форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
