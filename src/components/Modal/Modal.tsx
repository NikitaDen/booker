import React from "react";
import './modal.scss';

const Modal = (props: any) => {

    return (
        <div className={'modal'}>
            <header><h3>{props.title}</h3></header>
            <section>
                {props.children}
            </section>
            <section>
                {props.canCancel && <button onClick={props.onCancel}>Cancel</button>}
                {props.canConfirm && <button onClick={props.onConfirm}>{props.btnTitle}</button>}
            </section>
        </div>
    )
};

export default Modal;