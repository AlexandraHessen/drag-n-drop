'use strict'
let imgArr = document.querySelectorAll('div#allImg>img'); //количество картинок неизвестно, поэтому нам надо их все найти 
window.addEventListener('load', imgPos)

function imgPos(EO) {
    EO = EO || window.event;
    for (let i = 0; i < imgArr.length; i++) {
        function getElementPos(elem) {
            var bbox = elem.getBoundingClientRect();
            return {
                left: bbox.left + window.pageXOffset,
                top: bbox.top + window.pageYOffset
            };
        }
        let imgPosObj = getElementPos(imgArr[i]); //узнаем координаты картинок

        imgArr[i].style.left = imgPosObj.left + 'px';
        imgArr[i].style.top = imgPosObj.top + 'px';
        //присваиваем картинкам их координаты, до этого было пусто, 
        //делаем для того чтобы при pos absolute соседние не съезжались а оставались на своих местах
    }
    // Если пишем imgArr[i].style.top=imgPosObj.top+'px';
    // Добавляем  к style top
    // Если пишем imgArr[i].setAttribute("style", " top: ${imgPosObj.top}px;");
    // То все содержимое style удаляется и меняется на последнее

    for (let i = 0; i < imgArr.length; i++) {
        imgArr[i].style.position = 'absolute';
        //вместе с координатами не получится присвоить все съезжаются в один левый угол
        let img = imgArr[i];
        img.addEventListener('mouseover', function () {
            img.style.cursor = 'pointer'
        });
        img.addEventListener('mousedown', mousedownFunc);

        function mousedownFunc(EO) {
            EO = EO || window.event;
            EO.preventDefault(); //отменяем умолчательные действия браузера на событие, т.к. у нас свои, чтобы они не двоились                    
            document.getElementById('allImg').appendChild(img) //вместо zIndex чтобы выбранная картинка каждый раз была впереди //document.body.append(img)  с learn js    
            let shiftX = EO.pageX - img.offsetLeft;
            let shiftY = EO.pageY - img.offsetTop;

            img.addEventListener('mouseup', mouseupFunc);
            window.addEventListener('mousemove', mousemoveFunc);

            function mouseupFunc(EO) {
                EO = EO || window.event;
                EO.preventDefault();
                window.removeEventListener('mousemove', mousemoveFunc);
                img.removeEventListener('mouseup', mouseupFunc);
                //удаляем обработчик mouseup в конце перетаскивания, 
                //если не удалить обработчик будет постоянно висеть на картинке и накапливаться
            }

            function mousemoveFunc(EO) {
                EO = EO || window.event;
                EO.preventDefault();
                img.style.left = (EO.pageX - shiftX) + "px";
                img.style.top = (EO.pageY - shiftY) + "px";
            }
        }
    }
}

//         Картинки изначально неспозиционированы, без absolute left top, количество картинок неизвестно. 
// Поэтому нам надо 
// 1.	Их все найти document.querySelectorAll('div#allImg>img')
// 2.	Ставим обработчик события window.addEventListener('load', )
// Именно load не DOMContentLoaded (именно в этом случае нам нужен load хотя DOM рекомендуется) т.к. нам нужно прочитать координаты pageXOffset картинок получается, что в момент загрузки страницы координаты равны 0, т.к. картинки еще не загружены, а скрипт уже работает, поэтому нам надо поставить обработчик события после загрузки картинок, т.е. именно load
// 3.	Узнаем начальные координаты картинок через func getElementPos через pageXOffset. Т.к. у них нет left и top но на странице они расположены
// 4.	Сами присваиваем картинкам их же left и top через .style.left= getElementPos().left +'px'; (т.к. до этого было пусто)
// 5.	Еще нам для того чтобы позиционировать картинки нужно задать им position absolute
// Сразу сделать это в цикле, когда задаем координаты не получится, т.к. первой картинке задали pos absolute и вторая сразу же прыгает в координату 0 0 т.к. первая уже выпала и не занимает место в HTML странице, поэтому нам надо отдельным циклом присвоить картинкам pos absolute (вариант 2: первым циклом запомнить начальные координаты в массиве, а вторым расставлять; вариант 3: сделать цикл справа налево)

// Это было работа с картинками далее действия с событиями
// Всегда отменяем умолчательные действия браузера на событие, т.к. у нас свои, чтобы они не двоились
// 1.	По .addEventListener('mousedown')
// Запоминаем на какое место картинки нажал пользователь, чтобы потом переместить картинку эти же местом))
// 2.	По window .addEventListener(' mousemove')
// ПОДПИСЫВАЕМ ИМЕННО WINDOW не картинку и не document (т.к. если у нас все картинки pos absolute, наш div body будет равен нулю и мы не сможет перетаскивать)
// Постоянно меняем начальные координаты картинки на координаты перетаскивания с учетом точки на которую нажали 
// img.style.left=(EO.pageX-shiftX)+"px";
// 3.	По .addEventListener(‘mouseup'')
// Снимаем обработчик mousemove
// Снимаем обработчик mouseup 
// удаляем обработчик mouseup в конце перетаскивания, 
//  если не удалить обработчик будет постоянно висеть на картинке и накапливаться


// Для того чтобы перетаскиваемая картинка каждый раз была впереди
// div.appendChild(img) просто всегда ставим последним в конец кода и => сам ближним к глазам
// //document.body.append(img) с learn js
// (вариант 2: zIndex который каждый раз надо увеличивать!!!! на 1 при перетаскивании) 