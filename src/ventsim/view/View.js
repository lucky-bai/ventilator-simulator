import React, { useState } from 'react';
import TabularView from './TabularView';
import SchematicView from './SchematicView';


function View(props) {
    // mode: tabular | schematic
    const [mode, setMode] = useState('schematic');

    return <div>
        <div className="title">Cerberus Simulator</div>
        <div className="mode-switch">
            <div onClick={() => setMode('schematic')}>Schematic</div>
            <div onClick={() => setMode('tabular')}>Tabular</div>
        </div>
        {mode == 'tabular' ? <TabularView {...props} /> : <SchematicView {...props} />}
    </div>;
}

export default View;