import React, { Fragment } from 'react';
import BigButton from '../components/BigButton';

export default function Control({buzz, muted}) {
    return (<Fragment> 
        <BigButton {...{buzz, muted}} />
    </Fragment>);
}