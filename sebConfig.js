var fs = require("fs");



/**
 * Asynchronous: Constructor
 * 
 * @param {string} fileName
 * @param {object} options {autoSave: true (default)}
 * @param {function} callback(error)
 */
function SebConfig(fileName, options, callback) {
    fs.access(fileName, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
            if (callback)
                callback(`can't read/write file [${fileName}]`);
            return;
        }
        this._config = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        this._fileName = fileName;
        this._options = options || { autoSave: false };
        if (callback)
            callback(null);
        return this;
    });

}


/**
 * Asyncronous: Saves the file
 * 
 * @param {string} fileName (if null, overwriting origin file)
 * @param {function} callback(error)
 */
SebConfig.prototype.save = function save(fileName, callback) {

    // Checking write access
    fs.access(fileName || this._fileName, fs.constants.W_OK, (err) => {
        if (err) {
            if (callback)
                callback(`can't write file [${fileName}]`);
            return;
        }

        // Writing file with pretty-printed JSON
        fs.writeFileSync(fileName, JSON.stringify(this._config, null, 2));
    });
    if (callback)
        callback(null);
};


/**
 * Synchronous: Returns true if there is a value at given key
 * 
 * @param {string} key
 * @returns boolean
 */
SebConfig.prototype.has = function has(key) {
    var currentkey = this._config;
    var keys = key.split(".");
    var keyIndex = 0;

    while (currentkey != null
        && typeof currentkey[keys[keyIndex]] != "undefined") {
        currentkey = currentkey[keys[keyIndex]];
        keyIndex++;
    }

    return keys.length == keyIndex;
};

/**
 * Synchronous: Returns value at giver key
 * 
 * @param {string} key
 * @returns {any} value
 */
SebConfig.prototype.get = function get(key) {
    var currentkey = this._config;
    var keys = key.split(".");
    var keyIndex = 0;

    while (currentkey != null
        && typeof currentkey[keys[keyIndex]] != "undefined") {
        currentkey = currentkey[keys[keyIndex]];
        keyIndex++;
    }
    if (keys.length != keyIndex) {
        return null;
    }
    return currentkey;
};

/**
 * Asynchronous: set value at given key
 * Saves the file if "autoSave" option is enabled
 * 
 * @param {string} keyString
 * @param {any} value
 * @param {function} callback(error)
 * @returns
 */
SebConfig.prototype.set = function set(keyString, value, callback) {
    var currentkey = this._config;
    var keys = keyString.split(".");
    var lastKey = keys.pop();
    var keyIndex = 0;

    while (typeof currentkey[keys[keyIndex]] != "undefined") {
        currentkey = currentkey[keys[keyIndex]];
        keyIndex++;
    }

    while (keyIndex < keys.length) {
        currentkey[keys[keyIndex]] = {};
        currentkey = currentkey[keys[keyIndex]];
        keyIndex++;
    }

    currentkey[lastKey] = value;

    if (this._options.autoSave) {
        this.save(this._fileName, function (err) {
            if (callback)
                callback(err);
            return;
        });
    }
    else {
        if (callback)
            callback(err);
        return;
    }

};

module.exports = SebConfig;
