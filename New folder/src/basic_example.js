const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");


// ELASTIC_SEARCH_INDEX = pricesure_v3
// ELASTIC_SEARCH_URL = https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net

const config = {
    host: "https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net",

    index: "pricesure_v3",
    hits: {
        fields: ["rating", "vendor", "title", "price", "discount"],
    },

    query: new searchKit.MultiMatchQuery({
        fields: ["title^4"],
    }),

    sortOptions: [
        { id: 'discount-descending', field: { discount: 'desc' }, defaultOption: true },
        { id: 'discount-ascending', field: { discount: 'asc' } },
        { id: 'price-ascending', field: { price: 'asc' } },
        { id: 'price-descending', field: { price: 'desc' } }
    ],

    filters: [
        new searchKit.TermFilter({
            identifier: "rating",
            field: "rating",
        }),
        new searchKit.TermFilter({
            identifier: "vendor",
            field: "vendor",
        }),
    ],
};

async function requestHandler() {
    const request = searchKit.default(config);
    const response = await request
        .query("shirt")
        .setFilters([
            { identifier: "vendor", value: "No Brand" },
            { identifier: "rating", min: "4.0", max: "5.0" },
        ])
        .setSortBy("")  // here to set the sort, specifying the id
        .execute({
            facets: true,
            hits: {
                from: 0,
                size: 30,
            },
        });
    // console.log(response.hits);
    response.hits.items.forEach((hit) => {
        console.log(hit.fields);
    });
}

requestHandler();