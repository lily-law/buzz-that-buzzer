import React from 'react';
import './BigButton.css';

export default function BigButton({buzz}) {
    return (<section>
         <button className="big-button" onMouseDown={buzz}></button>
    </section>);
}