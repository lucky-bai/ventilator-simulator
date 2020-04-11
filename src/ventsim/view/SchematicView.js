import React, { useState } from 'react';
import raw from 'raw.macro';

function SchematicView(props) {

    let svgData = {__html: raw("./schematic.svg")}

    return <div>
        <div className="svg" dangerouslySetInnerHTML={svgData} />
    </div>;
}

export default SchematicView;