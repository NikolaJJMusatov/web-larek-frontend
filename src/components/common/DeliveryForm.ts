import { IAdressForm,  } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "./Form";
import { ensureElement, ensureAllElements } from "../../utils/utils";

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
    };

    choosePayment (value: string) {
        this.events.emit('payment:change', { field: 'payment', value });
    };

}
