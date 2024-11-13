class SequenceMatch {
    constructor(sequence1, sequence2) {
        this.sequence1 = sequence1;
        this.sequence2 = sequence2;
        this.matchTable = needlemanWunsch(sequence1, sequence2);
    }

    getReplacement(s1StartIndex, s1EndIndex) {
        const replacementIndexes = [];
        for (let i = s1StartIndex; i <= s1EndIndex; i++) {
            const matches = this.matchTable[i];
            for (const match of matches) {
                if (replacementIndexes.length === 0 || replacementIndexes[replacementIndexes.length - 1] !== match) {
                    replacementIndexes.push(match);
                }
            }
        }

        const replacement = new Array(replacementIndexes.length);
        for (let i = 0; i < replacementIndexes.length; i++) {
            replacement[i] = this.sequence2[replacementIndexes[i]];
        }

        return replacement
    }
}

class Word {
    constructor(english, transcription, occurances = []) {
        this.english = english;
        this.transcription = transcription;
        this.occurances = occurances;
    }

    addSoundOccurance(occurance) {
        this.occurances.push(occurance);
    }
}

class SoundOccurance {
    constructor(indexOfWord, startIndexOfSound, endIndexOfSound = undefined) {
        this.indexOfWord = indexOfWord;
        this.startIndexOfSound = startIndexOfSound;
        this.endIndexOfSound = endIndexOfSound;
        if (this.endIndexOfSound === undefined) {
            this.endIndexOfSound = this.startIndexOfSound;
        }
    }

    toID() {
        return `gf-data-${this.indexOfWord}-${this.startIndexOfSound}-${this.endIndexOfSound}`;
    }
}

class SoundOccurances {
    constructor(name, occurances) {
        this.name = name;
        this.occurances = occurances;
    }
}

const WORD_TBODY = document.getElementById('word-tbody');
const GF_TBODY = document.getElementById('gf-tbody');

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

const GF_SOUND_TABLE = [
    new SoundOccurances('h', [
        new SoundOccurance(0, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('s', [
        null,
        null,
        new SoundOccurance(0, 3)
    ]),
    new SoundOccurances('tr', [
        new SoundOccurance(1, 0, 1),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('w', [
        new SoundOccurance(2, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('d', [
        // new SoundOccurance(),
        null,
        new SoundOccurance(2, 3),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('t', [
        new SoundOccurance(3, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('f', [
        new SoundOccurance(3, 4),
        // new SoundOccurance(),
        new SoundOccurance(5, 3),
    ]),
    new SoundOccurances('k', [
        new SoundOccurance(4, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('p', [
        null,
        null,
        new SoundOccurance(4, 2),
    ]),
    new SoundOccurances('n', [
        new SoundOccurance(5, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('sp', [
        new SoundOccurance(6, 0, 1),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('g', [
        new SoundOccurance(6, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('b', [
        new SoundOccurance(7, 0),
        // new SoundOccurance(),
        // new SoundOccurance(),
    ]),
    new SoundOccurances('l', [
        // new SoundOccurance(),
        // new SoundOccurance(),
        null,
        null,
        new SoundOccurance(7, 2),
    ]),
    // new SoundOccurances('', [
    //     new SoundOccurance(),
    //     new SoundOccurance(),
    //     new SoundOccurance(),
    // ]),
];

for (const sound of GF_SOUND_TABLE) {
    for (const occurance of sound.occurances) {
        if (occurance !== null) {
            WORDS[occurance.indexOfWord].addSoundOccurance(occurance);
        }
    }
}

window.addEventListener('load', () => {
    for (let i = 0; i < WORDS.length; i++) {
        const wordEnglish = document.createElement('td');
        wordEnglish.innerText = WORDS[i].english;

        const correctTranscription = document.createElement('td');
        correctTranscription.innerText = WORDS[i].transcription;

        const answeredTranscription = document.createElement('td');

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('ipa-input', 'form-control');
        input.id = `word-input-${i}`;
        input.name = `word-input-${i}`;
        input.addEventListener('input', transcriptionShortcuts)

        answeredTranscription.appendChild(input);

        const row = document.createElement('tr');

        row.appendChild(wordEnglish);
        row.appendChild(correctTranscription);
        row.appendChild(answeredTranscription);
        WORD_TBODY.appendChild(row);
    }

    for (const sound of GF_SOUND_TABLE) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.innerText = sound.name;
        row.appendChild(nameCell);

        for (const occurance of sound.occurances) {
            const dataCell = document.createElement('td');
            if (occurance === null) {
                dataCell.classList.add('table-active');
            }
            else {
                dataCell.id = occurance.toID();
            }
            row.appendChild(dataCell);
        }

        GF_TBODY.appendChild(row);
    }
});

function evaluateSounds() {
    for (const word of WORDS) {
        const occurances = word.occurances;

        if (occurances.length === 0) {
            continue;
        }

        const wordInput = document.getElementById(`word-input-${occurances[0].indexOfWord}`);
        const wordTranscription = wordInput.value;
        const sequenceMatch = new SequenceMatch(WORDS[occurances[0].indexOfWord].transcription, wordTranscription);
        for (const occurance of occurances) {
            const tableCell = document.getElementById(occurance.toID());
            tableCell.innerText = sequenceMatch.getReplacement(occurance.startIndexOfSound, occurance.endIndexOfSound).join('');
        }
    }
}

function transcriptionShortcuts(event) {
    // event.target.value = event.target.value.replaceAll('q', 'ʔ');
}