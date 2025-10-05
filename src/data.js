const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    // переменные для кеширования данных
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // функция для приведения строк в тот вид, который нужен нашей таблице
    const mapRecords = (data) => {
        return data.map((item) => {
            return {
                id: item.receipt_id,
                date: item.date,
                seller: sellers[item.seller_id],
                customer: customers[item.customer_id],
                total: item.total_amount,
            };
        });
    };

    // функция получения индексов
    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }

        return {sellers, customers};
    };

    // функция получения записей о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        // преобразуем объект параметров в SearchParams объект, представляющий query часть url
        const qs = new URLSearchParams(query);

        // и приводим к строковому виду
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated) { // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult; // если параметры запроса не поменялись, то отдаём сохранённые ранее данные
        }

        // если прошлый квери не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery; // сохраняем для следующих запросов
        lastResult = {
            total: records.total,
            items: mapRecords(records.items),
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords,
    };
}
