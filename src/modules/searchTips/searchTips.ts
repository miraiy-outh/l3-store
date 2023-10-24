import { Component } from '../component';
import html from './searchTips.tpl.html';

class SearchTips extends Component {
    tips = ['чехол iphone 13 pro', 'коляски agex', 'яндекс станция 2'];

    async render() {
        const buttonsText = document.querySelectorAll('.search-tips__button__text');
        let i = 0;
        buttonsText.forEach((buttonText) => {
            buttonText.textContent = this.tips[i];
            i++;
        })
    }
}

export const searchTipsComp = new SearchTips(html);