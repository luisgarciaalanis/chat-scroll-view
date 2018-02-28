import React from 'react';
import PropTypes from 'prop-types';
import './ScrollBox.scss';

const ScrollBox = (props) => (
    <div className="scroll-box">
        <div className="drag-handle" />
        {props.children}
    </div>
);

ScrollBox.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ScrollBox;
