const popupTpl = require('./popup.hbs');

const init = () => {
    const balloonLayout = ymaps.templateLayoutFactory.createClass(popupTpl(), {
        build: function () {
            balloonLayout.superclass.build.call(this);
            console.log('BUILD!!!');
            const closeButton = document.querySelector('.popup__close');

            closeButton.addEventListener('click', () => {
                this.closeBalloon();
            });

            const save = document.querySelector('.add-review');

            let reviewArray = [];

            save.addEventListener('click',function (e) {
                e.preventDefault();
                const name = document.getElementById('review-name');
                const place = document.getElementById('review-place');
                const review = document.getElementById('review');

                var reviewObj = {
                    name: name.value,
                    place: place.value,
                    text: review.value
                };
                reviewArray.push(reviewObj);

                var serialObj = JSON.stringify(reviewArray);

                localStorage.setItem(stringCoords, serialObj);
                // var returnObj = JSON.parse(localStorage.getItem(stringCoords)); // парсинг обратно в объект

                var myPlacemark = new ymaps.Placemark(coords, {
                    address: result,
                    reviews: reviewArray
                });

                myMap.geoObjects.add(myPlacemark);

            });
        },
        clear: function () {
            console.log('CLEAR!!!');
            balloonLayout.superclass.clear.call(this);
        },
        closeBalloon: function () {
            this.events.fire('userclose');
        }
    });

    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 13,
        controls: ['zoomControl', 'fullscreenControl']
    }, { balloonLayout });

    let stringCoords;
    let coords;
    let result;

    myMap.events.add('click', e => {
        coords = e.get('coords');
        stringCoords = coords.join(', ');

        ymaps.geocode(coords).then(function (res) {
            let firstGeoObject = res.geoObjects.get(0);

            result = [
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
                firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() :
                    firstGeoObject.getAdministrativeAreas(),
                firstGeoObject.getPremiseNumber()
            ].filter(Boolean).join(', ');

            myMap.balloon.open(coords, {
                properties: {
                    address: result
                }
            });
        });
    });

    // var myPlacemark = new ymaps.Placemark([55.76, 37.64], {
    //     address: 'Some address point',
    //     reviews: [
    //         { name: 'Name 1', text: 'Text 1' },
    //         { name: 'Name 2', text: 'Text 2' },
    //         { name: 'Name 3', text: 'Text 3' }
    //     ]
    // });
    //
    // myMap.geoObjects.add(myPlacemark);
};

export default init;

