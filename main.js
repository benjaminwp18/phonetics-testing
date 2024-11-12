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
    constructor(english, transcription) {
        this.english = english;
        this.transcription = transcription;
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

const WORD_FORM = document.getElementById('word-form');
const GF_TBODY = document.getElementById('gf-tbody');

const WORDS = [
    new Word('house', 'haʊs'),
    new Word('tree', 'tri'),
    new Word('window', 'wɪndo'),
    new Word('window', 'wɪndo'),
    new Word('window', 'wɪndo'),
    new Word('window', 'wɪndo'),
];

const GF_SOUND_TABLE = [
    new SoundOccurances('h', [
        new SoundOccurance(0, 0),
        new SoundOccurance(0, 0),
        new SoundOccurance(0, 0),
    ]),
    new SoundOccurances('s', [
        new SoundOccurance(0, 3)
    ]),
    new SoundOccurances('tr', [
        new SoundOccurance(1, 0, 1)
    ]),
    new SoundOccurances('w', [
        new SoundOccurance(2, 0)
    ]),
    new SoundOccurances('d', [
        null,
        new SoundOccurance(2, 3)
    ]),
];

// TODO: don't create a new array for this; modify WORDS instead (score occurances in the Word objects)
const GF_SOUND_TABLE_BY_WORD = new Array(WORDS.length);
for (let i = 0; i < GF_SOUND_TABLE_BY_WORD.length; i++) {
    GF_SOUND_TABLE_BY_WORD[i] = [];
}

for (const sound of GF_SOUND_TABLE) {
    for (const occurance of sound.occurances) {
        if (occurance !== null) {
            GF_SOUND_TABLE_BY_WORD[occurance.indexOfWord].push(occurance);
        }
    }
}

window.addEventListener('load', () => {
    for (let i = 0; i < WORDS.length; i++) {
        const label = document.createElement('label');
        label.setAttribute('for', `word-input-${i}`);
        label.innerText = `${WORDS[i].english} (${WORDS[i].transcription})`;

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('ipa-input');
        input.id = `word-input-${i}`;
        input.name = `word-input-${i}`;
        input.addEventListener('input', transcriptionShortcuts)

        const div = document.createElement('div');
        div.classList.add('form-word-div');

        div.appendChild(label);
        div.appendChild(input);
        WORD_FORM.appendChild(div);
    }

    for (const sound of GF_SOUND_TABLE) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.innerText = sound.name;
        row.appendChild(nameCell);

        for (const occurance of sound.occurances) {
            const dataCell = document.createElement('td');
            if (occurance !== null) {
                dataCell.id = occurance.toID();
            }
            row.appendChild(dataCell);
        }

        GF_TBODY.appendChild(row);
    }
});

function evaluateSounds() {
    for (const word of GF_SOUND_TABLE_BY_WORD) {
        if (word.length === 0) {
            continue;
        }

        const wordInput = document.getElementById(`word-input-${word[0].indexOfWord}`);
        const wordTranscription = wordInput.value;
        const sequenceMatch = new SequenceMatch(WORDS[word[0].indexOfWord].transcription, wordTranscription);
        for (const occurance of word) {
            const tableCell = document.getElementById(occurance.toID());
            tableCell.innerText = sequenceMatch.getReplacement(occurance.startIndexOfSound, occurance.endIndexOfSound).join('');
        }
    }
}

function transcriptionShortcuts(event) {
    // event.target.value = event.target.value.replaceAll('q', 'ʔ');
}