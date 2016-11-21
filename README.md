# sebconfig.js
Simple module for managing a config file in nodeJS


Full usage example :
```JS
var Config = require("./config.js");

var config = new Config("./config.json", {autoSave: true}, function(error) {
    if (error) {
        console.log(error);
    }
    main();
});

function main() {
    if (config.has("key1.key2.key3")) {
        var value = config.get("key1.key2.key3");
        console.log("value: " + value);
    }

    config.set("key1.key2bis.key3bis", null);

    if (config.has("key1.key2bis.key3bis")) {
        var value = config.get("key1.key2bis.key3bis");
        console.log("value2: " + value);
    }
}
```
