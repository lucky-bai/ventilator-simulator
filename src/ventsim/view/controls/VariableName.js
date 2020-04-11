import React, { useState } from 'react';
import { createPopper } from '@popperjs/core';

export default class VariableName extends React.Component {

    setUpTooltip(tooltip, elm) {
        this.tooltip = this.tooltip || tooltip;
        this.elm = this.elm || elm;

        if (this.tooltip == null || this.elm == null) {
            return;
        }

        
        const showEvents = ['mouseenter', 'focus'];
        const hideEvents = ['mouseleave', 'blur'];

        showEvents.forEach(event => {
            this.elm.addEventListener(event, this.showTooltip.bind(this));
        });

        hideEvents.forEach(event => {
            this.elm.addEventListener(event, this.destroyTooltip.bind(this));
        });
    }

    destroyTooltip() {
        this.tooltip.removeAttribute('data-show');
        if (this.popperInstance) {
          this.popperInstance.destroy();
          this.popperInstance = null;
        }
      }

    showTooltip() {
        this.tooltip.setAttribute('data-show', '');
        this.popperInstance = createPopper(this.elm, this.tooltip, { placement: 'top' });
    }


    render() {
        let variable = this.props.variable;

        var splitName = variable.key.split("_");
        let patientId = splitName.length == 2 ? splitName[1] : null;

        return <div>
            <div className="variable-name-tooltip" ref={(e) => this.setUpTooltip(e)}>
                {variable.desc}
                <div className="arrow" data-popper-arrow></div>
            </div>
            <div className="variable-name" ref={(e) => this.setUpTooltip(null, e)}>
                { patientId ? <div className="patient">Patient {patientId}</div> : null}
                <div>{splitName[0]}</div>
            </div>
        </div>
    };
}
