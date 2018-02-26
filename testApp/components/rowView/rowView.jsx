import React, { Component } from 'react';
import PropTypes from 'prop-types';

class rowView extends Component {
    render() {
        return (
            <div>
                <div>[{this.props.data.date}]</div>
                <div>{this.props.data.lorem}</div>
            </div>
        );
    }
}

rowView.propTypes = {
    data: PropTypes.shape({
        lorem: PropTypes.string.isRequired,
        date: PropTypes.number.isRequired,
    }).isRequired,
};

export default rowView;
