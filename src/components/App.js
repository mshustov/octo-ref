import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import Radiogroup from './radiogroup';
import Radio from './radio';

class App extends Component{
    constructor() {
        super();
        this.state = {
          displayColorPicker: false,
          currentType: null,
          data: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // TODO change to sync? move to separate file
        chrome.storage.local.get('gitTern', (data) => {
            this.setState({data: data.gitTern});
        });
    }

    handleClick(type) {
        this.state.currentType = type;
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    handleClose() {
        this.setState({ displayColorPicker: false });
    }

    _handleChange(color) {
        var colorType = this.state.currentType;

        // TODO change to sync?
        chrome.storage.local.get('gitTern', function(data) {
            data.gitTern.color[colorType] = color.hex;
            debugger;
            chrome.storage.local.set({gitTern: data.gitTern});
        });
    }

    handleChange(prop, value){
        console.log('1', prop, value);
        var newValue = Object.assign({}, this.state.data, {[prop]: value});
        console.log('2', newValue);
        chrome.storage.local.set({gitTern: newValue}, ()=>this.setState({data: newValue}));
    }

    render() {
        console.log(this.state);
        return (
            <div className="container">
                <div className="row">
                    <div className="row row_column" onClick={ this.handleClick.bind(null, 'defColor') }>
                        <div className="item title">Definition:</div>
                        <div className="item pallet" style={{backgroundColor: `#${this.state.data.defColor}`}}>
                            {this.state.data.defColor}
                        </div>
                    </div>
                    <div className="row row_column" onClick={ this.handleClick.bind(null, 'refColor') }>
                        <div className="item title">Refs:</div>
                        <div className="item pallet" style={{backgroundColor: `#${this.state.data.refColor}`}}>
                            {this.state.data.refColor}
                        </div>
                    </div>
                </div>
                {this.state.displayColorPicker &&
                <CompactPicker
                  color={ this.state.color }
                  position="below"
                  onChange={(color)=> {this.handleClose(); this.handleChange(this.state.currentType, color.hex)}}
                  onClose={ this.handleClose }
                />
                }
                <div>
                    <div className="title">Click +</div>
                    <Radiogroup classNames="row"
                        name="typeClick"
                        value={this.state.data.control}
                        options={['alt', 'shift', 'cmd']}
                        onChange={(value)=> this.handleChange('control', value)}
                    />
                </div>
                <Radio isActive={this.state.scroll} value="Scroll to Definition"
                    onClick={()=>this.handleChange('scroll', !this.state.data.scroll)}
                />
            </div>
        );
    }
}

export default App;
