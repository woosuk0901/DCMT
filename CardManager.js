let Constants = require('./Constants');
var fs = require('fs');
var pad = require('pad');
var crypto = require('crypto');

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

function init() {
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
}

function sLen(data) {
    var len = data.length * 2;
    data = len.toString(16) + data;
    return data;
}

function adds (data1, data2) {
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
}

function subs(data1, data2) {
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
}

function padding(message, mode) {
    if (mode == Constants.NO_PAD) {
        return message;
    }

    if (!Buffer.isBuffer(message)) {
        message = Buffer.from(message, 'hex');
    }
    var pad_len = 8 - (message.length % 8);
    var pad;

    switch(mode) {
        case Constants.ISO_9797_M1 : break;
        case Constants.ISO_9797_M2 : {
            message = append(message, '80');
            pad_len = 8 - (message.length % 8);
        }break;
        default : throw Error('Padding rule is not available.');
    }
    pad = Buffer.alloc(pad_len, 0);
    message = append(message, pad);
    
    return message;
}

function append(buf1, buf2) {
    if (Buffer.isBuffer(buf1)) {
        buf1 = buf1.toString('hex')
    }
    if (Buffer.isBuffer(buf2)) {
        buf2 = buf2.toString('hex')
    }

    buf3 = Buffer.from(buf1 + buf2, 'hex');

    return buf3;
}

function encrypt(message, key, pad_rule, mode, iv) {
    var cipher;
    key = Buffer.from(key, 'hex');
    message = Buffer.from(message, 'hex');
    
    switch(mode) {
        case Constants.DES_ECB :
        case Constants.TDES_ECB : {
            cipher = crypto.createCipheriv(mode, key, '');
        }break;
        case Constants.DES_CBC : 
        case Constants.TDES_CBC : {
            if (iv == undefined) {
                iv = Buffer.alloc(8, 0);
                // iv.fill(0);
            } else {
                iv = ut.toBuffer(iv);
            }
            cipher = crypto.createCipheriv(mode, key, iv);
        }break;
        default : throw Error(`Algorithm is not available : ${mode}`);
    }
   
    cipher.setAutoPadding(false);
    message = padding(message, pad_rule);

    var encrypted = cipher.update(message);
        
    return encrypted;
}

function decrypt(message, key, pad_rule, mode, iv) {
    var deCipher;
    key = Buffer.from(key, 'hex');
    message = Buffer.from(message, 'hex');
    
    switch(mode) {
        case Constants.DES_ECB :
        case Constants.TDES_ECB : {
            deCipher = crypto.createDecipheriv(mode, key, '');
        }break;
        case Constants.DES_CBC : 
        case Constants.TDES_CBC : {
            if (iv == undefined) {
                iv = Buffer.alloc(8, 0);
                // iv.fill(0);
            } else {
                iv = ut.toBuffer(iv);
            }
            deCipher = crypto.createDecipheriv(mode, key, iv);
        }break;
        default : throw Error(`Algorithm is not available : ${mode}`);
    }
   
    deCipher.setAutoPadding(false);

    // message = padding(message, pad_rule);

    var decrypted = deCipher.update(message);
    decrypted = remove_padding(decrypted, pad_rule);
    
    return decrypted;
}

function remove_padding(message, pad_rule) {
    if (pad_rule == Constants.NO_PAD) {
        return message;
    }
    else if (pad_rule == Constants.ISO_9797_M1) {
        for (var i = message.length - 2 ; i >= 0 ; i--) {
            if ( message.slice(i, i+1).toString('hex') == '00') {
                continue;
            }
            message = message.slice(0, i + 1);
            return message;
        }
        throw Error('Message is not padded by ISO 9797 M1');
    }
    else if (pad_rule == Constants.ISO_9797_M2) {
        for (var i = message.length - 2 ; i >= 0 ; i--) {
            if ( message.slice(i, i+1).toString('hex') != '80') {
                continue;
            }
            message = message.slice(0, i);
            return message;
        }
        throw Error('Message is not padded by ISO 9797 M2');
    }
    else {
        throw Error(`Padding rule is not available : ${pad_rule}`);
    }


}

module.exports = {
    init : init,
    sLen : sLen,
    adds : adds,
    subs : subs,
    append : append,
    padding : padding,
    encrypt : encrypt,
    decrypt : decrypt
};