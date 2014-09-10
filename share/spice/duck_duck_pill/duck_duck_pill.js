(function (env) {
    "use strict";

    // Concatenate Ingredients
    function concatIngredients(ingredients) {
        var concatted = '';

        // Protect against the chance ingredients aren't part of the API result
        if (ingredients !== null && (typeof ingredients !== 'undefined')) {
            for (var i = 0; i < ingredients.length; i++) {
                concatted += ingredients[i] + ", ";
            }

            if (concatted.length > 0) {
                concatted = concatted.substring(0, concatted.length - 2);
            }
        }

        return concatted;
    }

    env.ddg_spice_duck_duck_pill = function(api_result){

        if (!api_result || api_result.error || !api_result.replyStatus || !api_result.replyStatus.totalImageCount || api_result.replyStatus.totalImageCount < 1) {
            return Spice.failed('duck_duck_pill');
        }

        Spice.add({
            id: "duck_duck_pill",
            name: "DuckDuckPill",
            data: api_result.nlmRxImages,
            meta: {
                sourceName: "C3PI RxImageAccess RESTful API",
                sourceUrl: "http://rximage.nlm.nih.gov/"
            },
            templates: {
                group: 'media',
                options: {
                    price: false,
                    rating: false,
                    brand: false,
                    buy: Spice.duck_duck_pill.duck_duck_pill_details
                }
            },
            normalize: function(item) {
                var heading  = item.ndc11,
                    active   = concatIngredients(item.ingredients.active),
                    inactive = concatIngredients(item.ingredients.inactive);

                // Not all items will have a name (drug name),
                // so when it's available use it, otherwise the
                // ndc-11 will suffice.
                if (item.name) {
                    heading = item.name;
                }

                return {
                    image: item.imageUrl,
                    abstract: item.ndc11,
                    heading: heading,
                    title: item.ndc11,
                    active: active,
                    inactive: inactive
                }
            } 
        });
    };
}(this));
