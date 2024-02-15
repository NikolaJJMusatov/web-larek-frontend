import {Model} from "./base/Model";
import {IAppState, IProductItem, IOrder, FormErrors} from "../types";

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};


export class ProductItem extends Model<IProductItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number|null;
}

export class AppState extends Model<IAppState> {
    basket: ProductItem[] = [];
    catalog: IProductItem[];
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        total: null,
        adress: '',
        payment: ''
    };
    preview: string | null;
    formErrors: FormErrors = {};

    //формирует каталог продуктов, инициализирует событие изменения каталога
    setCatalog (items: IProductItem[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    //очищает корзину
    clearBasket () {

    }

    //очищает данные заказа
    clearOrder () {

    }

    //предпросмотр продукта и событие об изменении предпросмотра
    setPreview (item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    //добавляет товар в корзину
    addToBasket(item: ProductItem) {
		this.basket.push(item);
    }

    //удаляет товар из корзины
    removeFromBasket () {

    }

    //проверяет значения данных доставки
    ValidateDelivery () {

    }

    //проверяет значения данных контактов
    ValidateContact () {

    }

    //формирует данные доставки, валидирует и  инициализирует событие о готовности
    setDeliveryField () {

    }

    //формирует данные контактов доставки, валидирует и  инициализирует событие о готовности
    setContactField () {

    }

    //считает сумму заказа
    getTotal () {

    }
}
