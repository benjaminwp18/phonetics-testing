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
