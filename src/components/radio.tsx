import * as React from 'react';

interface Props {
    name: string,
    checked: boolean,
    value: string,
    onChange: (value: string) => void
}

const Radio: React.StatelessComponent<Props> = (props, ctx) => (
    <label className="radio">
        <input
            type="radio"
            name={props.name}
            checked={props.checked}
            onChange={()=>props.onChange(props.value)}
        />
        {props.value}
    </label>
);

export default Radio;
