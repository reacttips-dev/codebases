import {
    ENVIRONMENT
} from './env';
import {
    access
} from './const';

// 🧗 A Glitch analytics handler that delegates to Segment.
// If we omit the groupId, it will use the last groupId we specified;
// this won't always be correct.
// So we need to have a default groupId value we send when they're acting as an individual;
// we agreed to use 0 so that it's easier to filter out those events.
class SegmentAnalytics {
    constructor(editorIsEmbedded, analytics, debugMode = false) {
        this.editorIsEmbedded = editorIsEmbedded;
        this.analyticsOverride = analytics;
        this.currentProject = undefined;
        this.currentUser = undefined;
        // In debug mode, events are logged to the console for easier inspection during development
        this.debugMode = debugMode;
    }

    setCurrentProject(currentProject) {
        this.currentProject = currentProject;
    }

    setCurrentUser(currentUser) {
        this.currentUser = currentUser;
    }

    accessLevelToAnalyticsLabel(accessLevel, user, project) {
        // TODO: Move this next function into a hook once we have Context
        const currentUserOnAnyCurrentProjectTeam = () => {
            const projectTeams = project ? project.teams() : [];
            const userTeams = user ? user.teams() : [];
            return projectTeams.some((projectTeam) => userTeams.some((userTeam) => userTeam.id() === projectTeam.id()));
        };
        let textAccessLevel;

        switch (accessLevel) {
            case access.ADMIN:
                textAccessLevel = 'admin';
                break;
            case access.MEMBER:
                textAccessLevel = 'projectMember';
                break;
            default:
                if (currentUserOnAnyCurrentProjectTeam()) {
                    textAccessLevel = 'teamMember';
                } else {
                    textAccessLevel = 'visitor';
                }
                break;
        }
        return textAccessLevel;
    }

    glitchMetadata() {
        let metadata = {
            isEmbedded: this.editorIsEmbedded()
        };
        if (this.currentProject) {
            const owner = this.currentProject.getOwner();
            const projectType = this.currentProject.getType();
            metadata = {
                ...metadata,
                projectId: this.currentProject.id(),
                projectName: this.currentProject.domain(),
                projectType,
                projectVisibility: this.currentProject.private() ? 'private' : 'public',
                projectPrivacy: this.currentProject.privacy(),
                remixedFromProjectId: this.currentProject.baseId(),
                ownerId: owner && owner.id,
                ownerHandle: owner && owner.login,
                numberProjectMembers: this.currentProject.users().length,
                numberTeams: this.currentProject.teams().length,
                appType: this.currentProject.appType(),
            };
            if (this.currentUser) {
                const numericAccessLevel = this.currentProject.accessLevel(this.currentUser);
                const textAccessLevel = this.accessLevelToAnalyticsLabel(numericAccessLevel, this.currentUser, this.currentProject);
                metadata = {
                    ...metadata,
                    accessLevel: textAccessLevel,
                };
            }
        }
        return metadata;
    }

    page(name, properties) {
        properties = {
            name,
            isEmbedded: this.editorIsEmbedded(),
            ...properties,
        };
        if (this.analytics()) {
            this.analytics().page(properties);
        }
        if (this.debugMode) {
            console.info('ANALYTICS: Page Viewed');
            if (properties) console.info(properties);
        }
    }

    track(eventName, properties) {
        properties = {
            ...this.glitchMetadata(),
            ...properties,
        };
        if (this.analytics()) {
            this.analytics().track(eventName, properties);
        }
        if (this.debugMode) {
            console.info(`ANALYTICS: "${eventName}" Event`);
            if (properties) console.info(properties);
        }
    }

    identify(user) {
        if (!user || !user.loggedIn()) {
            // we do not identify anonymous users
            return;
        }
        const userProperties = {
            name: user.name(),
            userHandle: user.login(),
            email: user.primaryEmail() && user.primaryEmail().email,
            createdAt: user.createdAt(),
            teamCount: user.teams().length,
        };
        if (this.analytics()) {
            this.analytics().identify(user.id(), userProperties);
        }
        if (this.debugMode) {
            console.info(`ANALYTICS: Identify User`);
            if (userProperties) console.info(userProperties);
        }
    }

    analytics() {
        // Delegate to global "analytics"; this is dangerous, but necessary,
        // because of how the Segment async-load snippet replaces the global
        // analytics object. Ugh.
        return this.analyticsOverride || window.analytics;
    }
}

// 👨🏾‍🎤 A Glitch analytics handler that throws away all events.
class NullAnalytics {
    page() {}

    track() {}
}

// makeAnalytics is a factory function that builds a glitch analytics handler.
// makeAnalytics takes the userAgent (a string)
// and an Observable expressing whether the editor is embedded.
export default function makeAnalytics(userAgent, editorIsEmbedded, analytics = null) {
    const BOT_USER_AGENTS = [
        'http://www.google.com/bot.html',
        'http://www.google.com/adsbot.html',
        'http://www.bing.com/bingbot.htm',
        'http://help.yahoo.com/help/us/ysearch/slurp',
        'http://duckduckgo.com/duckduckbot.html',
        'http://www.baidu.com/search/spider.html',
        'http://yandex.com/bots',
        'http://www.sogou.com/docs/help/webmasters.htm#07',
        'Sogou-Test-Spider/4.0 (compatible; MSIE 5.5; Windows 98)',
        'http://www.exabot.com/go/robot',
        'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Exabot-Thumbnails)',
        'http://www.facebook.com/externalhit_uatext.php',
        'facebot',
        'http://www.alexa.com/site/help/webmasters',
    ];
    const isBot = BOT_USER_AGENTS.find((bua) => userAgent.includes(bua));
    if (isBot) {
        return new NullAnalytics();
    }

    if (ENVIRONMENT === 'development') {
        return new SegmentAnalytics(editorIsEmbedded, analytics, true); // call Segment Analytics in debug mode
    }

    return new SegmentAnalytics(editorIsEmbedded, analytics);
}