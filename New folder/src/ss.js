const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");


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



        facets: [


            new searchKit.RefinementSelectFacet({
                identifier: "domain",
                field: "domain",
                multipleSelect: true
            })]
    };




    const request = searchKit.default(config);
    const response = await request
        .query("")
        .setFilters([
            { identifier: "domain", value: "laam.pk" },
            { identifier: "domain", value: "secretstash.pk" }
        ])
        .execute({
            facets: true,
            hits: {
                from: 0,
                size: 5,
            },
        });

    response.hits.items.forEach((hit) => {
        console.log(hit);
    });
}

requestHandler(
    {
        // domainFilter: "Sapphireonline.pk",
        // categoryFilter: "boys shirts",
        // vendorFilter :"EMILY",
        // searchQuery: "nokia",
        // sortBy: ""
    }
);


// make hits dynamic