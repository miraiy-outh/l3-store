import { ProductData } from 'types';

type RoutePayload = {
    url: string
};

type PurchasePayload = {
    orderId: number | string,
    totalPrice: number,
    productsIds: Array<number>
}

type ViewPayload = ProductData & {
    secretKey: string
}

type EventData = {
    type: 'route' | 'viewCard' | 'viewCardPromo' | 'addToCard' | 'purchase',
    payload: RoutePayload | PurchasePayload | ViewPayload | ProductData,
};

type EventRequestData = EventData & {
    timestamp: number
}

class EventService {
    init() {

    }

    async sendEvent(data: EventRequestData) {
        fetch('./api/sendEvent', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }

    public async addToCardEvent(data: EventData) {
        const currentDate = Date.now();
        this.sendEvent({ ...data, timestamp: currentDate });
    }
}

export const eventService = new EventService();