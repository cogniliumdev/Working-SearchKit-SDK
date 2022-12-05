const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");


// ELASTIC_SEARCH_INDEX = pricesure_v3
// ELASTIC_SEARCH_URL = https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net

const config = {
    host: "https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net",

    index: "pricesure_v3",
    hits: {
        fields: ["rating", "vendor", "title", "category", "price", "discount", "domain"],
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
        new searchKit.TermFilter({
            identifier: "domain",
            field: "domain",
        }),
        new searchKit.TermFilter({
            identifier: "category",
            field: "category",
        }),
    ],
};

async function requestHandler(props) {

    const {
        searchQuery,
        vendorFilter,
        domainFilter,
        categoryFilter,
        sortBy,
    } = props;

    let filtersList = [
        // { identifier: "rating", min: "0", max: "5.0" }
    ];

    if (vendorFilter) filtersList.push({ identifier: "vendor", value: vendorFilter });
    if (domainFilter) filtersList.push({ identifier: "domain", value: domainFilter });
    if (categoryFilter) filtersList.push({ identifier: "category", value: categoryFilter });

    console.log(filtersList);

    const request = searchKit.default(config);
    const response = await request
        .query(searchQuery)
        .setFilters(filtersList)
        .setSortBy(sortBy)  // here to set the sort, specifying the id
        .execute({
            facets: true,
            hits: {
                from: 0,
                size: 20,
            },
        });

    response.hits.items.forEach((hit) => {
        console.log(hit.fields);
    });
}

requestHandler(
    {
        // domainFilter: "Sapphireonline.pk",
        // categoryFilter: "boys shirts",
        // vendorFilter :"",
        // searchQuery: "nokia",
        sortBy: ""
    }
);