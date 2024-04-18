function fifo(pages, size) {
    let frametable = [];
    let queue = new Array(size).fill(null);
    let loadedpages = {};
    let pagehits = 0;
    let pagefaults = 0;
    let baseptr = 0;

    for(let page of pages) {
        if(!loadedpages[page]) {
            if(queue[baseptr] !== null) {
                delete loadedpages[queue[baseptr]];
            }
            loadedpages[page] = true;
            queue[baseptr] = page;
            baseptr = (baseptr + 1) % size;
            pagefaults++;
        } else {
            pagehits++;
        }

        frametable.push([...queue]);
    }

    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    };
}

function optimal(pages, size) {
    let frametable = []
    let queue = new Array(size+1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0
    for(let pageindex in pages) {
        const page = pages[pageindex]
        if(queue[size-1]==undefined) {
            if(loadedpages[page]==undefined) {
                queue[baseptr] = page
                loadedpages[page] = baseptr
                pagefaults++
                baseptr++
                queue[size] = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
            }
        }
        else {
            if(loadedpages[page]==undefined) {
                let newarr = pages.slice(pageindex)
                let unusedpage = null
                for(let i=0; i<size; i++) {
                    if(newarr.indexOf(queue[i])==-1) {
                        unusedpage = queue[i]
                        break
                    }
                    else {
                        unusedpage = newarr.indexOf(queue[i]) > newarr.indexOf(unusedpage) ? queue[i] : unusedpage
                    }
                }
                baseptr = Number(loadedpages[unusedpage])
                queue[baseptr] = page
                delete loadedpages[unusedpage]
                loadedpages[page] = baseptr
                pagefaults++
                queue[size] = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
            }
        }
        frametable.push([...queue])
    }
    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    }
}

function leastRecentlyUsed(pages, size) {
    let frametable = [];
    let queue = new Array(size).fill(null);
    let loadedpages = {};
    let pagehits = 0;
    let pagefaults = 0;
    let baseptr = 0;

    for(let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if(!loadedpages[page]) {
            if(queue[baseptr] !== null) {
                delete loadedpages[queue[baseptr]];
            }
            loadedpages[page] = true;
            queue[baseptr] = page;
            pagefaults++;

            baseptr = queue.findIndex(p => loadedpages[p] && p !== page);
        } else {
            pagehits++;
        }

        frametable.push([...queue]);
    }

    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    };
}

function leastFrequentlyUsed(pages, size) {
    let frametable = [];
    let queue = new Array(size).fill(null);
    let loadedpages = {};
    let pagehits = 0;
    let pagefaults = 0;
    let pageFrequencies = {};
    let baseptr = 0;

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Update page frequency
        pageFrequencies[page] = (pageFrequencies[page] || 0) + 1;

        if (!loadedpages[page]) {
            if (queue[baseptr] !== null) {
                delete loadedpages[queue[baseptr]];
            }
            loadedpages[page] = true;
            queue[baseptr] = page;
            pagefaults++;

            // Find the least frequently used page
            let leastFrequentPage = queue[0];
            for (let j = 1; j < size; j++) {
                if (pageFrequencies[queue[j]] < pageFrequencies[leastFrequentPage]) {
                    leastFrequentPage = queue[j];
                }
            }

            baseptr = queue.findIndex(p => p === leastFrequentPage);
        } else {
            pagehits++;
        }

        frametable.push([...queue]);
    }

    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    };
}


module.exports = {
    fifo,
    optimal,
    leastRecentlyUsed,
    leastFrequentlyUsed
}