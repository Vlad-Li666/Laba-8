// Селекторы кнопки и области, в которой перемещаются блоки
const $btn = document.querySelector('#add-btn');
const $area = document.querySelector('.area');

// Размеры области
const areaWidth = $area.offsetWidth;
const areaHeight = $area.offsetHeight;

// Размеры блока
const boxWidth = 200;
const boxHeight = 200;

// Массив
let boxes = [];
// Ивент на нажатие мышки
let action = false;
// Выбранный блок
let $selectedBox = null;
// Индекс выбранного блока
let selectedBoxIndex = null;

let startCoords = {
    x: 0,
    y: 0
}
let currentCoords = {
    x: 0,
    y: 0
}
let distance = {
    x: 0,
    y: 0
}

if (!!localStorage.getItem('boxesCache')) {
    boxes = JSON.parse(localStorage.getItem('boxesCache'));
    boxGenerator(boxes);
}

// Запись template в html документ
function boxGenerator(list) {
    let template = '';
    for (let i = 0; i < list.length; i++) {
        template += '<div class="box" data-index="' + i + '" style="transform: translate(' + list[i].x + 'px, ' + list[i].y + 'px)"><textarea style="resize: none;" rows="7" cols="24" data-index="' + i + '"> ' + list[i].text + '</textarea></div>';
    }
    $area.innerHTML = template;
}

// Перемещение блока
function boxController(coords) {
    $selectedBox.style.cssText = 'transform: translate(' + coords.x + 'px, ' + coords.y + 'px)';
}

$area.addEventListener('mousedown', function(e) {
    if (!!e.target.classList.contains('box')) {
        action = true;
        $selectedBox = e.target;
        selectedBoxIndex = parseFloat($selectedBox.getAttribute('data-index'));

        startCoords.x = e.clientX;
        startCoords.y = e.clientY;
    }

});

$area.addEventListener('mouseup', function(e) {
    if (!e.target.classList.contains('add-btn')) {
        action = false;
        // Запись координат в массив
        boxes[selectedBoxIndex].x = distance.x;
        boxes[selectedBoxIndex].y = distance.y;
        localStorage.setItem('boxesCache', JSON.stringify(boxes));
    }
});

$area.addEventListener('mousemove', function(e) {
    if (action) {
        currentCoords.x = e.clientX;
        currentCoords.y = e.clientY;

        // Расчет дистанции
        distance.x = boxes[selectedBoxIndex].x + (currentCoords.x - startCoords.x);
        distance.y = boxes[selectedBoxIndex].y + (currentCoords.y - startCoords.y);

        // Граница для передвижения блока
        if (distance.x >= (areaWidth - boxWidth)) distance.x = areaWidth - boxWidth;
        if (distance.x <= 0) distance.x = 0;

        if (distance.y >= (areaHeight - boxHeight)) distance.y = areaHeight - boxHeight;
        if (distance.y <= 0) distance.y = 0;

        boxController(distance);
    }
});

$btn.addEventListener('click', function() {
    // Создание нового элемента массива
    if (!!boxes.length) {
        boxes.push({
            x: 0,
            y: 0,
            text: "Заметка №" + (boxes.length + 1)
        })
    } else {
        boxes = [{
            x: 0,
            y: 0,
            text: "Заметка №" + (boxes.length + 1)
        }];
    }
    boxGenerator(boxes);
});

$area.addEventListener('input', function(e) {
    // Выбор объекта
    $selectedBox = e.target;
    let sBoxIndex = parseFloat($selectedBox.getAttribute('data-index'));
    // Запись данных в массив
    boxes[sBoxIndex] = {
        x: boxes[sBoxIndex].x,
        y: boxes[sBoxIndex].y,
        text: $selectedBox.value
    };
    localStorage.setItem('boxesCache', JSON.stringify(boxes));
});