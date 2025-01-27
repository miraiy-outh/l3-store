import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice, isEmptyObject } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoriteService } from '../../services/favorite.service';
import { eventService } from '../../services/event.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));
    const userId = sessionStorage.getItem("userId");

    const productResp = await fetch(`/api/getProduct?id=${productId}`, {
      headers: {
        'x-userid': userId ?? ''
      }
    });
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFav.onclick = this._addToFavorite.bind(this);

    const isInCart = await cartService.isInCart(this.product);
    const isInFavorite = await favoriteService.isInFavorite(this.product);

    if (isInCart) this._setInCart();
    if (isInFavorite) this._setInFavorite();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey: string) => {
        this.view.secretKey.setAttribute('content', secretKey);
        if (!this.product) return;

        const isEmptyLog = isEmptyObject(this.product.log);
        eventService.sendEvent({
          type: isEmptyLog ? 'viewCard' : 'viewCardPromo',
          payload: {
            ...this.product,
            secretKey
          }
        });
      });

    fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': userId ?? ''
      }
    })
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    eventService.sendEvent({
      type: 'addToCard',
      payload: this.product
    });

    this._setInCart();
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  private _addToFavorite() {
    if (!this.product) return;
    favoriteService.addProduct(this.product);
    this._setInFavorite();
  }

  private _setInFavorite() {
    this.view.heart.classList.add('hidden');
    this.view.heartFilled.classList.remove('hidden');
    this.view.btnFav.disabled = true;
  }
}

export const productDetailComp = new ProductDetail(html);
