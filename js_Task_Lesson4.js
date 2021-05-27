let text = "Lorem ipsum dolor sit 'amet' consectetur adipisicing 'elit'. Blanditiis 'quae' similique cumqu'e, providen't aspernatur sequi ipsa a amet obcaecati sint.";
let regExp = / B'|'\B/g;
// console.log(text.match(regExp));
console.log(text.replace(regExp, '"'));

let newString = text.replace(regExp, '"');
console.log(newString);
