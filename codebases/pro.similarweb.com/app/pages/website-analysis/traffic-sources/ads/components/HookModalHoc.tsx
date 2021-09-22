import React, { Component } from "react";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";

function HookModalHoc(InnerComponent) {
    return class extends Component<any, any> {
        private services: { window };

        constructor(props) {
            super(props);
            this.services = {
                window: Injector.get<any>("$window"),
            };
        }

        public render() {
            return (
                <InnerComponent
                    {...this.props}
                    {...{ createUserData: this.createUserData, services: this.services }}
                />
            );
        }

        private createUserData(userMessage: string) {
            return {
                firstName: this.services.window.similarweb.settings.user.firstname,
                lastName: this.services.window.similarweb.settings.user.lastname,
                email: this.services.window.similarweb.settings.user.username,
                message: userMessage,
                subject: 99, // must request 99 (other) when adding 'subjectText'
                subjectText: "Sales/" + userMessage,
                phone: "",
                planId: this.services.window.similarweb.settings.user.plan,
                company: "",
            };
        }
    };
}

export default (InnerComponent) => HookModalHoc(InnerComponent);
