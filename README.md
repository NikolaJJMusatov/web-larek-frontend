# Проектная работа "Веб-ларек"
Проект представляет из себя страницу интернет-магазина, в котором представлены товары для веб-разработчиков.
В нем можно посмотреть представленный каталог товаров, добавить в корзину и оформить из нее заказ.

При проектировании использовался шаблон Model-View-Presenter. Взаимодействие компонентов осуществляет брокер событий.
В роли презентера выступает код описанный в основном скрипте приложения.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание данных.
### тип данных по запросу от сервера

```
type ApiListResponse<Type> = {
    total: number
    items: Type[]
};
```

### тип методов запроса на сервер

```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

### тип событий

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

### тип данных товара

```
interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number|null;
}
```

### состояние страницы

```
interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    order: IOrder | null;
}
```

### данные из формы доставки и метода оплаты

```
interface IAdressForm {
    payment: string;
    adress: string;
}
```

### данные из формы контактов

```
interface IContactsForm  {
    email: string;
    phone: string;
}
```

### данные заказа

```
interface IOrder extends IAdressForm, IContactsForm {
    items: string[];
    total: number;
}
```

### данные заказа на отправку серверу

```
interface IOrderResult {
    id: string;
    total: number;
}
```

### данные ошибки ввода форм

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

### тип данных для отображения страницы

```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

### тип данных клика карточки

```
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```

### тип данных для отображения содержимого корзины

```
interface IBasketView {
    items: HTMLElement[];
    total: number;
}
```

### тип данных отображения успешной покупки

```
interface ISuccess {
    total: number;
}
```

### тип данных валидации формы

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

### тип данных для контента внутри модальных окон

```
interface IModalData {
    content: HTMLElement;
}
```
## Модель данных.
### Класс API
(осуществляет HTTP-запросы)
```
constructor(baseUrl: string, options: RequestInit = {})
```
методы:
- handleResponse (возвращает Json-ответ или сообщение об ошибке)
- get (запрос на сервер методом “Get”)
- post (запрос на сервер методом “Post”)

### Класс ProductsApi наследуется от Api
(осуществляет функциональность для получения списка продуктов, свойств)
свойства – URL изображения продукта, базовый URL, параметры запросов 
```
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```
методы: 
- getProductList (получение списка всех продуктов)
- getProductItem (получение конкретной информации по продукту)
- orderProducts (отправка заказа на сервер)

### Класс EventEmitter
(реализует событийно-ориентированную архитектуру проекта: осуществляет взаимодействие частей приложения)
свойства – список событий

методы:
- оn (установить обработчик на событие);
- off (снять обработчик на событие);
- emit (инициировать события с данными)
- onAll (установить обработчик на все события)
- offAll (снять все обработчики)
- trigger (сделать коллбек триггер, генерирующий событие при вызове)

### Класс Model
(класс для создания модельных данных)
```
constructor(data: Partial <T>, events: IEvents) //принимает данные и объект событий
```
методы:
- emitChanges (сообщить всем что модель поменялась)

### Класс AppState наследуется от Model
(модель состояния страницы)
свойства:
- catalog (массив товаров)
- basket (массив товаров в корзине)
- order (объект данных о заказе)
- formErrors (объект с ошибками форм)

методы:
- setCatalog (формирует каталог продуктов, инициализирует событие изменения каталога)
- clearBasket (очищает корзину)
- clearOrder (очищает данные заказа)
- addToBasket (добавляет товар в корзину)
- updateBasket (эмитеры на измененения в корзине)
- findInBasket (поиск продукта в корзине)
- removeFromBasket (удаляет товар из корзины)
- validateDelivery (проверяет значения данных доставки)
- validateContact (проверяет значения данных контактов)
- setDeliveryField (формирует данные доставки, валидирует и  инициализирует событие о готовности)
- setContactField (формирует данные контактов доставки, валидирует и  инициализирует событие о готовности)
- setTotal (устанавливает сумму заказа)
- getTotal (считает сумму заказа)
- setItems (устанавливается товары в заказ)
- setPayment (устанавливает метод оплаты в заказ)

### Класс Component
(используется при создании элементов в слое отображения)
свойство - корневой DOM-элемент
```
constructor(container: HTMLElement)
```
методы:
- toggleClass (переключить класс)
- setText (установить текстовое содержимое)
- setDisabled (сменить статус блокировки)
- setHidden (скрыть)
- setVisible (показать)
- setImage (установить изображение с алтернативным текстом)
- render (вернуть корневой DOM-элемент)

### Класс Page наследуется от Component
(класс для отрисовки страницы проекта)
```
constructor(container: HTMLElement, events: IEvents) /*Инициализирует элементы страницы и назначает обработчики событий*/
```
методы:
- set counter (обновляет счетчик товаров в корзине)
- set catalog (отображает каталог товаров)
- set locked (блокирует взаимодействие со страницей при открытии модального окна)

### Общий Класс Modal наследуется от Component
(используется для отображения и управления модальными окнами)
```
constructor(container: HTMLElement, events: IEvents)
```
методы:
- set content (устанавливает содержимое модального окна)
- open  (открывает модального окно и вызывает событие открытия)
- close (закрывает модальное окно и вызывает событие закрытия окна)
- render (рендерит модальное окно и открывает его)

### Класс Card наследуется от Component
(используется для отображения карточки товара)
```
constructor(blockName: string, container: HTMLElement, actions?: ICardActions) /*Инициализирует элементы карточки и устанавливает обработчики событий для кнопки*/
```
методы:
- set/get id (управляет идентификатором карточки)
- set/get title (управляет названием товара)
- set image (устанавливает изображение товара)
- set description (устанавливает описание товара)
- set/get category (установить класс на категорию товара /получить наименование категории)
- set price (управляет ценой товара)
- set buttonTitle (управляет текстом на кнопке карточки)
- disablePriceButton (проверяет цену и делает кнопку покупки неактивной если цена не указана)

### Класс Basket наследуется от Component
(используется для отображение корзины, управляет товарам, общей стоимостью)
```
constructor(container: HTMLElement, events: EventEmitter) /*инициализирует элементы управления корзины и подписывается на события*/
```
методы:
- set items (устанавливает товары в корзине)
- set/get total (устанавливает и отображает общую стоимость товаров в корзине)
- toggleButton (управляет кнопкой оформления заказа в корзине)

### Класс itemProductBasket наследуется от Component
(используется для экземпляра товара в корзине)
```
constructor(protected blockName: string, container: HTMLElement, actions?: IitemProductBasketAction)
```
методы:
- set index (устанавливает порядковый номер товара в корзине)
- set title (устанавливает название товара в корзине)
- set price (устанавливает стоимость товара в корзине)

### Общий Класс Form наследуется от Component
(используется для отображения и управления формами)
```
constructor(container: HTMLFormElement, events: IEvents)
```
методы:
- onInputChange (обработчик полей форм)
- set valid (управляет кнопкой отправки формы в зависимости от валидации)
- set errors (устанавливает ошибки валидации формы)
- render (рендерит форму)

### Класс DeliveryForm наследуется от Form
(используется для отображения и управления формой с выбором способа оплаты и адреса доставки)
```
constructor(container: HTMLFormElement, events: IEvents, actions?: IFormActions) 
```
методы:
- set address (устанавливает адрес доставки)
- clearClassButtons (сбрасывает активный класс кнопок оплаты)
- choosePayment (управляет методом оплаты товара)

### Класс ContactForm наследуется от Form
(используется для отображения и управления формой ввода email и телефона)
```
constructor(container: HTMLFormElement, events: IEvents) 
```
методы:
- set email (устанавливает адрес электронной почты)
- set phone (устанавливает номер телефона)

### Класс Success наследуется от Component
(используется для отображения сообщения об успешном оформлении заказа)
```
constructor(container: HTMLElement, actions?: ISuccessActions)
```
методы:
- set total (устанавливает стоимость покупки)

## Описание событий.
- modal:open (открытие модального окна)
- modal:close (закрытие модального окна)
- items:changed (изменение товаров в каталоге)
- card:select (выбрана карточка товара)
- basket:open (открытие корзины)
- basket:changed (изменение корзины)
- counter:changed (изменение счетчика товаров корзины)
- addressForm:open (открыть форму способа оплаты и адреса доставки)
- order:submit (отпрыть форму контактов)
- contacts:submit (отправка формы всего заказа)
- formErrorsDelivery:change (изменение валидации доставки)
- formErrorsContacts:change (изменение валидации контактов)

[Ссылка на репозиторий Git](https://github.com/NikolaJJMusatov/web-larek-frontend.git)
