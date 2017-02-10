import * as React from 'react';
import { CompactPicker } from 'react-color';
import syncer from '../lib/sync-storage'
import { controls } from '../lib/utils';

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
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    componentDidMount() {
        syncer.getData('octoRef', (data) => this.setState({ data }));
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

    handleColorChange(prop, value){
        this.handleClose();

        var newValue = Object.assign({}, this.state.data, { [prop]: value });
        syncer.setData('octoRef', newValue, () => this.setState({data: newValue}));
    }

    render() {
        const {refColor, defColor} = this.state.data;
        return (
            <div className="container">
                <div>
                    <div><b>{controls.highlight.name} + Click</b> - highlight</div>
                    <div><b>{controls.jump.name} + Click</b> - jump to next usage place</div>
                    <div><b>{`${controls.highlight.name} + ${controls.jump.name}`} + Click</b> - jump to definition</div>
                </div>
                <div className="row" onClick={ this.handleColorClick.bind(null, 'defColor') }>
                    <span className="pallet" style={{backgroundColor: defColor}} >
                        Definition color
                    </span>
                </div>
                <div className="row" onClick={ this.handleColorClick.bind(null, 'refColor') }>
                    <span className="pallet" style={{backgroundColor: refColor}} >
                        Reference color
                    </span>
                </div>
                {this.state.displayColorPicker &&
                <CompactPicker
                    color={this.state.data[this.state.currentType]}
                    position="below"
                    onChange={color => this.handleColorChange(this.state.currentType, color.hex)}
                    onClose={this.handleClose}
                />
                }
            </div>
        );
    }
}

export default App;
