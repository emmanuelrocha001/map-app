// // config.js
// requirejs.config({
//     paths: {
//         "app": "/app",
//         "structures": "/structures"
//     },

//     "app": {
//         deps: ["structures"],
//         exports: "app"
//     },
//     packages: [
//         "app"
//     ]
// });

requirejs( ["structures" , "app"], function(structures, app) {

});