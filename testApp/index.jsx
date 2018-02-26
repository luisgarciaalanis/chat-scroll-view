import React from 'react';
import ReactDOM from 'react-dom';
import AppFrame from './components/AppFrame/AppFrame.jsx';
import ViewPort from '../src/components/ViewPort/ViewPort.jsx';
import rowView from './components/rowView/rowView.jsx';
import ViewContainer from './components/ViewContainer/ViewContainer.jsx';
import LoremDataSource, { TimeInMilliseconds } from './services/LoremDataSource';
import './index.scss';

const createContainers = () => {
    const viewContainers = [];

    const videPortConfig = [
        {
            index: 321,
            maxTimeInterval: TimeInMilliseconds.HaldSecond,
            bufferSize: 100,
            backBufferSize: 200,
        },
        // {
        //     index: 111,
        //     maxTimeInterval: TimeInMilliseconds.OneSecond,
        //     bufferSize: 75,
        //     backBufferSize: 0,
        // },
        // {
        //     index: 222,
        //     maxTimeInterval: TimeInMilliseconds.OneSecond,
        //     bufferSize: 50,
        //     backBufferSize: 0,
        // },
    ];
    videPortConfig.forEach((config) => {
        const viewPortConfig = {
            rowView,
            dataSource: new LoremDataSource(config.maxTimeInterval, config.backBufferSize),
            bufferSize: config.bufferSize,
        };

        viewContainers.push((
            <ViewContainer key={config.index}>
                <ViewPort config={viewPortConfig} />
            </ViewContainer>
        ));
    });

    return viewContainers;
};

ReactDOM.render(
    <AppFrame>
        {createContainers()}
    </AppFrame>,
    document.getElementById('app'),
);
