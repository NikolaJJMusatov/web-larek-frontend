import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IAdressForm, IContactsForm } from "../../types";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);


        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
            this._submit.disabled = false;
        });
        
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    protected choosePayment (value: string) {
        this.events.emit('payment:change', { field: 'payment', value });
    };

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}

interface IFormActions {
    onClick: (button: string) => void;
}

interface IDeliveryFormView extends IAdressForm {
    paymentButtons: string[];
}

export class DeliveryForm extends Form<IDeliveryFormView> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, protected events: IEvents, actions?: IFormActions) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                if (evt.target === this._cardButton) {
                    this._cardButton.classList.add("button_alt-active");
                    this._cashButton.classList.remove("button_alt-active");
                    this.choosePayment('card')
                } if (evt.target === this._cashButton) {
                    this._cashButton.classList.add("button_alt-active");
                    this._cardButton.classList.remove("button_alt-active");
                    this.choosePayment('cash')    
                }
            });
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    };

    clearClassButtons () {
        this._paymentButtons.forEach(button => {
            button.classList.remove("button_alt-active");
        })
    }
}

export class ContactForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}