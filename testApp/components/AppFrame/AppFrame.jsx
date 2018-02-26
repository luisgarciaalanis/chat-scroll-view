import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AppFrame.scss';

class AppFrame extends Component {
    render() {
        return (
            <div>
                <div className="app-frame">
                    { this.props.children }
                </div>
            </div>
        );
    }
}

AppFrame.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppFrame;
