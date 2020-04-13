import React, { useState } from 'react';
import TabularView from './TabularView';
import SchematicView from './SchematicView';


function View(props) {
    return <div>
        <div className="title">Cerberus Simulator</div>
        <SchematicView {...props} />
        <TabularView {...props} />
    </div>;
}

export default View;