import React, { useState } from 'react';
import { createPopper } from '@popperjs/core';
import ReactDOM from 'react-dom';

export default class VariableTooltip extends React.Component {

    setUpTooltip(tooltip, elm) {
        this.tooltip = this.tooltip || tooltip;
        this.elm = this.elm || elm;

        if (this.tooltip == null || this.elm == null) {
            return;
        }

        this.popperInstance = createPopper(this.elm, this.tooltip, { placement: 'top' });

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
      }

    showTooltip() {
        this.tooltip.setAttribute('data-show', '');
    }


    render() {
        let variable = this.props.variable;

        return <div ref={(e) => this.setUpTooltip(null, e)}>
            {ReactDOM.createPortal(<div className="variable-name-tooltip" ref={(e) => this.setUpTooltip(e)}>
                <div>{variable.desc}</div>
                {variable.range ? 
                    <div className="range">{variable.range[0]}-{variable.range[1]} {variable.unit}</div>
                    : null}
                <div className="arrow" data-popper-arrow></div>
            </div>, this.props.tooltipRef.current)}
            
            {this.props.children}
        </div>
    };
}
