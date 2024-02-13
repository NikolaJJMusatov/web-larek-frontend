# Проектная работа "Веб-ларек"
Проект представляет из себя страницу интернет-магазина, в котором представлены товары для веб-разработчиков.
В нем можно посмотреть представленный каталог товаров, добавить в корзину и оформить из нее заказ.

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
# тип данных по запросу от сервера

```
type ApiListResponse<Type> = {
    total: number
    items: Type[]
};
```

# тип методов запроса на сервер

```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

# тип событий

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

# тип данных товара

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

# состояние страницы

```
interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}
```

# данные из формы доставки и метода оплаты

```
interface IAdressForm {
    payment: string;
    adress: string;
}
```

# данные из формы контактов

```
interface IContactsForm  {
    email: string;
    phone: string;
}
```

# данные заказа

```
interface IOrder extends IAdressForm, IContactsForm {
    items: string[];
    total: number;
}
```

# данные заказа на отправку серверу

```
interface IOrderResult {
    id: string;
    total: number;
}
```

# данные ошибки ввода форм

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

# тип данных для отображения страницы

```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

# тип данных клика карточки

```
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```

# тип данных для отображения содержимого корзины

```
interface IBasketView {
    items: HTMLElement[];
    total: number;
}
```

# тип данных отображения успешной покупки

```
interface ISuccess {
    total: number;
}
```

# тип данных валидации формы

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

# тип данных для контента внутри модальных окон

```
interface IModalData {
    content: HTMLElement;
}
```
## Модель данных.
# Класс API
(осуществляет HTTP-запросы)
```
constructor(baseUrl: string, options: RequestInit = {})
```
методы:
- handleResponse (возвращает Json-ответ или сообщение об ошибке)
- get (запрос на сервер методом “Get”)
- post (запрос на сервер методом “Post”)
