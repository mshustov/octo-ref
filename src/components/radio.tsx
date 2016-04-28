import * as React from 'react';

const Radio = (props, ctx) => (
    <label className="radio">
        <input
            type="radio"
            name={props.name}
            checked={props.checked}
            onClick={()=>props.onClick(props.value)}
        />
        {props.value}
    </label>
);

export default Radio;
