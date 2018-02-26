
import loremIpsum from 'lorem-ipsum';
import guid from 'guid';

export const TimeInMilliseconds = {
    HaldSecond: 500,
    OneSecond: 1000,
    TwoSeconds: 2000,
};

class LoremDataSource {
    constructor(maxTimeInterval, backBufferSize) {
        this.dataItems = [];
        this.maxTimeInterval = maxTimeInterval;
        this.mockStream = this.mockStream.bind(this);
        this.fakeDataAtom = this.fakeDataAtom.bind(this);
        this.timeToNextDataAtom = this.timeToNextDataAtom.bind(this);
        this.findElementIndex = this.findElementIndex.bind(this);
        this.fetchPrevious = this.fetchPrevious.bind(this);
        this.fetchNext = this.fetchNext.bind(this);
        this.subscribe = this.subscribe.bind(this);

        this.callbacks = new Map();
        this.generateBackBuffer(backBufferSize);
        this.mockStream();
    }

    generateBackBuffer(backBufferSize) {
        for (let x = 0; x < backBufferSize; x++) {
            const dataItem = this.fakeDataAtom();
            this.dataItems.push(dataItem);
        }
    }

    /**
     * Subscribe to the data stream
     *
     * @param {function} callback function to be called when data is fetched
     * @returns {function} function to be called to unsubscribe to the stream
     */
    subscribe(callback) {
        const token = guid.raw();
        this.callbacks.set(token, callback);

        return () => {
            this.callbacks.delete(token);
        };
    }

    fakeDataAtom() {
        const lorem = loremIpsum({
            count: 1,
            units: 'sentences',
            sentenceLowerBound: 5,
            sentenceUpperBound: 22,
        });

        return {
            date: Date.now(),
            lorem,
        };
    }

    timeToNextDataAtom() {
        return Math.floor(Math.random() * this.maxTimeInterval) + TimeInMilliseconds.HaldSecond;
    }

    mockStream() {
        setTimeout(() => {
            const dataItem = this.fakeDataAtom();
            this.dataItems.push(dataItem);
            this.callbacks.forEach((callback) => {
                if (callback) {
                    callback(dataItem);
                }
            });
            this.mockStream();
        }, this.timeToNextDataAtom());
    }

    findElementIndex(item) {
        let foundItemIndex = -1;
        for (let index = 0; index < this.dataItems.length; index++) {
            if (this.dataItems[index] === item) {
                foundItemIndex = index;
                break;
            }
        }

        return foundItemIndex;
    }

    async fetchPrevious(item, maxItems) {
        let itemsFetched = [];
        const foundItemIndex = this.findElementIndex(item);

        if (foundItemIndex >= 0) {
            let head = foundItemIndex - maxItems;
            head = head < 0 ? 0 : head;
            itemsFetched = this.dataItems.slice(head, foundItemIndex);
        }

        return itemsFetched;
    }

    fetchNext(item, maxItems) {
        let itemsFetched = [];
        const foundItemIndex = this.findElementIndex(item);

        if (foundItemIndex >= 0) {
            itemsFetched = this.dataItems.slice(foundItemIndex, foundItemIndex + maxItems);
        }

        return itemsFetched;
    }
}

export default LoremDataSource;
