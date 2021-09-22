import React from "react";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import config from "./config";
import { ProfilesListPage } from "./profilesListPage";
import { BoxContainer, TitleContainer } from "./styledComponents";

export const GAAdminContainer = () => {
    return (
        <BoxContainer>
            <TitleContainer>
                GA Admin Panel <span className="indicator">{config.backendEnv}</span>
            </TitleContainer>

            <Router basename="/sspa/ga">
                <Switch>
                    <Route path="/" exact component={ProfilesListPage} />
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        </BoxContainer>
    );
};
