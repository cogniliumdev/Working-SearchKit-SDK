const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");
const util = require('util')


// ELASTIC_SEARCH_INDEX = pricesure_v3
// ELASTIC_SEARCH_URL = https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net

const config = {
    host: "https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net",

    index: "pricesure_v3",
    hits: {
        fields: ["rating", "vendor", "title", "price", "discount", "domain"],
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


    facets: [
        
        new searchKit.MultiQueryOptionsFacet({
            field: 'domain',
            identifier: 'domain',
            multipleSelect: true,
            label: "domain",
            options:[
                { value: "galaxydoreen.com", label: "galaxydoreen.com",  },
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
    ]


};
async function requestHandler() {
    const request = searchKit.default(config);
    const response = await request
        .query("")
        .setFilters([
            //Secret Stash  EMILY
            // { identifier: "vendor", value: "EMILY" },
            // { identifier: "vendor", value: "Secret Stash"},
            // { identifier: "vendor", value: "H&S Collection"},
            // { identifier: "domain", value: "laam.pk"},
            // { identifier: "domain", value: "galaxydoreen.com"},
            // { identifier: "domain", value: "secretstash.pk"},
        ])
        .setSortBy("")  // here to set the sort, specifying the id
        .execute({
            facets: true,
            hits: {
                from: 0,
                size: 10,
            },
        });
    // console.log(response);
    console.log(util.inspect(response,{showHidden: true, depth: null, colors: true}));

    // console.log(response.facets[0].entries);
    // console.log(response.facets);
    // response.hits.items.forEach((hit) => {
    //     console.log(hit.fields);
    // });
    // response.facets[0].entries.forEach((facet) => {
    //     console.log(facet);
    // });
}

requestHandler();