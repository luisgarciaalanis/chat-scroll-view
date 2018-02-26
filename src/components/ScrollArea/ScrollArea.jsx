import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ScrollArea.scss';

class ScrollArea extends Component {
    constructor(props) {
        super(props);

        // binds
        this.onScrollbarMouseDown = this.onScrollbarMouseDown.bind(this);
        this.onScrollbarMouseUp = this.onScrollbarMouseUp.bind(this);
        this.onScrollbarMouseMove = this.onScrollbarMouseMove.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.getScrollbarHeight = this.getScrollbarHeight.bind(this);
        this.getScrollableHeight = this.getScrollableHeight.bind(this);
        this.calculateThumbSize = this.calculateThumbSize.bind(this);
        this.getScrollbarPercentage = this.getScrollbarPercentage.bind(this);
        this.getScrollablePercentage = this.getScrollablePercentage.bind(this);
        this.getThumbTop = this.getThumbTop.bind(this);
        this.getThumbHeight = this.getThumbHeight.bind(this);

        // UI refs
        this.scrollArea = null;
        this.scrollable = null;
        this.scrollbar = null;
        this.thumb = null;

        // members
        this.oldPageY = 0;
        this.minThumbSize = 50;
    }

    componentDidMount() {
        this.thumb.style.top = '0px';
        this.calculateThumbSize();
        this.updateScrollbarTopFromScrollable();
    }

    componentWillUpdate() {
        this.oldScrollHeight = this.scrollable.scrollHeight;
        this.shouldScrollBottom = (this.scrollable.scrollTop + this.scrollable.offsetHeight) === this.scrollable.scrollHeight;
    }

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            this.scrollable.scrollTop = this.scrollable.scrollHeight;
        }
        this.updateScrollbarTopFromScrollable();
    }

    /**
     * Mouse events
     */

    onScrollbarMouseDown(event) {
        this.oldPageY = event.pageY;

        window.addEventListener('mouseup', this.onScrollbarMouseUp);
        window.addEventListener('mousemove', this.onScrollbarMouseMove);
        this.oldMouseY = event.clientY;

        event.preventDefault();
    }

    onScrollbarMouseUp(event) {
        event.preventDefault();

        window.removeEventListener('mouseup', this.onScrollbarMouseUp);
        window.removeEventListener('mousemove', this.onScrollbarMouseMove);
    }

    onScrollbarMouseMove(event) {
        const moveDelta = event.clientY - this.oldMouseY;
        const thumbMaxTop = this.getThumbMaxScrollTop();
        const oldTop = parseInt(this.thumb.style.top, 10);
        let newThumbTop = oldTop + moveDelta;
        const scrollBarClientPos = this.scrollbar.getBoundingClientRect();
        const yPosFromScrollbarTop = event.clientY - scrollBarClientPos.top;

        // event.preventDefault();

        if (this.thumbAtBoundary && (yPosFromScrollbarTop < 0)) {
            return;
        }

        if (this.thumbAtBoundary && (event.clientY > scrollBarClientPos.bottom)) {
            return;
        }

        if (newThumbTop <= 0) {
            this.thumbAtBoundary = true;
            newThumbTop = 0;
        } else if (newThumbTop >= thumbMaxTop) {
            this.thumbAtBoundary = true;
            newThumbTop = thumbMaxTop;
            this.bla = thumbMaxTop;
        } else {
            this.thumbAtBoundary = false;
            this.bla = 0;
        }

        this.setThumbTop(newThumbTop);
        this.oldMouseY = event.clientY;
        this.updateScrollableTopFromScrollbar();
    }

    onWheel(event) {
        this.updateScrollableTop(event.deltaY);
    }

    setThumbTop(top) {
        this.thumb.style.top = `${top}px`;
    }

    getScrollbarHeight() {
        return this.scrollbar.clientHeight;
    }

    getScrollableHeight() {
        return parseInt(this.scrollable.scrollHeight, 10);
    }

    getThumbTop() {
        return parseInt(this.thumb.style.top, 10);
    }

    getThumbHeight() {
        return parseInt(this.thumb.style.height, 10);
    }

    getThumbMaxScrollTop() {
        return this.scrollbar.clientHeight - this.getThumbHeight();
    }

    getMaxScrollTop() {
        return this.scrollable.scrollHeight - this.scrollable.clientHeight;
    }

    calculateThumbSize() {
        const scrollbarHeight = this.getScrollbarHeight();
        const scrollableHeight = this.getScrollableHeight();
        const thumbSizeRatio = scrollbarHeight / scrollableHeight;

        if (thumbSizeRatio >= 1) {
            this.thumbSize = scrollbarHeight;
        } else {
            const thumbSizePixels = Math.floor(thumbSizeRatio * scrollbarHeight);
            this.thumbSize = thumbSizePixels < this.minThumbSize ? this.minThumbSize : thumbSizePixels;
        }

        this.thumb.style.height = `${this.thumbSize}px`;
    }

    getScrollbarPercentage() {
        const scrollbarMovableDistance = this.scrollbar.clientHeight - this.thumb.clientHeight;

        return this.getThumbTop() / scrollbarMovableDistance;
    }

    getScrollablePercentage() {
        const scrollableDistance = this.getMaxScrollTop();

        return this.scrollable.scrollTop / scrollableDistance;
    }

    updateScrollableTop(pixels) {
        const maxScrollTop = this.getMaxScrollTop();
        let newScrollTop = this.scrollable.scrollTop + pixels;
        if (newScrollTop < 0) {
            newScrollTop = 0;
        } else if (newScrollTop > maxScrollTop) {
            newScrollTop = maxScrollTop;
        }
        this.scrollable.scrollTop = newScrollTop;
        this.updateScrollbarTopFromScrollable();
    }

    updateScrollableTopFromScrollbar() {
        const scrollPercentage = this.getScrollbarPercentage();
        const maxScrollTop = this.getMaxScrollTop();
        const newScrollTop = Math.floor(maxScrollTop * scrollPercentage);
        this.scrollable.scrollTop = newScrollTop;
    }

    updateScrollbarTopFromScrollable() {
        this.calculateThumbSize();
        const scrollablePercentage = this.getScrollablePercentage();
        const maxThumScrollTop = this.getThumbMaxScrollTop();
        const newScrollTop = Math.floor(maxThumScrollTop * scrollablePercentage);
        this.setThumbTop(newScrollTop);
    }

    scrollToBottom() {
        this.scrollable.scrollTop = this.scrollable.scrollHeight;
        this.updateScrollbarTopFromScrollable();
    }

    render() {
        return (
            <div className="scroll-area" ref={(scrollArea) => { this.scrollArea = scrollArea; }} onWheel={this.onWheel}>
                <div className="scrollbar-bar" ref={(scrollbar) => { this.scrollbar = scrollbar; }} >
                    <div className="scrollbar-thumb" ref={(thumb) => { this.thumb = thumb; }} onMouseDown={this.onScrollbarMouseDown} />
                </div>
                <div className="scrolled-content" ref={(node) => { this.scrollable = node; }} onScroll={this.onScroll} onMouseMove={this.onMouseMove}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

ScrollArea.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ScrollArea;
