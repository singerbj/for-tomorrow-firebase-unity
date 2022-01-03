const TYPES = {
    gun: 0,
    food: 1,
    healing: 2,
    misc: 3,
};

const CATALOG = {
    1: {
        name: 'ak-47',
        type: TYPES.gun,
        size: [9, 3],
        imgUrl: 'https://www.vhv.rs/dpng/d/411-4117665_csgo-ak-47-frontside-misty-hd-png-download.png',
    },
    2: {
        name: 'wrench',
        type: TYPES.misc,
        size: [3, 1],
        imgUrl: 'https://toppng.com/uploads/preview/wrench-spanner-11530930486eoo6zninzq.png',
    },
    3: {
        name: 'bandaid',
        type: TYPES.healing,
        size: [1, 1],
        imgUrl: 'https://img.favpng.com/21/12/17/adhesive-bandage-band-aid-deviantart-illustration-png-favpng-hcQh1bRsEB9QUYP6uZhWKAFTM.jpg',
    },
    4: {
        name: 'juice',
        type: TYPES.food,
        size: [1, 3],
        imgUrl: 'https://www.vhv.rs/dpng/d/29-290666_tree-top-apple-juice-box-hd-png-download.png',
    },
    5: {
        name: 'propane tank',
        type: TYPES.misc,
        size: [2, 2],
        imgUrl: 'https://toppng.com/uploads/preview/empiregastank-20-lb-propane-tank-11563422962kobrarmd9h.png',
    },
    6: {
        name: 'ukelele',
        type: TYPES.misc,
        size: [4, 5],
        imgUrl: 'https://w7.pngwing.com/pngs/208/840/png-transparent-lanikai-lu-21-soprano-ukulele-lanikai-lu-21-soprano-ukulele-lanikai-lu-21-soprano-ukulele-guitalele-musical-instruments-guitar-accessory-cuatro-concert.png',
    },
};

module.exports = {
    TYPES,
    CATALOG,
};
