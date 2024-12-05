import { Component } from '../base/Component';
import { ensureElement, createElement, formatNumber } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('addressForm:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this.toggleButton(true);
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, formatNumber(total) + ' синапсов');
	}

	get total(): number {
		return Number(this._total.textContent.replace(/[^0-9]/g, ''));
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}

//тип данных для отображения содержимого корзины c товарами
interface IitemProductBasket {
	index: number;
	title: string;
	price: number;
}

interface IitemProductBasketAction {
	onClick: (event: MouseEvent) => void;
}

export class itemProductBasket extends Component<IitemProductBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IitemProductBasketAction
	) {
		super(container);

		this._index = container.querySelector('.basket__item-index');
		this._title = container.querySelector(`.${blockName}__title`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		this._price.textContent = formatNumber(value) + ' синапсов';
	}
}
