/**
 * Directed graph edge
 */
class Edge {
    /**
     * Construct a directed graph edge
     * @param {Vertex} destination vertex that this edge goes to
     * @param {Number} cost cost of traversing this edge (higher is worse)
     */
    constructor(destination, cost) {
        this.destination = destination;
        this.cost = cost;
    }
}

/**
 * Graph vertex
 */
class Vertex {
    /**
     * Construct a graph vertex
     * @param {Edge[]} edges array of outgoing edges from this vertex
     * @param {Coords} position coords of N-W cell represented by this vertex
     * @param {Number} distance distance from source node for Dijkstra
     * @param {Vertex} previous previous vertex in shortest path for Dijkstra
     */
    constructor(edges, position, distance = Number.MAX_SAFE_INTEGER, previous = undefined) {
        this.edges = edges;
        this.position = position;
        this.distance = distance;
        this.previous = previous;
    }
}

/**
 * Very basic priority queue that sorts on dequeue.
 * Expensive, but it's fine for the tiny graphs we work with.
 */
class SimplePriorityQueue {
    /**
     * Construct a priority queue
     * @param {((a: never, b: never) => number)} compareFunction the function used to sort this priority queue
     */
    constructor(compareFunction = undefined) {
        this.compareFunction = compareFunction;
        this.contents = [];
    }

    /**
     * Add an element to this queue
     * @param {*} element the element to add
     */
    enqueue(element) {
        this.contents.push(element);
    }

    /**
     * Remove & return the first element in the queue
     * @returns the element removed from the queue
     */
    dequeue() {
        this.contents.sort(this.compareFunction);
        const removedElement = this.contents.splice(this.contents.length - 1)[0];
        return removedElement;
    }

    /**
     * Determine if the provided element is in the queue
     * @param {*} element the element to check for
     * @returns true if the element exists in the queue, false otherwise
     */
    contains(element) {
        return this.contents.includes(element);
    }

    /**
     * Determine if the queue is empty
     * @returns true if the queue is empty, false otherwise
     */
    isEmpty() {
        return this.contents.length === 0;
    }

    /**
     * Log the contents of the queue to the console; for debugging.
     */
    print() {
        this.contents.sort(this.compareFunction);
        console.log(this.contents);
    }
}

/**
 * Row/col coordinates in a 2D array, or an offset in the same.
 */
class Coords {
    /**
     * Construct a set of coordinates
     * @param {Number} r integer row index
     * @param {Number} c integer column index
     */
    constructor(r, c) {
        this.r = r;
        this.c = c;
    }

    /**
     * Determine whether this Coords has the same r/c as another Coords
     * @param {Coords} otherCoords the other Coords object to compare against
     * @returns true if the r & c of this Coords is the same as the other Coords, false otherwise
     */
    equals(otherCoords) {
        return this.r === otherCoords.r && this.c === otherCoords.c;
    }

    /**
     * Subtract the subtrahends r/c from this Coords r/c
     * @param {Coords} subtrahend Coords to subtract from this Coords
     * @returns new Coords object w/the subtracted Coords
     */
    minus(subtrahend) {
        return new Coords(this.r - subtrahend.r, this.c - subtrahend.c);
    }
}

/**
 * Element of N-W grid
 */
class Alignment {
    /**
     * Construct an alignment
     * @param {Coords} offset relative Coords of neighbor grid cell selected for max similar score
     * @param {Number} score integer N-W score
     */
    constructor(offset, score) {
        this.offset = offset;
        this.score = score;
    }
}

const TOP = new Coords(-1, 0);
const LEFT = new Coords(0, -1);
const DIAG = new Coords(-1, -1);
const NONE = new Coords(0, 0);

/**
 * 
 * @param {*} sequence1 
 * @param {*} sequence2 
 * @param {*} match 
 * @param {*} mismatch 
 * @param {*} gap 
 * @returns 
 */
function needlemanWunsch(sequence1, sequence2, match = 1, mismatch = -1, gap = -2) {
    // Init the alignment (similarity) grid
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

    // Fill out the alignment grid
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

    // Find a the best path through the alignment grid (highest score)
    const bestPathPositions = dijkstra(alignmentGrid);

    // Construct edits required to go from sequence1 to sequence2
    // Each subarray i contains the indexes of the sequence2 chars that sequence1 char i turns into
    const edits = new Array(sequence1.length);
    for (let i = 0; i < sequence1.length; i++) {
        edits[i] = [];
    }
    for (let i = 1; i < bestPathPositions.length; i++) {
        sequence1Index = bestPathPositions[i].r - 1;
        sequence2Index = bestPathPositions[i].c - 1;
        edits[sequence1Index].push(sequence2Index);
    }

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
                    console.log(-alignment.score);
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