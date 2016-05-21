import * as React from 'react';
import Radio from './radio';

interface Props {
    name: string,
    value: string,
    onChange: (value: string) => void,
    options: string[]
}

const Radiogroup: React.StatelessComponent<Props> = (props, ctx) => {
    const handleChange = (value) => (value !== props.value) && props.onChange(value);
    return (
        <span>
            {
                props.options.map((value) =>
                    <Radio
                        name={props.name}
                        key={value}
                        checked={value===props.value}
                        onChange={handleChange}
                        value={value}
                    />
                )
            }
        </span>
    );
}

export default Radiogroup;
