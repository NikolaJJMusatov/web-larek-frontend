import './scss/styles.scss';

import { ProductsApi } from "./components/common/ProductsApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { AppState, CatalogChangeEvent } from "./components/AppData";
import { IProductItem } from './types';
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { Modal } from "./components/common/Modal";
import { Basket, itemProductBasket } from "./components/common/Basket";
import { DeliveryForm } from './components/common/DeliveryForm';
import { ContactForm } from './components/common/ContactForm';

import {Success} from './components/common/Success';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {IAdressForm, IContactsForm} from './types';

const events = new EventEmitter();
const api = new ProductsApi(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const addressFormTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(addressFormTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsFormTemplate), events);

// Получаем каталог товаров с сервера в модель
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });

        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

// Открыть продукт
events.on('card:select', (item: IProductItem) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
			card.buttonTitle = appData.findInBasket(item)? 'В корзину' : 'Удалить из корзины';

            if (!appData.findInBasket(item)) {
                appData.addToBasket(item);
            } else {
                appData.removeFromBasket(item);
            };
		}
	});
    
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price,
            buttonTitle: appData.findInBasket(item)? 'Удалить из корзины' : 'В корзину',
        })
    })
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

//счетчик корзины
events.on('counter:changed', () => {
    page.counter = appData.basket.length;
})

//изменение корзины
events.on('basket:changed', () => {
    page.counter = appData.basket.length;
	basket.items = appData.basket.map((item, index) => {
		const itemProduct = new itemProductBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeFromBasket(item);
            }
		});

		return itemProduct.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});

    if (appData.basket.length > 0) {
		basket.toggleButton(false);
	} else {
		basket.toggleButton(true);
	};

    basket.total = appData.getTotal();

    const itemsId = appData.basket.map((item) => item.id);
    appData.setItems(itemsId);
});

//открыть форму способа оплаты и адреса доставки
events.on('addressForm:open', () => {
	if (appData.basket.length > 0) {
		modal.render({
			content: delivery.render({
				address: (appData.order.address)? appData.order.address : '',
				valid: false,
				errors: [],
			}),
		});
	}

    delivery.clearClassButtons();
});

//открыть форму контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: (appData.order.phone)? appData.order.phone : '',
			email: (appData.order.email)? appData.order.email : '',
			valid: false,
			errors: [],
		}),
	});
});

//отправить форму всего заказа
events.on('contacts:submit', () => {
    appData.setTotal(basket.total);

    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    events.emit('items:changed');
                }
            });

            success.total = appData.order.total;

            modal.render({
                content: success.render({})
            });

            appData.clearOrder();
            appData.clearBasket();
        })

        .catch(err => {
            console.error(err);
        });
});

//изменение способа оплаты
events.on(
    'payment:change', 
    (data: { field: keyof IAdressForm; value: string }) => {
        appData.setDeliveryField(data.field, data.value);
    }
);

//изменение в полe адреса доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IAdressForm; value: string }) => {
		appData.setDeliveryField(data.field, data.value);
	}
);

//изменения в поляx контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

//Изменилась валидации формы адреса
events.on('formErrorsDelivery:change', (errors: Partial<IAdressForm>) => {
	const { address } = errors;
	delivery.valid = !address;
	delivery.errors = Object.values({ address })
		.filter((i) => !!i)
		.join(', ');
});

//Изменилась валидации формы контактов
events.on('formErrorsContacts:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(', ');
})

// блокировка прокрутки страницы если открыто модальное окно
events.on('modal:open', () => {
    page.locked = true;
});

// ... разблокировка
events.on('modal:close', () => {
    page.locked = false;
});