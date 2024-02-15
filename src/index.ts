import './scss/styles.scss';

import {ProductsApi} from "./components/common/ProductsApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";

//import {IOrderForm} from "./types";

const events = new EventEmitter();
const api = new ProductsApi(CDN_URL, API_URL);


// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Получаем каталог товаров с сервера в модель
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

console.log(appData);
console.log(basket);

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



// Открыть модальное окно продукта
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});



// Изменен открытый продукт
events.on('preview:changed', (item: ProductItem) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate));
    modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description,
                category: item.category,
                price: item.price
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


// блокировка прокрутки страницы если открыто модальное окно
events.on('modal:open', () => {
    page.locked = true;
});

// ... разблокировка
events.on('modal:close', () => {
    page.locked = false;
});


// срабатывает при добавлении удалении товара в корзину
events.on('product:changed', (item: ProductItem) => {
		appData.addToBasket(item);
});


