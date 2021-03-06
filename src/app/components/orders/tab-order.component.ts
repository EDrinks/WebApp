import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Product } from '../../services/model/Product';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../services/model/Order';
import { Tab } from '../../services/model/Tab';
import * as moment from 'moment';

@Component({
  selector: 'app-tab-order',
  templateUrl: './tab-order.component.html',
  styleUrls: ['./tab-order.component.scss']
})
export class TabOrderComponent implements OnInit {
  noProductsFound = false;

  tabId: string;
  tab: Tab;
  products: Product[] = [];
  selectedProduct: Product;
  productsLoading = false;
  productsError = '';

  loadingOrders = false;
  loadingOrdersError = '';

  deletingOrder = false;
  deletingOrderError = '';

  orders: Order[] = [];
  creatingOrder = false;
  creatingOrderError = '';

  orderButtons = [1, 2, 3, 4, 5];
  productIdToName = {};
  dateFormat = '';

  constructor(private service: BackendService, private activeRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.loadProducts();

    this.activeRoute.params.subscribe((params) => {
      this.tabId = params['id'];
      this.loadOrders();
      this.loadTab();
    });
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  orderProduct(quantity: number) {
    this.creatingOrder = true;
    this.creatingOrderError = '';

    this.service.createOrder(this.tabId, this.selectedProduct.id, quantity)
      .pipe(finalize(() => {
        this.creatingOrder = false;
      }))
      .subscribe(() => {
        this.loadOrders();
      }, (error) => {
        this.creatingOrderError = error;
      });
  }

  getSelectedProductCount() {
    return this.orders
      .filter((order) => {
        return order.productId === this.selectedProduct.id;
      })
      .reduce((prev, cur) => {
        return prev + cur.quantity;
      }, 0);
  }

  getSelectedProductSum() {
    return this.orders
      .filter((order) => {
        return order.productId === this.selectedProduct.id;
      })
      .reduce((prev, cur) => {
        return prev + (cur.quantity * cur.productPrice);
      }, 0);
  }

  getAllProductsCount() {
    return this.orders
      .reduce((prev, cur) => {
        return prev + cur.quantity;
      }, 0);
  }

  getAllProductsSum() {
    return this.orders
      .reduce((prev, cur) => {
        return prev + (cur.quantity * cur.productPrice);
      }, 0);
  }

  undoOrder() {
    if (this.orders.length > 0) {
      const orderId = this.orders[0].id;

      this.deletingOrder = true;
      this.deletingOrderError = '';
      this.service.deleteOrder(this.tabId, orderId)
        .pipe(finalize(() => {
          this.deletingOrder = false;
        }))
        .subscribe(() => {
          this.loadOrders();
        }, (error) => {
          this.deletingOrderError = error;
        });
    }
  }

  onSpendingCreated() {
    this.router.navigate(['/']);
  }

  private loadProducts() {
    this.productsLoading = true;

    this.service.getProducts()
      .pipe(finalize(() => {
        this.productsLoading = false;
      }))
      .subscribe((products: Product[]) => {
        this.products = products;

        if (products.length > 0) {
          this.selectProduct(products[0]);
        } else {
          this.noProductsFound = true;
        }

        this.productIdToName = this.products.reduce((prev, cur) => {
          prev[cur.id] = cur.name;
          return prev;
        }, {});
      }, (error) => {
        this.productsError = error;
      });
  }

  private loadOrders() {
    this.loadingOrders = true;
    this.loadingOrdersError = '';

    this.service.getOrders(this.tabId)
      .pipe(finalize(() => {
        this.loadingOrders = false;
      }))
      .subscribe((orders: Order[]) => {
        this.orders = orders.sort((a: Order, b: Order) => {
          if (moment(a.dateTime).isBefore(b.dateTime)) {
            return 1;
          }

          return -1;
        });
      }, (error) => {
        this.loadingOrdersError = error;
      });
  }

  private loadTab() {
    this.service.getTab(this.tabId)
      .subscribe((tab: Tab) => {
        this.tab = tab;
      });
  }
}
