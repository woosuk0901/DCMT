var fs = require('fs');
var pad = require('pad');
var config_file_path = __dirname + '/config.json';
var config;
var enc_key;
var mac_key;
var dek_key;
var log_path;
var session_enc_key;
var session_mac_key;
var session_dek_key;
var cmd;
var resp;
var sw;
var pcsc;

var CardManager = {
    init : () => {
        fs.readFile(config_file_path, 'utf8', (err, data) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    config = {
                        'ENC_KEY' : '404142434445464748494A4B4C4D4E4F',
                        'MAC_KEY' : '404142434445464748494A4B4C4D4E4F',
                        'DEK_KEY' : '404142434445464748494A4B4C4D4E4F',
                        'LOG_PATH' : __dirname + '/LOG'
                    };
                    // console.log(JSON.stringify(config));
                    fs.writeFile('config.json', JSON.stringify(config, null, 4), 'utf8', (err) => {
                        if (err) throw err;
                    });
                    return true;
                }
                else {
                    console.log('Error : ' + err.code);
                    return false;
                }
            }
            else {
                config = JSON.parse(data);
                console.log(`ENK_KEY : ${config['ENC_KEY']}`);
                console.log(`MAC_KEY : ${config['MAC_KEY']}`);
                console.log(`DEK_KEY : ${config['DEK_KEY']}`);
            }
        });
        return true;
    },
    sLen : (data) => {
        var len = data.length * 2;
        data = len.toString(16) + data;
        return data;
    },
    adds : (data1, data2) => {
        var resultLen;
        var result;
        var num1, num2;
        if (data1.length < data2.length) {
            resultLen = data2.length;
        }
        else {
            resultLen = data1.length;
        }
        num1 = parseInt(data1, 16);
        num2 = parseInt(data2, 16);
        result = num1 + num2;
        result = result.toString(16);
        pad(resultLen, result, '0');
        return result.toUpperCase();
    },
    subs : (data1, data2) => {
        var resultLen;
        var result;
        var num1, num2;
        if (data1.length < data2.length) {
            resultLen = data2.length;
        }
        else {
            resultLen = data1.length;
        }
        num1 = parseInt(data1, 16);
        num2 = parseInt(data2, 16);

        if (num1 < num2) {
            return pad("", resultLen, '0');
        }
        
        result = num1 - num2;
        result = result.toString(16);
        pad(resultLen, result, '0');
        return result.toUpperCase();

    },
    getProcessingOptions : (pdolData) => {
        cmd = '80A80000' + CardManager.sLen(pdolData);
        return cmd;
    }
}

module.exports = CardManager;