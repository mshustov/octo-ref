import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import Radiogroup from './radiogroup';
import Radio from './radio';

class App extends Component{
    constructor() {
        super(...arguments);
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
        // TODO change to sync? move to separate file
        chrome.storage.sync.get('gitTern', (data) => {
            this.setState({data: data.gitTern});
        });

        // this.setState({data: {
        //     refColor: 'ffee00',
        //     defColor: 'e6c8ec',
        //     control: 'alt',
        //     scroll: false
        // }})
    }

    handleColorClick(type) {
        this.state.currentType = type;
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    handleClose() {
        this.setState({ displayColorPicker: false });
    }

    handleChange(prop, value){
        var newValue = Object.assign({}, this.state.data, {[prop]: value});
        chrome.storage.sync.set({gitTern: newValue}, ()=>this.setState({data: newValue}));
        // this.setState({data: newValue})
    }

    render() {
        const {refColor, defColor, scroll, control} = this.state.data;
        return (
            <div className="container">
                <div className="row">
                    <Radiogroup
                        name="typeClick"
                        value={control}
                        options={['alt', 'shift', 'cmd']}
                        onChange={(value)=> this.handleChange('control', value)}
                    />
                    <span className="title">+ click</span>
                </div>
                <label className="row">
                    <input
                        type="checkbox"
                        checked={scroll}
                        onClick={()=>this.handleChange('scroll', !scroll)} />
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
                  color={ this.state.color }
                  position="below"
                  onChange={(color)=> {this.handleClose(); this.handleChange(this.state.currentType, color.hex)}}
                  onClose={ this.handleClose }
                />
                }
            </div>
        );
    }
}

export default App;
