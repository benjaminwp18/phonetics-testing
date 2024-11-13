class Edge {
    constructor(destination, cost) {
        this.destination = destination;
        this.cost = cost;
    }
}

class Vertex {
    constructor(edges, position, distance = Number.MAX_SAFE_INTEGER, previous = undefined) {
        this.edges = edges;
        this.position = position;
        this.distance = distance;
        this.previous = previous;
    }
}

class SimplePriorityQueue {
    constructor(compareFunction) {
        this.compareFunction = compareFunction;
        this.contents = [];
    }

    enqueue(element) {
        this.contents.push(element);
    }

    dequeue() {
        this.contents.sort(this.compareFunction);
        const removedElement = this.contents.splice(this.contents.length - 1)[0];
        return removedElement;
    }

    contains(element) {
        return this.contents.includes(element);
    }

    isEmpty() {
        return this.contents.length === 0;
    }

    print() {
        this.contents.sort(this.compareFunction);
        console.log(this.contents);
    }
}

class Coords {
    constructor(rowOffset, colOffset) {
        this.r = rowOffset;
        this.c = colOffset;
    }

    equals(offset) {
        return this.r === offset.r && this.c === offset.c;
    }

    minus(offset) {
        return new Coords(this.r - offset.r, this.c - offset.c);
    }
}

class Alignment {
    constructor(offset, score) {
        this.offset = offset;
        this.score = score;
    }
}

const TOP = new Coords(-1, 0);
const LEFT = new Coords(0, -1);
const DIAG = new Coords(-1, -1);
const NONE = new Coords(0, 0);

function needlemanWunsch(sequence1, sequence2, match = 1, mismatch = -1, gap = -2) {
    const numRows = sequence1.length + 1;
    const numCols = sequence2.length + 1;
    let alignmentGrid = new Array(numRows);

    for (let r = 0; r < numRows; r++) {
        alignmentGrid[r] = new Array(numCols);
        alignmentGrid[r][0] = [new Alignment(TOP, -2 * r)];
    }
    for (let c = 0; c < numCols; c++) {
        alignmentGrid[0][c] = [new Alignment(LEFT, -2 * c)];
    }

    alignmentGrid[0][0] = [new Alignment(NONE, 0)];

    for (let r = 1; r < numRows; r++) {
        for (let c = 1; c < numCols; c++) {
            const topAlignment = new Alignment(TOP, alignmentGrid[r + TOP.r][c + TOP.c][0].score + gap);
            const leftAlignment = new Alignment(LEFT, alignmentGrid[r + LEFT.r][c + LEFT.c][0].score + gap);

            const charsMatch = (sequence1[r - 1] === sequence2[c - 1]);
            const diagAlignment = new Alignment(
                DIAG,
                alignmentGrid[r + DIAG.r][c + DIAG.c][0].score + (charsMatch ? match : mismatch)
            );

            const bestAlignments = getBestAlignments([diagAlignment, topAlignment, leftAlignment]);

            alignmentGrid[r][c] = bestAlignments;
        }
    }

    // console.log(alignmentGridToString(alignmentGrid));

    const bestPathPositions = dijkstra(alignmentGrid);

    // sequence1 -> sequence2
    const edits = new Array(sequence1.length);
    for (let i = 0; i < sequence1.length; i++) {
        edits[i] = [];
    }
    for (let i = 1; i < bestPathPositions.length; i++) {
        // const positionDiff = bestPathPositions[i].minus(bestPathPositions[i + 1]);
        sequence1Index = bestPathPositions[i].r - 1;
        sequence2Index = bestPathPositions[i].c - 1;
        edits[sequence1Index].push(sequence2Index);
    }

    // console.log(edits);

    return edits;
}

function getBestAlignments(alignments) {
    alignments.sort((a, b) => b.score - a.score);

    let bestAlignments = [];
    for (const alignment of alignments) {
        if (alignments[0].score > alignment.score) {
            break;
        }

        bestAlignments.push(alignment);
    }

    return bestAlignments;
}

function dijkstra(alignmentGrid, reverse = false) {
    const queue = new SimplePriorityQueue((a, b) => b.distance - a.distance);

    const graphMatrix = new Array(alignmentGrid.length);

    for (let r = 0; r < alignmentGrid.length; r++) {
        graphMatrix[r] = new Array(alignmentGrid[0].length);
        for (let c = 0; c < alignmentGrid[0].length; c++) {
            const alignments = alignmentGrid[r][c];

            let edges = [];
            for (const alignment of alignments) {
                if (alignment.offset !== NONE) {
                    edges.push(new Edge(
                        graphMatrix[r + alignment.offset.r][c + alignment.offset.c],
                        -alignment.score
                    ));
                }
            }

            const vertex = new Vertex(edges, new Coords(r, c));

            graphMatrix[r][c] = vertex;
        }
    }

    const source = graphMatrix[graphMatrix.length - 1][graphMatrix[0].length - 1];
    source.distance = 0;
    queue.enqueue(source);

    const history = [];

    while (!queue.isEmpty()) {
        const vertex = queue.dequeue();
        history.push(vertex);

        for (const edge of vertex.edges) {
            const neighbor = edge.destination;
            const newDistance = vertex.distance + edge.cost;
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.previous = vertex;
            }

            if (!queue.contains(neighbor)) {
                queue.enqueue(neighbor);
            }
        }
    }

    const solutionPositions = [];
    let vertex = graphMatrix[0][0];
    while (vertex !== undefined) {
        solutionPositions.push(vertex.position);
        vertex = vertex.previous;
    }
    if (reverse) {
        solutionPositions.reverse();
    }

    return solutionPositions;
}

// .....;
// ;\ | ;
// ;~-10;
function alignmentGridToString(alignmentGrid) {
    let strings = new Array(alignmentGrid.length * 2);

    for (let r = 0; r < alignmentGrid.length; r++) {
        strings[r * 2] = '';
        strings[r * 2 + 1] = '';
        for (let c = 0; c < alignmentGrid[0].length; c++) {
            let diag = false;
            let top = false;
            let left = false;
            for (const alignment of alignmentGrid[r][c]) {
                if (alignment.offset === DIAG) {
                    diag = true;
                }
                else if (alignment.offset === TOP) {
                    top = true;
                }
                else if (alignment.offset === LEFT) {
                    left = true;
                }
            }

            strings[r * 2] += diag ? '\\' : ' ';
            strings[r * 2] += ' ';
            strings[r * 2] += top ? '|' : ' ';
            strings[r * 2] += ' ';

            strings[r * 2 + 1] += left ? '~' : ' ';

            strings[r * 2 + 1] += (alignmentGrid[r][c][0].score + "").padStart(3, " ");
        }
    }

    return strings.join('\n');
}