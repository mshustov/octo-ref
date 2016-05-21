/// <reference path="../../typings/vendors.d.ts" />

import * as React from 'react';
import { CompactPicker } from 'react-color';
import Radiogroup from './radiogroup';
import Radio from './radio';
import syncer from '../lib/sync-storage'
import * as objectAssign from 'object-assign';

interface AppState {
    displayColorPicker?: boolean,
    currentType?: string,
    data?: any
}

class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props);
        this.state = {
          displayColorPicker: false,
          currentType: null,
          data: {}
        };
        this.handleColorClick = this.handleColorClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        syncer.getData('octoRef', (data) => this.setState({ data: data.octoRef }));
    }

    handleColorClick(type) {
        this.setState({
            currentType: type,
            displayColorPicker: !this.state.displayColorPicker
        });
    }

    handleClose() {
        this.setState({ displayColorPicker: false });
    }

    handleChange(prop, value){
        var newValue = objectAssign({}, this.state.data, { [prop]: value });
        syncer.setData({octoRef: newValue}, () => this.setState({data: newValue}));
    }

    render() {
        const {refColor, defColor, scroll, control} = this.state.data;
        return (
            <div className="container">
                <div className="row">
                    <Radiogroup
                        name="typeClick"
                        value={control}
                        options={['alt', 'cmd']}
                        onChange={(value)=> this.handleChange('control', value)}
                    />
                    <span className="title">+ click</span>
                </div>
                <label className="row">
                    <input
                        type="checkbox"
                        checked={scroll}
                        onClick={() => this.handleChange('scroll', !scroll) }
                    />
                    <span className="title">Scroll to definition</span>
                </label>
                <div className="row" onClick={ this.handleColorClick.bind(null, 'defColor') }>
                    <span className="pallet" style={{backgroundColor: `#${defColor}`}} >
                        Definition color
                    </span>
                </div>
                <div className="row" onClick={ this.handleColorClick.bind(null, 'refColor') }>
                    <span className="pallet" style={{backgroundColor: `#${refColor}`}} >
                        Reference color
                    </span>
                </div>
                {this.state.displayColorPicker &&
                <CompactPicker
                    color={this.state.data[this.state.currentType]}
                    position="below"
                    onChange={(color) => { this.handleClose(); this.handleChange(this.state.currentType, color.hex) }}
                    onClose={this.handleClose}
                />
                }
            </div>
        );
    }
}

export default App;
