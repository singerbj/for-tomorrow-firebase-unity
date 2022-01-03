const ROWS = 20;
const COLUMNS = 20;
const GRID_SQUARE_WIDTH = 50;
const SPACE_BETWEEN_SQUARES = 1;
const CSS_BUG = 0.1;
const R_KEY = ['r', 'R'];
const BACKSPACE_DELETE_KEY = ['Backspace', 'Delete'];
const LEFT_MOUSE_BUTTON = 0;

const INITIAL_INVENTORY_ARRAY = [
    {
        uuid: 'q0',
        itemId: 3,
        location: [0, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q1',
        itemId: 3,
        location: [1, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q2',
        itemId: 3,
        location: [2, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q3',
        itemId: 3,
        location: [3, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q4',
        itemId: 3,
        location: [4, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q5',
        itemId: 3,
        location: [5, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q6',
        itemId: 3,
        location: [6, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q7',
        itemId: 3,
        location: [7, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q8',
        itemId: 3,
        location: [8, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'q9',
        itemId: 3,
        location: [9, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'r5',
        itemId: 3,
        location: [10, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'r6',
        itemId: 3,
        location: [11, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'r7',
        itemId: 3,
        location: [11, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'r8',
        itemId: 3,
        location: [12, 0],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: 'r9',
        itemId: 2,
        location: [13, 0],
        size: [3, 1],
        rotated: false,
    },
    {
        uuid: 's0',
        itemId: 3,
        location: [2, 2],
        size: [1, 1],
        rotated: false,
    },
    {
        uuid: '7g',
        itemId: 4,
        location: [3, 3],
        size: [1, 3],
        rotated: false,
    },
    {
        uuid: '8f',
        itemId: 5,
        location: [4, 4],
        size: [2, 2],
        rotated: false,
    },
    {
        uuid: '99',
        itemId: 6,
        location: [0, 10],
        size: [4, 5],
        rotated: false,
    },
    {
        uuid: 's2',
        itemId: 1,
        location: [12, 3],
        size: [9, 3],
        rotated: true,
    },
];

const tmp = {};
INITIAL_INVENTORY_ARRAY.forEach((o) => {
    tmp[o.uuid] = o;
});

const INITIAL_INVENTORY = tmp;

module.exports = { ROWS, COLUMNS, GRID_SQUARE_WIDTH, SPACE_BETWEEN_SQUARES, CSS_BUG, R_KEY, BACKSPACE_DELETE_KEY, LEFT_MOUSE_BUTTON, INITIAL_INVENTORY };
