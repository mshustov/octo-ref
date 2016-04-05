import React from 'react';

const Radio = (props, ctx)=>{
    const {name, checked, value} = props;

    return (
        <label className="radio">
            <input
                type="radio"
                name={name}
                checked={checked}
                onClick={()=>props.onClick(value)}
            />
            {value}
        </label>
    );
}

export default Radio;
