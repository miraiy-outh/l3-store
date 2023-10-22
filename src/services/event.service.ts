import { ProductData } from 'types';

type RoutePayload = {
    url: string
};

type PurchasePayload = {
    orderId: number | string,
    totalPrice: number,
    productIds: Array<number>
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

    public async sendEvent(data: EventData) {
        const currentDate = Date.now();
        const requestData: EventRequestData = {
            ...data,
            timestamp: currentDate
        }
        fetch('./api/sendEvent', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
    }
}

export const eventService = new EventService();