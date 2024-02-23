import { Model } from "./base/Model";
import { IAppState, IProductItem, IOrder, FormErrors, IAdressForm, IContactsForm } from "../types";
import { IEvents } from "./base/events";

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model<IAppState> {
    basket: IProductItem[] = [];
    catalog: IProductItem[];
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        total: null,
        address: '',
        payment: ''
    };
    formErrors: FormErrors = {};

    //формирует каталог продуктов, инициализирует событие изменения каталога
    setCatalog (items: IProductItem[]) {
      function getProduct(item: IProductItem, events:IEvents): IProductItem {
        return {
          id: item.id,
          description: item.description,
          image: item.image,
          title: item.title,
          category: item.category,
          price: item.price
        };
      }

      this.catalog = items.map(item => getProduct(item, this.events));
      this.emitChanges('items:changed', { catalog: this.catalog });
    }

    //очищает корзину
    clearBasket () {
      this.basket = [];
		  this.order.items = [];
		  this.updateBasket();
    }

    updateBasket () {
      this.emitChanges('counter:changed', this.basket);
		  this.emitChanges('basket:changed', this.basket);
    }

    //добавляет товар в корзину
    addToBasket (item: IProductItem) {
		  this.basket.push(item);
      this.updateBasket();
    }

    //проверяет товар в корзине
    findInBasket (item: IProductItem) {
      return this.basket.find((product) => product === item);
    }

    //удаляет товар из корзины
    removeFromBasket (item: IProductItem) {
	    this.basket = this.basket.filter((product) => product.id !== item.id);
	    this.updateBasket();
    }

    //проверяет значения данных доставки
    validateDelivery () {
		  const errors: typeof this.formErrors = {};

		  if (!this.order.payment) {
			  errors.address = 'Необходимо указать способ оплаты';
		  }

		  if (!this.order.address) {
			  errors.address = 'Необходимо указать адрес';
		  }

		  this.formErrors = errors;
		  this.events.emit('formErrorsDelivery:change', this.formErrors);
		  return Object.keys(errors).length === 0;
    }

    //проверяет значения данных контактов
    validateContact () {
		  const errors: typeof this.formErrors = {};
      const emailRegex = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
      const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

		  if (!this.order.email) {
			  errors.email = 'Необходимо указать email';
		  } else if (!emailRegex.test(this.order.email)) {
        errors.email = 'Проверьте корректность введеного email';
      }

		  if (!this.order.phone) {
			  errors.phone = 'Необходимо указать телефон';
		  } else if (!phoneRegex.test(this.order.phone)) {
        errors.phone = 'Проверьте корректность введеного номера телефона';
      }
      
		  this.formErrors = errors;
		  this.events.emit('formErrorsContacts:change', this.formErrors);
		  return Object.keys(errors).length === 0;
    }

    //формирует данные доставки, валидирует и  инициализирует событие о готовности
    setDeliveryField (field: keyof IAdressForm, value: string) {
		  this.order[field] = value;
		  if (this.validateDelivery()) {
			  this.events.emit('order:ready', this.order);
		  }
    }

    //формирует данные контактов доставки, валидирует и  инициализирует событие о готовности
    setContactField (field: keyof IContactsForm, value: string) {
		  this.order[field] = value;
		  if (this.validateContact()) {
			  this.events.emit('order:ready', this.order);
		  }
    }

    //очищает данные заказа
    clearOrder () {
		  this.order = {
		  	email: '',
			  phone: '',
			  items: [],
		  	total: null,
			  payment: '',
		  	address: '',
		  };
    }

	  setTotal(total: number) {
		  this.order.total = total;
  	}

    getTotal(): number {
      return this.basket.reduce((acc, item) => acc + item.price, 0);
    }

	  setItems(items: string[]) {
		  this.order.items = items;
    }

    setPayment(value: string) {
      this.order.payment = value;
    }
}
