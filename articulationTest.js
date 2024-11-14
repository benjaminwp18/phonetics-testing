const WORDS = [
    new Word('house', 'haʊs'),
    new Word('tree', 'tri'),
    new Word('window', 'wɪndo'),
    new Word('telephone', 'tεləfon'),
    new Word('cup', 'kʌp'),
    new Word('knife', 'naɪf'),
    new Word('spoon', 'spun'),
    new Word('girl', 'gɝl'),
    new Word('ball', 'bɔl'),
    new Word('wagon', 'wægən'),
    new Word('shovel', 'ʃʌvəl'),
    new Word('monkey', 'mʌŋki'),
    new Word('banana', 'bənænə'),
    new Word('zipper', 'zɪpɚ'),
    new Word('scissors', 'sɪzɚz'),
    new Word('duck', 'dʌk'),
    new Word('quack', 'kwæk'),
    new Word('yellow', 'jεlo'),
    new Word('vaccuum', 'vækjum'),
    new Word('watch', 'watʃ'),
    new Word('plane', 'plen'),
    new Word('swimming', 'swɪmɪŋ'),
    new Word('watches', 'watʃɪz'),
    new Word('lamp', 'læmp'),
    new Word('car', 'kar'),
    new Word('blue', 'blu'),
    new Word('rabbit', 'ræbɪt'),
    new Word('carrot', 'kærɪt'),
    new Word('orange', 'ɔrɪndʒ'),
    new Word('fishing', 'fɪʃɪŋ'),
    new Word('chair', 'tʃεr'),
    new Word('feather', 'fεðɚ'),
    new Word('pencils', 'pεnsəlz'),
    new Word('this', 'ðɪs'),
    new Word('bathtub', 'bæθtʌb'),
    new Word('bath', 'bæθ'),
    new Word('ring', 'rɪŋ'),
    new Word('finger', 'fɪŋgɚ'),
    new Word('thumb', 'θʌm'),
    new Word('jumping', 'dʒʌmpɪŋ'),
    new Word('pajamas', 'pədʒæməz'),
    new Word('flowers', 'flaʊɚz'),
    new Word('brush', 'brʌʃ'),
    new Word('drum', 'drʌm'),
    new Word('frog', 'frɔg'),
    new Word('green', 'grin'),
    new Word('clown', 'klaʊn'),
    new Word('balloons', 'bəlunz'),
    new Word('crying', 'kraɪɪŋ'),
    new Word('glasses', 'glæsɪz'),
    new Word('slide', 'slaɪd'),
    new Word('stars', 'starz'),
    new Word('five', 'faɪv'),
];

const ARTIC_SOUND_TABLE = [
    new SoundOccurances('p', [
        new SoundOccurance(32, 0),
        new SoundOccurance(13, 2),
        new SoundOccurance(4, 2),
    ]),
    new SoundOccurances('m', [
        new SoundOccurance(11, 0),
        new SoundOccurance(21, 3),
        new SoundOccurance(43, 3),
    ]),
    new SoundOccurances('n', [
        new SoundOccurance(5, 0),
        new SoundOccurance(12, 2),
        new SoundOccurance(46, 4),
    ]),
    new SoundOccurances('w', [
        new SoundOccurance(2, 0),
        null, null
    ]),
    new SoundOccurances('h', [
        new SoundOccurance(0, 0),
        null, null
    ]),
    new SoundOccurances('b', [
        new SoundOccurance(8, 0),
        new SoundOccurance(26, 2),
        new SoundOccurance(34, 5),
    ]),
    new SoundOccurances('g', [
        new SoundOccurance(7, 0),
        new SoundOccurance(9, 2),
        new SoundOccurance(44, 3),
    ]),
    new SoundOccurances('k', [
        new SoundOccurance(4, 0),
        new SoundOccurance(11, 3),
        new SoundOccurance(15, 2),
    ]),
    new SoundOccurances('f', [
        new SoundOccurance(29, 0),
        new SoundOccurance(3, 4),
        new SoundOccurance(5, 3),
    ]),
    new SoundOccurances('d', [
        new SoundOccurance(15, 0),
        new SoundOccurance(2, 3),
        new SoundOccurance(50, 4),
    ]),
    new SoundOccurances('ŋ', [
        null,
        new SoundOccurance(37, 2),
        new SoundOccurance(36, 2),
    ]),
    new SoundOccurances('j', [
        new SoundOccurance(17, 0),
        null, null
    ]),
    new SoundOccurances('t', [
        new SoundOccurance(3, 0),
        new SoundOccurance(34, 3),
        new SoundOccurance(27, 4),
    ]),
    new SoundOccurances('ʃ', [
        new SoundOccurance(10, 0),
        new SoundOccurance(29, 2),
        new SoundOccurance(42, 3),
    ]),
    new SoundOccurances('tʃ', [
        new SoundOccurance(30, 0, 1),
        new SoundOccurance(22, 2, 3),
        new SoundOccurance(19, 2, 3),
    ]),
    new SoundOccurances('l', [
        new SoundOccurance(23, 0),
        new SoundOccurance(47, 2),
        new SoundOccurance(8, 2),
    ]),
    new SoundOccurances('r', [
        new SoundOccurance(26, 0),
        new SoundOccurance(27, 2),
        new SoundOccurance(24, 2),
    ]),
    new SoundOccurances('dʒ', [
        new SoundOccurance(39, 0, 1),
        new SoundOccurance(40, 2, 3),
        new SoundOccurance(28, 4, 5),
    ]),
    new SoundOccurances('θ', [
        new SoundOccurance(38, 0),
        new SoundOccurance(34, 2),
        new SoundOccurance(35, 2),
    ]),
    new SoundOccurances('v', [
        new SoundOccurance(18, 0),
        new SoundOccurance(10, 2),
        new SoundOccurance(52, 3),
    ]),
    new SoundOccurances('s', [
        new SoundOccurance(14, 0),
        new SoundOccurance(32, 3),
        new SoundOccurance(0, 3)
    ]),
    new SoundOccurances('z', [
        new SoundOccurance(13, 0),
        new SoundOccurance(14, 2),
        new SoundOccurance(41, 5),
    ]),
    new SoundOccurances('ð', [
        new SoundOccurance(33, 0),
        new SoundOccurance(31, 2),
        null
    ]),
    new SoundOccurances('bl', [
        new SoundOccurance(25, 0, 1),
        null, null
    ]),
    new SoundOccurances('br', [
        new SoundOccurance(42, 0, 1),
        null, null
    ]),
    new SoundOccurances('dr', [
        new SoundOccurance(43, 0, 1),
        null, null
    ]),
    new SoundOccurances('fl', [
        new SoundOccurance(41, 0, 1),
        null, null
    ]),
    new SoundOccurances('fr', [
        new SoundOccurance(44, 0, 1),
        null, null
    ]),
    new SoundOccurances('gl', [
        new SoundOccurance(49, 0, 1),
        null, null
    ]),
    new SoundOccurances('gr', [
        new SoundOccurance(45, 0, 1),
        null, null
    ]),
    new SoundOccurances('kl', [
        new SoundOccurance(46, 0, 1),
        null, null
    ]),
    new SoundOccurances('kr', [
        new SoundOccurance(48, 0, 1),
        null, null
    ]),
    new SoundOccurances('kw', [
        new SoundOccurance(16, 0, 1),
        null, null
    ]),
    new SoundOccurances('pl', [
        new SoundOccurance(20, 0, 1),
        null, null
    ]),
    new SoundOccurances('sl', [
        new SoundOccurance(50, 0, 1),
        null, null
    ]),
    new SoundOccurances('sp', [
        new SoundOccurance(6, 0, 1),
        null, null
    ]),
    new SoundOccurances('st', [
        new SoundOccurance(51, 0, 1),
        null, null
    ]),
    new SoundOccurances('sw', [
        new SoundOccurance(21, 0, 1),
        null, null
    ]),
    new SoundOccurances('tr', [
        new SoundOccurance(1, 0, 1),
        null, null
    ]),
    // new SoundOccurances('', [
    //     new SoundOccurance(),
    //     new SoundOccurance(),
    //     new SoundOccurance(),
    // ]),
];

for (const sound of ARTIC_SOUND_TABLE) {
    for (const occurance of sound.occurances) {
        if (occurance !== null) {
            WORDS[occurance.indexOfWord].addSoundOccurance(occurance);
        }
    }
}