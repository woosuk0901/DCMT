
let Constants = {
    DES_ECB : 'des-ecb',
    DES_CBC : 'des-cbc',
    TDES_ECB : 'des-ede-ecb',
    TDES_CBC : 'des-ede-cbc',
    DES_TDES_ECB : 4,
    DES_TDES_CBC : 5,
    NO_PAD : 6,
    ISO_9797_M1 : 7,
    ISO_9797_M2 : 8,
    ISO_9797_M1_ALG3 : 9,
    ISO_9797_M2_ALG3 : 10,
};

module.exports = Object.freeze(Constants);  //freeze prevents changes by users

