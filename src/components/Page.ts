import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import {IEvents} from "./base/events";

//тип данных для отображения страницы
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    //обновляет счетчик товаров в корзине
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    //отображает каталог товаров
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    //блокирует взаимодействие со страницей при открытии модального окна
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}