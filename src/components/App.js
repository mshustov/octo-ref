import React, { Component } from 'react';
import { CompactPicker } from 'react-color';

class App extends Component{
    constructor() {
        super();
        this.state = {
          displayColorPicker: false,
          currentType: null,
          defColor: '#f17013',
          refColor: '#ffeb24'
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(type) {
        this.state.currentType = type;
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    handleClose() {
        this.setState({ displayColorPicker: false });
    }

    handleChange(color) {
        var colorType = this.state.currentType + 'Color'; // CLUDGE!!!
        this.setState({ 
            [colorType]: '#' + color.hex,
            displayColorPicker: false
        });

        const defaultSettings = {
            color: {
                refColor: '#ffee00',
                defColor: '#e6c8ec'
            },
            control: 'alt',
            scroll: false
        };

        // TODO change to sync?
        chrome.storage.local.get('gitTern', function(data) {
            data.gitTern.color[colorType] = color.hex;
            debugger;
            chrome.storage.local.set({gitTern: data.gitTern});
        });
    }

    render() {
        console.log(this.state);
        return (
            <div>
                //FIXME move to separate component
                <div onClick={ this.handleClick.bind(null, 'def') }>
                    Definition: {this.state.defColor}
                </div>
                <div onClick={ this.handleClick.bind(null, 'ref') }>
                    Refs: {this.state.refColor}
                </div>
                {this.state.displayColorPicker &&
                <CompactPicker
                  color={ this.state.color }
                  position="below"
                  onChange={ this.handleChange }
                  onClose={ this.handleClose }
                />
                }
            </div>
        );
    }
}

export default App;
