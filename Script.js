const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

function makeGETRequest(url, callback) {
    let xhr;

    p = new Promise((resolve, reject) => {
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        };

        xhr.open('GET', url, true);
        xhr.send();
        resolve();
    });

    p.then(() => {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.responseText);
            };
        }
    });
};


class GoodsItem {
    constructor(good) {
        this.good = good;
    }

    render() {
        let data = JSON.stringify(this.good);

        return `
        <div class="good item-catalog">
            <img src="#" alt="Photo" height="120" winght="120" class="image">
            <div>
                <div><b>Наименование</b>: ${this.good.product_name}</div>
                <div><b>Цена за штуку</b>: ${this.good.price}</div>
                <button class="addToBasket-btn" data-id_product="${this.good.id_product}">Добавить в корзину</button>
            </div>
        </div>`;
    }
}


class GoodsList {
    _cart = new Cart;

    constructor() {
        this.goods = [];
        this.goodsListBlock = null;
    }

    init() {
        this.goodsListBlock = document.querySelector('.catalog');

        this.render(this.goods);
        this.addEventHandler();
        this.filterListGoods();
        this._cart.init();
    }

    fetchGoods(cb) {
        makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            cb();
        });
    }

    render(goods) {         // Получает аргумент тип: Список (Массив)
        this.goodsListBlock.innerHTML = '';     // Очистка поля показа товаров
        if (goods.length > 0) {
            goods.forEach(good => {
                const goodItem = new GoodsItem(good);
                this.goodsListBlock.insertAdjacentHTML('beforeend', goodItem.render());
            });
        } else {
            pass; // Товаров нет/ Каталог пуст
        }
    }

    addEventHandler() {
        this.goodsListBlock.addEventListener('click', event => {
            this.addToBasket(event);
            this._cart.render(this._cart.basketList);     // Прорисовка корзины
        });
    }

    addToBasket(event) {
        if (!event.target.classList.contains('addToBasket-btn')) return;
        // event.target         -- Объект на котором произошло событие
        // classList.contains   -- Есть ли у объекта элемент класса

        const id_product = +event.target.dataset.id_product;
        const newProduct = this.goods.find((good) => good.id_product === id_product);
        this._cart.basketList.addToBasket(newProduct);
        // 
    }

    searchGoods(value) {
        const regexp = new RegExp(value, 'i');
        return this.goods.filter(good => regexp.test(good.product_name));
    }

    filterListGoods() {
        let goodsList = [];
        const searchButton = document.querySelector('.search-button');
        const searchInput = document.querySelector('.search-input');
        searchButton.addEventListener('click', (e) => {
            const value = searchInput.value;
            goodsList = this.searchGoods(value);
            if (goodsList.length > 0) {
                this.render(goodsList);
            };
            this.goodsListBlock.insertAdjacentHTML('beforeend', '<button class="clear-search">очистить поиск</button>');
        });
    }
}


class BasketList {          // Список товаров[{}]
    constructor() {
        this.goods = [];
    }

    addToBasket(good) {
        // Проверка на наличие товара в корзине
        let indexProduct = this.goods.findIndex(item => item.product_name === good.product_name);

        if (indexProduct !== -1) {
            this.goods[indexProduct].quantity += 1; // Изменение количества
        } else {
            good.quantity = 1;                      // Создаем количество
            this.goods.push(good);                 // Запись товара в лист
        };
    }

    removeFromBasket(good) {
        let indexProduct = this.goods.findIndex(item => item.product_name === good.product_name);

        if ((this.goods[indexProduct].quantity -= 1) === 0) {
            this.goods.splice(indexProduct, 1);
        };
    }

    countBasketPrice() {
        return this.goods.reduce((sum, good) => sum += good.price * good.quantity, 0);
    }

    countGoodsBasket() {
        return this.goods.reduce((sum, good) => sum += good.quantity, 0);
    }

    clearBasketList() {
        this.goods = [];
    }
}

class Cart {
    constructor() {
        this.basketList = null;
        this.cartListBlock = null;
        this.cartButton = null;
    }

    init() {
        this.cartListBlock = document.querySelector('.cart-list');
        this.cartButton = document.querySelector('.cart-btn');
        this.cartButton.addEventListener('click', () => this.clearCart());
        this.basketList = new BasketList();

        this.render(this.basketList);
    }

    displayBlock(good) {
        return `<div class="good">
                <div><b>Наименование</b>: ${good.product_name}</div>
                <div><b>Цена за штуку</b>: ${good.price}</div>
                <div><b>Количество</b>: ${good.quantity}</div>
                <div><b>Стоимость</b>: ${good.price * good.quantity}</div>
                <button class="del-good-btn" data-id_product="${good.id_product}">Удалить</button>
            </div>`;
    }

    render(basketList) {
        this.cartListBlock.innerHTML = '';   // очищаем карточку и заполняем заново:
        if (basketList.goods.length) {
            basketList.goods.forEach(item => {
                this.cartListBlock.insertAdjacentHTML('beforeend', this.displayBlock(item));
            });
            this.cartListBlock.insertAdjacentHTML(
                'beforeend', `<div class="rezume">
                    В корзине ${basketList.countGoodsBasket()} товар(ов) 
                    стоимостью ${basketList.countBasketPrice()}
                </div>`);
            this.removeEventHandler();
        } else {
            this.cartListBlock.textContent = 'Корзина пуста';
        };
    }

    removeEventHandler() {
        const btnDelete = document.querySelectorAll('.del-good-btn');

        btnDelete.forEach(btn => {
            btn.addEventListener('click', (event) => this.removeFromBasket(event));
        });
    }

    removeFromBasket(event) {
        const id = +event.target.dataset.id_product;
        const changeProduct = this.basketList.goods.find((good) => good.id_product === id);
        this.basketList.removeFromBasket(changeProduct);
        this.render(this.basketList);
    }

    clearCart() {        // Очистка корзины
        this.basketList.clearBasketList();
        this.render(this.basketList);
    }
}


const list = new GoodsList;

list.fetchGoods(() => {
    list.init();
});
