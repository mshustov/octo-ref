import React from 'react';
import classnames from 'classnames';

const Radio = (props, ctx)=>{
    const classes = classnames('radio', {
        'radio_active': props.isActive
    });

    return (
        <div className={classes} onClick={()=>props.onClick(props.value)}>
            {props.value}
        </div>
    );
}

export default Radio;
