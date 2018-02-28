import React, { Component } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import LoremDataSource, { TimeInMilliseconds } from '../services/LoremDataSource';
import rowView from '../components/rowView/rowView.jsx';
import ScrollArea from '../../src/components/ScrollArea/ScrollArea.jsx';
import ScrollBox from '../components/ScrollBox/ScrollBox.jsx';

import './App.scss';

const ReactGridLayout = WidthProvider(RGL);

class App extends Component {
    static defaultProps = {
        className: 'layout',
        items: 20,
        rowHeight: 200,
        onLayoutChange: () => {},
        cols: 12,
    };

    constructor(props) {
        super(props);

        this.layout = [];
        this.containers = this.createContainers();
    }

    createContainers() {
        const viewContainers = [];

        const videPortConfig = [
            {
                index: 321,
                maxTimeInterval: TimeInMilliseconds.HaldSecond,
                bufferSize: 100,
                backBufferSize: 200,
            },
            {
                index: 111,
                maxTimeInterval: TimeInMilliseconds.OneSecond,
                bufferSize: 75,
                backBufferSize: 0,
            },
            // {
            //     index: 222,
            //     maxTimeInterval: TimeInMilliseconds.OneSecond,
            //     bufferSize: 50,
            //     backBufferSize: 0,
            // },
        ];

        videPortConfig.forEach((config, index) => {
            const key = index;
            const numWithCols = 4;
            const x = index * numWithCols;
            const viewPortConfig = {
                rowView,
                dataSource: new LoremDataSource(config.maxTimeInterval, config.backBufferSize),
                bufferSize: config.bufferSize,
            };

            this.layout.push({
                i: index.toString(), x, y: 0, w: numWithCols, h: 2, minW: 2,
            });

            viewContainers.push((
                <div className="draggable-handle" key={key}>
                    <ScrollBox>
                        <ScrollArea config={viewPortConfig} />
                    </ScrollBox>
                </div>
            ));
        });

        return viewContainers;
    }

    render() {
        return (
            <div className="app-main">
                <ReactGridLayout
                    layout={this.layout}
                    draggableHandle=".draggable-handle"
                    draggableCancel=".scroll-area"
                    compactType="vertical"
                    {...this.props}
                >
                    {this.containers}
                </ReactGridLayout>
            </div>
        );
    }
}

export default App;
