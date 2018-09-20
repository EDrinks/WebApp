import { Tab } from './Tab';
import { Order } from './Order';

export class Settlement {
  id: string;
  dateTime: string;
  tabToOrders: TabToOrders[];
}

export class TabToOrders {
  tab: Tab;
  orders: Order[];
}
