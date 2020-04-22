import React, { useState } from 'react';
import { createPopper } from '@popperjs/core';
import ReactDOM from 'react-dom';

export default class VariableTooltip extends React.PureComponent {

    setUpTooltip(tooltip, elm) {
        this.tooltip = tooltip;
        this.elm = elm;

        if (this.tooltip == null || this.elm == null) {
            if (this.props.controlled == true && this.popperInstance != null) {
                this.popperInstance.destroy();
                this.popperInstance = null;
            }
            return;
        }

        if (this.props.controlled === true) {
            if (this.popperInstance == null) {
                this.popperInstance = createPopper(this.elm, this.tooltip, { placement: 'top' });
            }
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

        this.popperInstance = createPopper(this.elm, this.tooltip, { placement: 'top' });

        this.tooltip.setAttribute('data-show', '');
    }


    render() {
        let variable = this.props.variable;

        let tooltipName = "variable-name-tooltip " + (this.props.display === true ? "tooltip-show" : "");

        let renderTooltip = this.props.controlled === true ? (this.props.display) : true;

        let unit = variable.unit || "";
        var rangeLabel = null;
        if (variable.range[0] === null) {
            if (variable.range[1] === null) {
                rangeLabel = unit;
            } else {
                rangeLabel = "< " + variable.range[1] + " " + unit;
            }
        } else {
            if (variable.range[1] === null) {
                rangeLabel = "> " + variable.range[0] + " " + unit;
            } else {
                rangeLabel = variable.range[0] + " - " + variable.range[1] + " " + unit;
            }
        }

        if (variable.rangePerKgOfWeight) {
            rangeLabel += " per kg of weight";
        }

        return <div ref={(e) => this.setUpTooltip(this.tooltip, e)}>
            {renderTooltip ? ReactDOM.createPortal(<div className={tooltipName} ref={(e) => this.setUpTooltip(e, this.elm)}>
                <div>{variable.desc}</div>
                {variable.range ? 
                    <div className="range">{rangeLabel}</div>
                    : null}
                <div className="arrow" data-popper-arrow></div>
            </div>, this.props.tooltipRef.current) : null}
            
            {this.props.children}
        </div>
    };
}
