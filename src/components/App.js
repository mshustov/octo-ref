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
          defColor: '#f17013',
          refColor: '#ffeb24',
          data: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // TODO change to sync?
        // chrome.storage.local.get('gitTern', (data) => {
        //     this.setState({data});
        // });
    }

    handleClick(type) {
        this.state.currentType = type;
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    handleClose() {
        this.setState({ displayColorPicker: false });
    }

    _handleChange(color) {
        var colorType = this.state.currentType + 'Color'; // CLUDGE!!!
        this.setState({ 
            [colorType]: '#' + color.hex,
            displayColorPicker: false
        });

        // TODO change to sync?
        chrome.storage.local.get('gitTern', function(data) {
            data.gitTern.color[colorType] = color.hex;
            debugger;
            chrome.storage.local.set({gitTern: data.gitTern});
        });
    }

    handleChange(prop, value){
        console.log(prop, value);
    }

    render() {
        console.log(this.state);
        return (
            <div className="container">
                <div className="row">
                    <div className="row row_column" onClick={ this.handleClick.bind(null, 'def') }>
                        <div className="item title">Definition:</div>
                        <div className="item pallet" style={{backgroundColor: this.state.defColor}}>
                            {this.state.defColor}
                        </div>
                    </div>
                    <div className="row row_column" onClick={ this.handleClick.bind(null, 'ref') }>
                        <div className="item title">Refs:</div>
                        <div className="item pallet" style={{backgroundColor: this.state.refColor}}>
                            {this.state.refColor}
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
                        value="alt"
                        options={['alt', 'shift', 'cmd']}
                        onChange={(value)=> this.handleChange('clickType', value)}
                    />
                </div>
                <Radio isActive={this.state.scroll} value="Scroll to Definition"
                    onClick={()=>this.handleChange('scroll', !this.state.props)}
                />
            </div>
        );
    }
}

export default App;
