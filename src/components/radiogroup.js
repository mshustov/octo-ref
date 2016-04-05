import React from 'react';
import Radio from './radio';

const Radiogroup = (props, ctx)=>{
    const handleChange = (value)=> (value !== props.value) && props.onChange(value);
    return (
        <span className={props.classes}>
            {
                props.options.map((value) =>
                    <Radio
                        name={props.name}
                        key={value}
                        checked={value===props.value}
                        onClick={handleChange}
                        value={value}
                        />
                )
            }
        </span>
    );
}

export default Radiogroup;
