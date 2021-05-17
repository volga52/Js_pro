const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

const blockCatalog = (title, price) => {
    return `
    <div class="good item-catalog">
        <img src="#" alt="Photo" height="120" winght="120" class="image">
        <div>
            <div><b>Наименование</b>: ${title}</div>
            <div><b>Цена за штуку</b>: ${price}</div>
        </div>
    </div>`;
};

const renderGoodsList = (list) => {
    list.forEach(good => {
        document.querySelector('.catalog').insertAdjacentHTML('beforeend',
            blockCatalog(good.title, good.price))
    });
};

renderGoodsList(goods);
