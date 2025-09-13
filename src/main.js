import './fonts/ys-display/fonts.css';
import './style.css';

import {data as sourceData} from './data/dataset_1.js';

import {initData} from './data.js';
import {processFormData} from './lib/utils.js';

import {initTable} from './components/table.js';
import {initPagination} from './components/pagination.js';
import {initSorting} from './components/sorting.js';
import {initFiltering} from './components/filtering.js';
// @todo: подключение

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page,
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения

    // @todo: использование

    result = applyPagination(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination'],
}, render);

// @todo: инициализация

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const inputElem = el.querySelector('input');
        const labelElem = el.querySelector('span');

        inputElem.value = page;
        inputElem.checked = isCurrent;
        labelElem.textContent = page;

        return el;
    },
);

const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {searchBySeller: indexes.sellers},
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal,
]);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
