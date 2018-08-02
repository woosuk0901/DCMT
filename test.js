var cardManager = require('./CardManager');
let Constants = require('./Constants');

console.log(cardManager.encrypt('404142434445464748494A4B4C4D4E4F', '404142434445464748494A4B4C4D4E4F', Constants.NO_PAD, Constants.TDES_CBC).toString('hex').toUpperCase());

console.log(cardManager.encrypt('404142434445464748494A4B4C4D4E4F', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M1, Constants.TDES_CBC).toString('hex').toUpperCase());

console.log(cardManager.encrypt('404142434445464748494A4B4C4D4E4F', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M2, Constants.TDES_CBC).toString('hex').toUpperCase());


console.log(cardManager.encrypt('404142434445464748494A4B4C4D4E4F', '404142434445464748494A4B4C4D4E4F', Constants.NO_PAD, Constants.TDES_ECB).toString('hex').toUpperCase());

console.log(cardManager.encrypt('404142434445464748494A4B4C4D4E4F', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M1, Constants.TDES_ECB).toString('hex').toUpperCase());

console.log(cardManager.encrypt('404142434445464748494A4B4C4D4E4F', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M2, Constants.TDES_ECB).toString('hex').toUpperCase());



console.log(cardManager.decrypt('B4BAA89A8CD0292B0109E22B65A1D1C0', '404142434445464748494A4B4C4D4E4F', Constants.NO_PAD, Constants.TDES_CBC).toString('hex').toUpperCase());

console.log(cardManager.decrypt('B4BAA89A8CD0292B0109E22B65A1D1C01F0C54155EA2FE5D', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M1, Constants.TDES_CBC).toString('hex').toUpperCase());

console.log(cardManager.decrypt('B4BAA89A8CD0292B0109E22B65A1D1C034A9AED7789469E7', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M2, Constants.TDES_CBC).toString('hex').toUpperCase());

console.log(cardManager.decrypt('B4BAA89A8CD0292B45210E1BC84B1C31', '404142434445464748494A4B4C4D4E4F', Constants.NO_PAD, Constants.TDES_ECB).toString('hex').toUpperCase());

console.log(cardManager.decrypt('B4BAA89A8CD0292B45210E1BC84B1C318BAF473F2F8FD094', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M1, Constants.TDES_ECB).toString('hex').toUpperCase());

console.log(cardManager.decrypt('B4BAA89A8CD0292B45210E1BC84B1C31D0F922CDA84C6A45', '404142434445464748494A4B4C4D4E4F', Constants.ISO_9797_M2, Constants.TDES_ECB).toString('hex').toUpperCase());