import React from 'react';
import classnames from 'classnames';
import Radio from './radio';

const Radiogroup = (props, ctx)=>{
    const classes = classnames('radiogroup', props.classNames);
    const handleRadioChange = (value)=> (value !== props.value) && props.onChange(value);
    return (
        <div className={classes}>
            {
                props.options.map((val) =>
                    <Radio value={val} key={val} isActive={val===props.value} onClick={handleRadioChange} />
                )
            }
        </div>
    );
}

export default Radiogroup;
