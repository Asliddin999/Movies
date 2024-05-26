const searchLink = document.querySelector('.search__link .icon-reg'),//иконка поиска
    mainContent = document.querySelector('.main__content'),//основной див, где будет инфа о фильмах
    mainClose = document.querySelectorAll('.main__close'),//кнопка для закрытия дива с инфой о фильмах
    mainBlock = document.querySelector('.main__block'),//будут выводиться результаты поиска
    moviesLink = document.querySelectorAll('.movies__link'),//чтобы показать див mainContent
    movieSolo = document.querySelector('.main__solo'), //див для вывода инфы об одном фильме
    formMain = document.querySelector('.form__main'),//форма поиска
    formInput = formMain.querySelector('input'),//поле ввода для поисковика
    anime = document.querySelector('.anime'),//прелоадер
    pagination = document.querySelector('.pagination'),//пагинация к рез поиска
    headerBtn = document.querySelector('.header__btn'),//кнопка открытия бокового меню в наве
    headerAbs = document.querySelector('.header__abs'),//темная область
    headerItems = document.querySelector('.header__items');//боковое меню

function openClose(){
    const bool = !headerBtn.classList.contains('active');
    headerBtn.classList[bool ? 'add' : 'remove']('active');
    headerAbs.classList[bool ? 'add' : 'remove']('active');
    headerItems.classList[bool ? 'add' : 'remove']('active');
    document.body.classList[bool ? 'add' : 'remove']('active');
}
//открытие и закрытие бокового меню в навигации
headerBtn.addEventListener('click', function(e){
    e.preventDefault();
    openClose();
});
headerAbs.addEventListener('click', openClose);
//открытие и закрытие дива main__content
function openMainBlock(e, bool = true){
    e.preventDefault();
    mainContent.classList[bool ? 'add' : 'remove']('active');
    document.body.classList[bool ? 'add' : 'remove']('active');
};
searchLink.addEventListener('click', openMainBlock);
moviesLink.forEach(item => item.addEventListener('click', openMainBlock));
mainClose.forEach(item => {
    item.addEventListener('click', function(e){
        openMainBlock(e, false);
    })
});

const host = 'https://kinopoiskapiunofficial.tech';
const hostName = '';
const hostValue = '';

class Kino{
    constructor(){
        this.date = new Date().getMonth();
        this.curYear = new Date().getFullYear();
        this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        this.curMonth = this.months[this.date];
    }
    fOPen = async (url) => {
        let res = await fetch(url, {
            headers: {
                [hostName]: hostValue
            }
        });
        if(res.ok) return res.json();
        else throw new Error(`Cannot access to ${url}`);
    }
    getTopMovies = (page = 1) => this.fOPen(`${host}/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`)
    getSoloFilm = (id) => this.fOPen(`${host}/api/v2.1/films/${id}`)
    getReleases = (page = 1, year = this.curYear, month = this.curMonth) => this.fOPen(`${host}/api/v2.1/films/releases?year=${year}&month=${month}&page=${page}`)
    getFrames = (id) => this.fOPen(`${host}/api/v2.2/films/${id}/images?type=STILL&page=1`)
    getReviews = (id) => this.fOPen(`${host}/api/v2.2/films/${id}/reviews?page=1&order=DATE_DESC`)
    getSearch = (page = 1, keyword) => this.fOPen(`${host}/api/v2.1/films/search-by-keyword?keyword=${keyword}&page=${page}`)
}

const db = new Kino();

const random = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

function renderTrendMovies(element = [], fn = [], films = [], params=[]){
    anime.classList.add('active');
    element.forEach((item, i) => {
        let parent = document.querySelector(`${item} .swiper-wrapper`);
        db[fn[i]](params[i]).then(data => {
            data[films[i]].forEach(elem => {
                let slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.innerHTML = `
                    <div class="movie__item" data-id="${elem.filmId}" onclick="renderSolo(${elem.filmId})">
                        <img src="${elem.posterUrlPreview}" alt="${elem.nameRu || elem.nameEn}" loading="lazy">
                    </div>
                `;
                parent.append(slide);
            });
            new Swiper(`${item}`, {
                slidesPerView: 1,
                spaceBetween: 27,
                // slidesPerGroup: 3,
                loop: true,
                // loopFillGroupWithBlank: true,
                navigation: {
                    nextEl: `${item} .swiper-button-next`,
                    prevEl: `${item} .swiper-button-prev`,
                },
                breakpoints: {
                    1440: {
                        slidesPerView: 6,
                    },
                    1200: {
                        slidesPerView: 5,
                    },
                    960: {
                        slidesPerView: 4,
                    },
                    720: {
                        slidesPerView: 3,
                    },
                    500: {
                        slidesPerView: 2,
                    },
                }
            });
        })
        .then(() => {
            let pages = 13;
            const rand = random(1, pages);
            // const movies = document.querySelectorAll('.movie__item');
            // movies.forEach(item => {
            //     item.addEventListener('click', function(e){
            //         const attr = this.getAttribute('data-id');
            //         renderSolo(attr);
            //         openMainBlock(e);
            //     })
            // })
            renderHeader(rand);
        })
        .catch(e => {
            console.log(e);
            anime.classList.remove('active');
        })
    })
}
renderTrendMovies(['.trend__tv-slider', '.popular__actors-slider'], ['getTopMovies', 'getReleases'], ['films', 'releases'], [1,1]);

const getLink = (url) => url.split('www.').join('gg');

function renderHeader(page) {
    db.getTopMovies(page).then(res => {
        anime.classList.add('active');
        const max = random(0, res.films.length - 1);
        const filmId = res.films[max].filmId;
        const filmRating = res.films[max].rating;
        db.getSoloFilm(filmId).then(response => {
            const sm = response.data;
            const headerText = document.querySelector('.header__text');
            headerText.innerHTML = `
                <h1 class="header__title">${sm.nameRu || sm.nameEn}</h1>
                <div class="header__balls">
                    <span class="header__year">${sm.year}</span>
                    <span class="logo__span header__rating  header__year ">${sm.ratingAgeLimits}+</span>
                    <div class="header__seasons header__year">${sm.seasons.length}+</div>
                    <div class="header__stars header__year"><span class="icon-solid"></span><strong>${filmRating}</strong></div>
                </div>
                <p class="header__descr">
                    ${sm.description}
                </p>
                <div class="header__buttons">
                    <a href="${getLink(sm.webUrl)}" class="header__watch"><span class="icon-solid"></span>watch</a>
                    <a href="#" class="header__more header__watch movie__item" data-id="${filmId}" onclick="renderSolo(${filmId})">More information</a>
                </div>
            `;
            anime.classList.remove('active');
        })
        .catch(e => {
            console.log(e);
            anime.classList.remove('active');
        })
    })
    .catch(e => {
        console.log(e);
        anime.classList.remove('active');
    })
}

const popularTitle = document.querySelector('.popular__actors-title strong'),
    popularYear = document.querySelector('.year'),
    popularPoster = document.querySelector('.coming__soon-block > img');

popularTitle.textContent = `${db.curMonth} ${db.curYear}`;
popularYear.textContent = db.curYear;
db.getTopMovies(2).then(data => {
    popularPoster.src = data.films[random(0, data.films.length - 1)].posterUrlPreview;
});


function renderSolo(id) {
    openMainBlock(event);
    mainBlock.innerHTML = '';
    pagination.innerHTML = '';
    anime.classList.add('active');
    (async function(){
        const [reviews, frames, solo] = await Promise.all([
            db.getReviews(id),
            db.getFrames(id),
            db.getSoloFilm(id)
        ]);
        return {reviews, frames, solo}
    }())
    .then(res => {
        const solo = res.solo.data;
        const genres = solo.genres.reduce((acc, item) => acc + `${item.genre} `, '');
        const countries = solo.countries.reduce((acc, item) => acc + `${item.country} `, '');
        let facts = '';
        let reviews = '';
        let frames = '';
        res.frames.items.forEach((item, i) => {
            if(i < 10) frames += `<img src="${item.previewUrl}" alt="" loading="lazy">`;
        });
        solo.facts.forEach((item, i) => {
            if(i < 10) facts += `<li class="solo__facts">${i+1}: ${item}</li>`;
        });
        res.reviews.items.forEach((item, i) => {
            if(i < 10) {
                reviews += `
                    <div class="review__item">
                        <span>${item.author}</span>
                        <p class="review__descr">${item.description}</p>
                    </div>
                `;
            }
        });
        const div = `
            <div class="solo__img">
                <img src="${solo.posterUrlPreview}" alt="${solo.nameRu || solo.nameEn}">
                <a href="${getLink(solo.webUrl)}" class="solo__link header__watch">Смотреть фильм</a>
            </div>
            <div class="solo__content">
                <h3 class="trend__tv-title solo__title">${solo.nameRu || solo.nameEn}</h3>
                <ul>
                    <li class="solo__countries">Страны: ${countries}</li>
                    <li class="solo__genres">Жанры: ${genres}</li>
                    <li class="solo__dur">Продолжительность: ${solo.filmLength || ''}</li>
                    <li class="solo__year">Год: ${solo.year || ''}</li>
                    <li class="solo__premiere">Мировая премьера: ${solo.premiereWorld || 'когда-то была'}</li>
                    <li class="solo__rating">Возрастной рейтинг: ${solo.ratingAgeLimits || ''}</li>
                    <li class="solo__slogan">Слоган: ${solo.slogan || 'без слогана'}</li>
                    <li class="solo__descr">Описание: ${solo.description || ''}</li>
                </ul>
            </div>
            <ul class="solo__facts">
                <h3 class="trend__tv-title">Интересеные факты</h3>
                ${facts}
            </ul>
            <h3 class="trend__tv-title solo__title2">Кадры из фильма</h3>
            <div class="solo__images">
                ${frames}
            </div>
            <div class="solo__reviews">
                <h3 class="trend__tv-title solo__title2">Отзывы</h3>
                ${reviews}
            </div>
        `;
        movieSolo.innerHTML = div;
        anime.classList.remove('active');
    })
    .catch(e => {
        console.log(e);
        anime.classList.remove('active');
    })
}

function renderCards(page = 1, se = '', fn = 'getTopMovies') {
    mainBlock.innerHTML = '';
    movieSolo.innerHTML = '';
    db[fn](page, se).then(data => {
        if(data.films.length > 0) {
            data.films.forEach(item => {
                const someItem = document.createElement('div');
                someItem.classList.add('some__item');
                someItem.innerHTML = `
                    <div class="some__img">
                        <img src="${item.posterUrlPreview}" alt="${item.nameRu || item.nameEn}" loading="lazy">
                        <span class="some__rating">${item.rating || 0}</span>
                    </div>
                    <h3 class="some__title">${item.nameRu || item.nameEn}</h3>
                `;
                someItem.setAttribute('onclick', `renderSolo(${item.filmId})`);
                mainBlock.append(someItem);
            })
            renderPagination(page, data.pagesCount)
        }
        else {
            pagination.innerHTML = '';
            mainBlock.innerHTML = `<p class="undefined">Ничего не найдено</p>`;
        }
        anime.classList.remove('active');
    })
    .then(() => {
        clickPagination(se, fn);
    })
    .catch(e => {
        console.log(e);
        anime.classList.remove('active');
    })
}

function renderPagination(cur = 1, len) {
    pagination.innerHTML = '';
    const ul = document.createElement('ul');
    ul.classList.add('header__list');
    const list = len < 14 ? len : 14;
    for (let i = 1; i <= list ; i++) {
        let li = document.createElement('li');
        li.innerHTML = `<a href="#" data-page="${i}" class="pagination__link ${cur == i ? 'active' : ''}">${i}</a>`;
        ul.append(li);
    }
    pagination.append(ul);
}

function clickPagination(val, fn){
    const links = document.querySelectorAll('.pagination__link');
    links.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const dataPage = this.getAttribute('data-page');
            renderCards(dataPage, val, fn);
        })
    })
}

renderCards();

formMain.addEventListener('submit', function(e) {
    e.preventDefault();
    anime.classList.add('active');
    renderCards(1, formInput.value, 'getSearch');
})
