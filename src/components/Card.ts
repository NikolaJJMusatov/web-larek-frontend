import {Component} from "./base/Component";
import {IProductItem} from "../types";
import {ensureElement, formatNumber} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface ICardView extends IProductItem {
    buttonTitle?: string;
}

export class Card extends Component<ICardView> {
    protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;
    protected _buttonTitle: string;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (value == "софт-скил") {
            this.toggleClass(this._category, "card__category_soft");
        }
        else if (value == 'другое') {
            this.toggleClass(this._category, "card__category_other");
        }
        else if (value == 'дополнительное') {
            this.toggleClass(this._category, "card__category_additional");
        }
        else if (value == 'кнопка') {
            this.toggleClass(this._category, "card__category_button");
        }
        else if (value == 'хард-скил') {
            this.toggleClass(this._category, "card__category_hard");
        }
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            this.disablePriceButton ();
        }
        else {
            this.setText(this._price, formatNumber(value) + ' синапсов')
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    //проверяет цену и делает кнопку покупки неактивной если цена не указана
    disablePriceButton () {
        this.setDisabled(this._button, true);
    }

    set buttonTitle (value: string) {
        this.setText(this._button, value);
    }
};





