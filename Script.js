class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
    render() {
        return `
        <div class="good item-catalog">
            <img src="#" alt="Photo" height="120" winght="120" class="image">
            <div>
                <div><b>Наименование</b>: ${this.title}</div>
                <div><b>Цена за штуку</b>: ${this.price}</div>
            </div>
        </div>`;
        // return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 },
        ];
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.catalog').innerHTML = listHtml;
    }

    renderGoodsList() {
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            document.querySelector('.catalog').insertAdjacentHTML('beforeend', goodItem.render());
        });
    }

    totalSum() {
        return this.goods.reduce((sum, good) => sum += good.price, 0);
    }
}

class basket {
    constructor() {
        this.good = [];
    }

    render() { }
    addToBasket() { }        // Добавление товара в корзину
    clearBasket() { }        // Очистка корзины
    countGoodsBasket() { }   // Количество товаров в корзине
    countBasketPrice() { }   // Стоимость товаровв корзине

    init() { }              // Иницализация корзины
}

const list = new GoodsList();
list.fetchGoods();
// list.render();
list.renderGoodsList();
let a = list.totalSum();
console.log(a);
