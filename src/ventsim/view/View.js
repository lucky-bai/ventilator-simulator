import React, { useState, useRef } from 'react';
import TabularView from './TabularView';
import SchematicView from './SchematicView';


function View(props) {
    let tooltipRef = useRef(null);
    if (!tooltipRef.current) {
        tooltipRef.current = document.createElement("div");
    }

    return <div>
        <div className="title">Cerberus Simulator</div>
        {<SchematicView {...props} tooltipRef={tooltipRef} />}
        <TabularView {...props} tooltipRef={tooltipRef} />
        <div className="tooltips" ref={(e) => {
            if (e) {
                e.appendChild(tooltipRef.current);
            } else {
                tooltipRef.current.parentNode.removeChild(tooltipRef.current);
            }
        }} />
    </div>;
}

export default View;