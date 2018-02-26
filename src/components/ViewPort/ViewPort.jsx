import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ViewPort.scss';
import ScrollArea from '../ScrollArea/ScrollArea.jsx';

class ViewPort extends Component {
    constructor(props) {
        super(props);
        // props
        this.dataSource = this.props.config.dataSource;
        this.bufferSize = this.props.config.bufferSize;

        // binds
        this.onDataSourceUpdate = this.onDataSourceUpdate.bind(this);
        this.renderTopLoader = this.renderTopLoader.bind(this);

        // nodes
        this.node = null;
        this.topLoaderNode = null;

        // members
        this.stateToggle = false;
        this.lines = [];
        this.shouldScrollBottom = false;
        this.appendOnSubscriptionUpdates = true;
        this.oldScrollHeight = 0;
        this.oneFetch = true;

        this.unsubscribe = this.dataSource.subscribe(this.onDataSourceUpdate);

        /*
        for (let x = 0; x < 5; x++) {
            this.lines.push(`${x} - Arglebagle glop glyf!!!!!`);
        }
        */
    }

    componentDidMount() {
        // this.node.scrollTop = this.node.scrollHeight;
    }

    componentWillUpdate() {
        // const { node } = this;
        // this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight;
    }

    componentDidUpdate() {
        // const { node } = this;

        if (this.shouldLoadPrev() && this.oneFetch) {
            this.fetchPreviousRows();
            this.oneFetch = false;
            // this.node.scrollTop = this.topLoaderNode.offsetHeight;
        }

        // node.oldScrollHeight = node.scrollTop;
        // if (this.shouldScrollBottom) {
        //     node.scrollTop = node.scrollHeight;
        // }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onDataSourceUpdate(data) {
        // remove head element if buffer is full
        if (this.isBufferFull()) {
            this.lines.splice(0, 1);
        }

        // append element only if viewPort at bottom of stream
        if (this.appendOnSubscriptionUpdates) {
            this.lines.push(data);
        }

        this.setState({
            stateToggle: !this.stateToggle,
        });
    }

    shouldLoadPrev() {
        const result = false;
        // if (this.topLoaderNode) {
        //     const topLoaderThreshold = this.topLoaderNode.offsetHeight / 2;
        //     result = (this.node.scrollTop < topLoaderThreshold);
        // }

        return result;
    }

    async fetchPreviousRows() {
        let itemsCount = Math.floor(this.bufferSize / 3);
        const fetchedRows = await this.dataSource.fetchPrevious(this.lines[0], itemsCount);
        itemsCount = fetchedRows.length;

        if (itemsCount > 0) {
            const countDelta = this.lines.length - itemsCount;
            const removeIndex = (countDelta >= 0) ? countDelta : 0;

            this.lines.unshift(...fetchedRows);
            this.lines.splice(removeIndex, itemsCount);

            console.log('LOADING PREV');
            console.log(fetchedRows);
            this.setState({
                stateToggle: !this.stateToggle,
            });
        }
    }

    isViewportScrolled() {
        const { node } = this;
        return node && (this.node.scrollHeight > node.offsetHeight);
    }

    isBufferFull() {
        return this.lines.length > this.bufferSize;
    }

    renderLines() {
        const Cell = this.props.config.rowView;
        const cachedLinesCount = this.lines.length;
        let index = 0;
        // const lineBufferCount = 15;
        // const maxLines = lineCount > lineBufferCount ? lineBufferCount : lineCount;
        // let index = lineCount - maxLines;

        const linesToRender = [];

        for (; index < cachedLinesCount; index++) {
            linesToRender.push((<Cell key={index} data={this.lines[index]} />));
        }

        return linesToRender;
    }

    renderTopLoader() {
        let topLoader = '';
        if (this.isViewportScrolled()) {
            topLoader = <div className="top-loader" ref={(node) => { this.topLoaderNode = node; }} />;
        }

        return topLoader;
    }

    render() {
        const lines = this.renderLines();
        // const topLoader = this.renderTopLoader();

        return (
            <div className="view-port">
                <ScrollArea>
                    { lines }
                </ScrollArea>
            </div>
        );
    }
}

ViewPort.propTypes = {
    config: PropTypes.shape({
        rowView: PropTypes.func.isRequired,
        bufferSize: PropTypes.number.isRequired,
        dataSource: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            fetchPrevious: PropTypes.func.isRequired,
            fetchNext: PropTypes.func.isRequired,
        }),
    }).isRequired,
};

export default ViewPort;
