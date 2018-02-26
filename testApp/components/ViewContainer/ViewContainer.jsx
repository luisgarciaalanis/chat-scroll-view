import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ViewContainer.scss';

class ViewContainer extends Component {
    constructor(props) {
        super(props);
        this.fullscreen = false;

        this.onFullScreenClick = this.onFullScreenClick.bind(this);
    }

    onFullScreenClick() {
        if (!this.fullscreen) {
            this.positionBackup = this.node.style.position;
            this.node.style.position = 'absolute';
        } else {
            this.node.style.position = this.positionBackup;
        }

        this.fullscreen = !this.fullscreen;
        this.props.onFullscreen(this.fullscreen);
        this.setState({
            fullscreen: this.fullscreen,
        });
    }

    render() {
        return (
            <div className="view-container" ref={(node) => { this.node = node; }}>
                <div className="full-screen-button" tabIndex="0" role="button" onClick={this.onFullScreenClick} onKeyPress={this.handleKeyPress} >
                    <div className="icon-size-fullscreen" />
                </div>
                { this.props.children }
            </div>
        );
    }
}

ViewContainer.defaultProps = {
    onFullscreen: () => {},
};

ViewContainer.propTypes = {
    children: PropTypes.node.isRequired,
    onFullscreen: PropTypes.func,
};

export default ViewContainer;
