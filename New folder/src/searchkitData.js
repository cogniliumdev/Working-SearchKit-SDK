const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");
const util = require('util')


// ELASTIC_SEARCH_INDEX = pricesure_v3
// ELASTIC_SEARCH_URL = https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net


async function requestHandler(props) {

    const {
        searchQuery,
        vendorFilter,
        domainFilter,
        categoryFilter,
        sortBy,
    } = props;


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

        // filters: [
        //     new searchKit.TermFilter({
        //         identifier: "rating",
        //         field: "rating",
        //     }),
        //     new searchKit.TermFilter({
        //         identifier: "vendor",
        //         field: "vendor",
        //     }),
        //     new searchKit.TermFilter({
        //         identifier: "domain",
        //         field: "domain",
        //     }),
        //     new searchKit.TermFilter({
        //         identifier: "category",
        //         field: "category",
        //     }),
        // ],

        facets: [
            new searchKit.MultiQueryOptionsFacet({
                field: 'domain',
                identifier: 'domain',
                multipleSelect: true,
                label: "domain",
                options: [
                    { value: "galaxydoreen.com", label: "galaxydoreen.com", },
                    { value: "laam.pk", label: "laam.pk", },
                    { value: "secretstash.pk", label: "secretstash.pk", },
                ]
            }),

            new searchKit.RefinementSelectFacet({
                field: 'vendor',
                identifier: 'vendor',
                label: "vandor",
                multipleSelect: true,
            }),

            new searchKit.RefinementSelectFacet({
                field: 'category',
                identifier: 'category',
                label: "category",
                multipleSelect: true,
            }),
        ]
    };


    let filtersList = [];

    if (vendorFilter) {
        vendorFilter.forEach((filterValue) => {
            filtersList.push({ identifier: "vendor", value: filterValue });
        })
    }

    if (domainFilter) {
        domainFilter.forEach((filterValue) => {
            filtersList.push({ identifier: "domain", value: filterValue });
        })
    }

    if (categoryFilter) {
        categoryFilter.forEach((filterValue) => {
            filtersList.push({ identifier: "category", value: filterValue });
        })
    }

    const request = searchKit.default(config);
    const response = await request
        .query(searchQuery)
        .setFilters(
            filtersList
            // [
            //  Secret Stash  EMILY
            // { identifier: "vendor", value: "EMILY" },
            // { identifier: "vendor", value: "Secret Stash" },
            // { identifier: "vendor", value: "H&S Collection" },
            // { identifier: "domain", value: "laam.pk" },
            // { identifier: "domain", value: "galaxydoreen.com" },
            // { identifier: "category", value: "boys shirts" },
            // { identifier: "category", value: "clothing" },
            // { identifier: "category", value: "smartphones" },
            // { identifier: "category", value: "rici coin" },
            // ]
        )
        .setSortBy(sortBy)  // here to set the sort, specifying the id
        .execute({
            facets: true,
            hits: {
                from: 0,
                size: 30,
            },
        });

    // console.log(util.inspect(filtersList, { showHidden: true, depth: null, colors: true }));
    console.log(util.inspect(response, { showHidden: true, depth: null, colors: true }));
}

requestHandler({
    // domainFilter: "Sapphireonline.pk",
    // categoryFilter: ["rici coin", "smartphones"],
    // categoryFilter: ["smartphones"],
    // vendorFilter: ["EMILY", "H&S Collection"],
    // vendorFilter: ["OPPO", "VIVO", "TECNO", "REALME"],
    // searchQuery: "nokia",
    sortBy: "price-descending"
});


// make hits dynamic