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
        return `artic-data-${this.indexOfWord}-${this.startIndexOfSound}-${this.endIndexOfSound}`;
    }
}

class SoundOccurances {
    constructor(name, occurances) {
        this.name = name;
        this.occurances = occurances;
    }
}

const WORD_TBODY = document.getElementById('word-tbody');
const ARTIC_TBODY = document.getElementById('artic-tbody');

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

    for (const sound of ARTIC_SOUND_TABLE) {
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

        ARTIC_TBODY.appendChild(row);
    }
});

function evaluateSounds() {
    for (const word of WORDS) {
        const occurances = word.occurances;

        if (occurances.length === 0) {
            continue;
        }

        const wordIndex = occurances[0].indexOfWord;
        const wordInput = document.getElementById(`word-input-${wordIndex}`);
        const correctTranscription = WORDS[wordIndex].transcription;
        const answeredTranscription = wordInput.value;
        const sequenceMatch = new SequenceMatch(correctTranscription, answeredTranscription);
        for (const occurance of occurances) {
            const tableCell = document.getElementById(occurance.toID());
            const replacement = sequenceMatch.getReplacement(occurance.startIndexOfSound, occurance.endIndexOfSound).join('');
            const original = correctTranscription.substring(occurance.startIndexOfSound, occurance.endIndexOfSound + 1);
            tableCell.innerText = replacement;
            if (replacement === original) {
                tableCell.style.color = "lightgray";
                tableCell.style.fontStyle = "italic";
            }
        }
    }
}

IMPORT_ANSWERS_TEXTAREA = document.getElementById('import-answers-textarea');

function importAnswers() {
    const answers = IMPORT_ANSWERS_TEXTAREA.value.split('\n');
    for (let i = 0; i < answers.length; i++) {
        document.getElementById(`word-input-${i}`).value = answers[i];
    }
}

function exportAnswers() {
    const answers = new Array(WORDS.length);
    for (let i = 0; i < WORDS.length; i++) {
        answers[i] = document.getElementById(`word-input-${i}`).value;
    }
    IMPORT_ANSWERS_TEXTAREA.value = answers.join('\n');
}

function transcriptionShortcuts(event) {
    // event.target.value = event.target.value.replaceAll('q', 'ʔ');
}