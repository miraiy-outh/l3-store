import { Component } from '../component';
import html from './catalog.tpl.html';

import { ProductList } from '../productList/productList';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const userId = sessionStorage.getItem("userId");
    const productsResp = await fetch('/api/getProducts', {
      headers: {
        'x-userid': userId ?? ''
      }
    });
    const products = await productsResp.json();
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
