const dedent = require('dedent');

module.exports = () => {
    const self = {
        // set to newest update.id
        totalUpdates() {
            return 30;
        },

        // prepend new updates
        updates() {
            return [{
                    id: 30,
                    title: 'Secure your secrets with new .env editor',
                    body: dedent `
The .env file in your project is a secure place to keep API keys or other credentials for your app. It’s only visible to you and your project collaborators, and it isn’t duplicated if someone remixes your project.

Now, the Glitch editor is introducing a brand new way to edit your .env. Never again do you need to worry about syntax mistakes causing invalid .env files, and if you miss the plaintext view it’s only a click away.

Open a project and try out the new editor!

<video autoplay loop muted playsinline>
  <source src="https://cdn.glitch.com/9cb65289-b168-4318-8f8a-8e5f3c2d8da1%2Fdotenv-demo.webm?v=1589396461116" type="video/webm">
  <source src="https://cdn.glitch.com/9cb65289-b168-4318-8f8a-8e5f3c2d8da1%2Fdotenv-demo.mp4?v=1589396461116" type="video/mp4">
</video>
          `,
                },
                {
                    id: 29,
                    title: 'Make your code Prettier',
                    body: `\
Ever wish you could snap your fingers and turn your code into a perfectly formatted masterpiece? Click the “Format This File” button (or use the handy keyboard shortcut) and we'll magically clean up your current file.

![Format your code](https://cdn.glitch.com/63b9e699-61b7-49b1-9bde-ceeaf82e3dd1%2Fformat-file-gif.gif?v=1569875695381)

Want to format just part of a file? Highlight the lines you want to format, click the button or use the shortcut, and voila! It's especially handy if you're collaborating with people in the same file and don't want to format the line they're working on.

We use the fabulous [Prettier](https://prettier.io/) library for this, and have the default options applied. Use a .prettierc [JSON configuration file](https://prettier.io/docs/en/configuration.html#basic-configuration) in your project if you want to set your own preferences.

Thanks, from your friends at Glitch!`,
                },
                {
                    id: 28,
                    title: 'Now your folders act like folders!',
                    body: `\
Exciting news: your files and folders are now displayed in a handy, collapsible filetree.

We've been test-driving this for the Community site for the past few weeks, and it's grrrrreat! It's already made a huge difference in how we work on Glitch.

![Collapsible Filetree](https://cdn.glitch.com/6acc6ca5-e1ad-4cd9-9ec2-3756ebcb452a%2FScreenshot%202019-07-10%20at%205.42.40%20PM.png?v=1562794969579)

To create a file in a folder: Click on the New File button and separate the file name with a forward slash to designate the folder - like public/my-awesome-file.js. You can also now rename and delete folders directly, which will affect all the files within them, instead of renaming all your files one-by-one.

Happy collapsing!

– Sheridan and Edwin

`,
                },
                {
                    id: 27,
                    title: 'Embedding your app just got easier',
                    body: `\
We've redesigned our embed tool so that you can easily embed a Glitch project or code on another site. We've also added a "share" button so that other people can help spread the word about your app, too!

![Embedded Glitch App with New Bar Design](https://cdn.glitch.com/b97f2879-ef9d-44c8-acf7-9650a5f9c61f%2Fembedbar-demo.gif?1559242323828)

The embed generator also got a little love, so it's easier to customize the way your embed looks. And because we expanded our browser support, your embeds should look great in even more places.

– Tiff, Edwin, Jess, and Osmose

`,
                },
                {
                    id: 26,
                    title: 'Show App in Editor',
                    body: `\
You can now \`Show\` your App \`In Editor\`, while you code, where you code.

![Show App in Editor](https://cdn.glitch.com/6d561a98-036e-47a6-b152-a2a66a73d13e%2Fshow-app-in-editor.gif?1555698139611)

Not having to switch windows between your code and app makes a couple things easier:

- Teaching and Presenting

- Coding on an iPad

- And lets you use Glitch more like a a REPL on smaller projects

Psst, You can also now click \`Change URL\` to refresh a subpath of your app as you type.

Happy coding

– xoxo Pirijan 🌹

`,
                },

                {
                    id: 25,
                    title: 'More Ways to Share',
                    body: `\
We've updated your project Sharing options to give you more ways to share, and make access permissions – and their implications – easier to understand.

The public/private project toggle now lives inside the \`Share\` button.

![share options](https://cdn.glitch.com/6d561a98-036e-47a6-b152-a2a66a73d13e%2F3.gif?1552067086515)

– Your Pal Pirijan

**And more**

- Embeds make it easy to share code snippets, tutorials, and cool apps inside Medium posts. To make that easier, you can now generate a Medium (and Embedly) embed link from \`Share ➡ Share Embed\` – Pirijan

- Like a helpful friend, the \`New File\` button now always appears in the sidebar, even if you've got a really tall filetree – by Tara

- Renaming files in the filetree is a bit nicer now – stay tuned for even more filetree updates from Sheridan

`,
                },

                {
                    id: 24,
                    title: 'Searching Project Files',
                    body: `\
You can now search your entire project through the search box (or by hitting \`⌘-Shift-F\` or \`Ctrl-Shift-F\`). This makes it easier to work with big projects.

![search walkthrough](https://d2w9rnfcy7mm78.cloudfront.net/3680096/original_83b63778a7198ed0fffd17e98a57c2fd.gif?1550589425)

Sincerely,

– Pirijan, with illustration by GoodBoyGraphics
`,
                },
                {
                    id: 23,
                    title: 'A Tools Box for Tools',
                    body: `\
Now that the Glitch editor is over four years old it has way more features than it used to. So we've reorganized things to make the core editing experience less noisy, and to make advanced tools feel more consistent to find and use.

A new **Tools** button at the _bottom_ of the editor now contains the old 'Advanced Options' (reworked into \`Git, Import, and Export\`), as well as helpful debugging tools like \`Logs\` and \`Console\`, and infrequently-used project features like \`Custom Domains\`.

![tools at the bottom of the editor](https://cdn.glitch.com/6d561a98-036e-47a6-b152-a2a66a73d13e%2Ftools-pop-short.gif?1548699985926)

– Pirijan

![cat in box](https://cdn.glitch.com/6d561a98-036e-47a6-b152-a2a66a73d13e%2Fcat-box.gif?1548697331541)\
`,
                },
                //       {
                //         id: 22,
                //         title: "Hiding Projects from Kids",
                //         body:
                //           `\
                // Checking \`Hidden from Kids\` will hide your project from Search Results on the community site. We built this feature because we want people to be able to fully express themselves, or their business, without having to worry about kids stumbling onto risky content at home or at school.

                // ![checking hidden from kids button](https://cdn.glitch.com/6d561a98-036e-47a6-b152-a2a66a73d13e%2Fhidden-from-kids.gif?1548697331240)

                // ✌️🍑

                // – xoxo Pirijan\
                // `
                //       },
                {
                    id: 20,
                    title: 'User Descriptions and Teams',
                    body: `\
The description you've written for yourself on your user profile page is now displayed when someone clicks on you. If you've added images, links and more to it with markdown we'll display that extra personality too.

![profile with description and teams](https://cdn.glitch.com/6d561a98-036e-47a6-b152-a2a66a73d13e%2Fuser-teams.png?1543938298416)

Also you can now view the teams that someone is a part of. You can use this to quickly jump to your own teams, or just see what your friends are on.

– your pal Pirijan\
`,
                },
                {
                    id: 19,
                    title: 'eslint support',
                    body: `\
Continuing the theme of strong defaults that you can override, you can now add an \`.eslintrc.json\` file to your project to do things like hide code warnings, or setting your preferences around really specific things like string quotation rules.

Examples and a full list of options can be found at [eslint.org](https://eslint.org/docs/user-guide/configuring)

– Added by Emanuele\
`,
                },
                {
                    id: 18,
                    title: 'Inline Console and Clearer Embeds',
                    body: `\
You can now use the \`Console\` directly inside the editor, through the \`Status\` panel. Toggle it on to keep an eye on your builds and logs in the same handy window.

To prevent people accidently remixing when they meant to edit, \`embeds no longer auto remix\` when you type into them. We use Embeds all over our community site, but since they launched we've learned about how they're being used in tutorials and blog posts.

– Made by Emanuele and Pirijan\
`,
                },
                //   id: 17
                //   title: "Project Performance Stats"
                //   body:
                //     """
                //       We believe that to make cool stuff, you shouldn't have to think about boring stuff – like compute resources.

                //       However, there are times where knowing that info can be useful in order to debug performance issues. To help in those times, you can now access realtime project performance data from the `Status` panel (renamed from `Logs`).

                //       ![performance stats](https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fnew-stuff-project-status-pop.png?1537203995441)

                //       – Made by Emanuele, Isaac, and Pirijan
                //     """
                // ,
                //   id: 16
                //   title: "Search for Commands"
                //   body:
                //     """
                //       Forget where to download your project, or open the console? Now you can use the project search box to also find whatever command you're looking for.

                //       ![project command search](https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fproject-command-search.png?1536851610907)

                //       p.s. did you know you can use `CMD-P` or `CTRL-P` to focus on the search bar without taking your hands off the keyboard? Now you're a power user 🙇‍♂️

                //       – Pirijan
                //     """
                // ,
                //   id: 15
                //   title: "New Console Location, Rewind Tweaks"
                //   body:
                //     """
                //       Some spring cleaning,

                //       - Open Console 📟 button moved to the logs panel, to be more in context with advanced user workflows
                //       <img src="https://cdn.glitch.com/0c02a94b-1e98-4768-9190-1c7476e65182%2Flog-console%402x.png?1523484234146" width="369">
                //       - Added keyboard shortcut 🎹 to toggle rewind (CTRL-Shift-M or CMD-Shift-M)
                //       - Added cancel button in the rewind notification, to make it easier to back out of a ⏪
                //       <img src="https://cdn.glitch.com/0c02a94b-1e98-4768-9190-1c7476e65182%2Frewind-cancel%402x.png?1523484685801" width="154">
                //     """
                // ,
                //   id: 14
                //   title: "No Limit Crew"
                //   body:
                //     """
                //       Sometimes the best new features are the ones you can't see. But I'm still gonna tell you about them:

                //       - Node modules now install instantly so your projects should start way faster – about 3 times faster in most cases
                //       - Module sizes no longer count against your project size limit
                //       - There are no more file length or copy/paste size limits
                // eslint-disable-next-line no-irregular-whitespace, no-irregular-whitespace
                //       - Also, we’ve improved support for slow or flaky internet connections. Now, if you lose connection while developing on Glitch you can just keep typing — all your changes will be merged in once your connection comes back.

                //       ![no limit records](https://upload.wikimedia.org/wikipedia/en/2/23/Nolimit.jpg)

                //       Shout outs to our very own [Emanuele](https://glitch.com/@etamponi), and [Zoltan Kochan](https://github.com/zkochan) from [pnpm](https://github.com/pnpm/pnpm) for their tireless work on this.

                //       [More details](https://medium.com/glitch/tackling-the-biggest-pain-points-in-web-development-57d64afe19dc)
                //     """
                // ,
                //   id: 13
                //   title: "Open Source Licenses and Codes Of Conduct"
                //   body:
                //     """
                //       Having the right open source license on your project lets everybody know how they can collaborate or share with each other, and an explicit code of conduct sets up rules that make sure contributing is a good experience for everybody.

                //       Coincidentally, you can now easily easily add these files to your projects:

                //       - `New File → Add License` creates a `LICENSE.md` file with an MIT license, which you can then change to the license of your choice.
                //       - `New File → Add Code of Conduct` Similarly, helps make your projects a more welcoming place for contributors.
                //     """
                // ,
                //   id: 12
                //   title: "Sharing is Caring"
                //   body:
                //     """
                //       Come in, get comfy, have a seat by the fire. New Glitch news is lit.

                //       ## Embeds

                //       You can now embed your Glitch project on your own site. We think it’s a great way to show off your work, teach coding, and make documentation more interactive and engaging.

                //       ![glitch embed example](https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fembed-example.png?1512061993545)

                //       You can make embeds in `Share → Advanced Sharing`

                //       ## Also,

                //       - `Project → Advanced Options → Public/Private` Based on feedback, the Public/Private project toggle has moved back to it’s original home.
                //       - `Share → Advanced Sharing` also includes a code snippet for a View Source button that you can copy and paste into your own project.
                //       - ✍️🎤 You can now just start typing to remix someone else’s project.
                //     """
                // ,
                //   id: 11
                //   title: "You Own Little Space on Glitch"
                //   body:
                //     """
                //       Now you can express yourself and the projects you’re most proud of on your very own user page.  Yes, we made it just for you. And your friends. And maybe even your favorite bands. Whoops, we made MySpace – but for code.

                //       Just like MySpace, we hope you'll go nuts with cover art and project pinning by visiting `your profile` from [glitch.com](https://glitch.com)

                //       ![dan reeves' user page](https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fdan-new-stuff-log.png?1504893071965)

                //       p.s. here's [Dan's](https://glitch.com/@danreeves). More details [on Medium](https://medium.com/glitch/your-own-little-space-on-glitch-865b5cfebb7f)
                //     """
                // ,
                //   id: 10
                //   title: "You're cordially invited to the $BASH"
                //   body:
                //     """
                //       You can now Open the Console 📟 for your project by going to the advanced options menu.

                //       Peek at spirits with `ls -a`, find juicy tidbits by `grep`ing yourself, `git` good, measure your rising blood pressure with `hg`. etc.

                //       That said, if terminals and command lines make you bored or grimace-y, you definitely don't need it to use Glitch.

                //       XOXO

                //       Also, we moved the project privacy toggle to the Share menu, to keep things contextually connected.

                //     """
                // ,
                //   id: 9
                //   title: "A More Flexible Editor"
                //   body:
                //     """
                //       You meet a robed, bearded old man. The spark in his eyes betrays a glimmer of the party fun times ahead. He beckons you closer. "Stay Awhile and Listen" he exclaims.

                //       - You can now drag to resize the sidebar and the logs
                //       - Offline collaborators now appear in the sidebar
                //       - You can now remove other people from a project
                //       - An option for toggling word wrap has been added to the user options menu
                //       - Error messages in the logs now let you quickly jump to the error in your code

                //       You feel refreshed and more learned.
                //     """
                // ,
                //   id: 8
                //   title: "Write Code While Climbing a Mountain*"
                //   body:
                //     """
                //       Dear friend,

                //       Did you know that Glitch now works great on your tablet or phone? I just fixed a bug in the shower, last week I updated my app while waiting for the bus.

                //       If you've got a screen, you've got a full, no-compromise development and creativity environment.

                //       ## Login with Facebook

                //       - If your friends or frenemies don't already have GitHub accounts, logging in with Facebook should save them some steps.

                //       ## Hot Tips

                //       - 🐙 We no longer ask you for full repo permissions when logging in with GitHub
                //       - 💕 You can now quickly create a `copy` of your current file from the file options menu
                //       - 🎹 We have new keyboard shortcuts for quickly toggling logs, and quickly exporting to GitHub

                //       &ast; remember not to fall.

                //     """
                // ,
                //   id: 7
                //   title: "Oh Hi, We're Glitch Now"
                //   body:
                //     """
                //       Since we last talked, the Glitch team has been on a vision quest of sorts. But with less peyote, and more rebuilding our entire backend.

                //       We're now officially in public beta with a new name, and a renewed vision of making real web development inviting and accessible to everyone.

                //       ## More Personable, Writable Projects

                //       - You can customize your project name, description and give it an avatar image.
                //       - You can view rendered previews of your `markdown` files.
                //       - You can spread the love and give projects a 💖.
                //       - An all-new [community site 👯](https://glitch.com).
                //       - Projects can now write directly to the file system (they may not show up in your editor sidebar yet, but they're there).
                //     """
                // ,

                //   id: 6
                //   title: "Deprecating DynamoDB and datastore.js"
                //   body:
                //     """
                //       In a couple of weeks, we'll be updating Glitch to a new backend infrastructure that'll be faster, more reliable, and allow cool new features like multi-language support and version control.

                //       In order to do this, we'll need to remove project DynamoDB support. If you have a project using `DynamoDB` and `datastore.js` you should update it to use a third-party db service.

                //       Let us know if you'd like any help with this 🚑

                //       [Here's a longer explanation](https://support.glitch.com/t/deprecating-dynamodb-and-datastore-js-support/611)
                //     """
                // ,

                //   id: 5
                //   title: "GitHub and Touch Updates"
                //   body:
                //     """
                //       Just between us and whoever else you tell,

                //       ## Nicer GitHub Import & Export

                //       - GitHub import and export remembers the name of the repo you last used.
                //       - You can now add commit messages when exporting to GitHub. Handy if you use GitHub to kick off test scripts like a boss, and for nicer backups.

                //       ## Smoother Editing on Touch Devices

                //       Psst, Glitch works on phones and tablets too because it's the future and of course it does.

                //       - Touch events respond a lot faster now.
                //       - You can swipe to open and close the sidebar. Also, tapping anywhere on a closed sidebar now opens it.
                //       - We hide line numbers on small devices to give you more editing room.

                //       ![romantic typing](https://media.giphy.com/media/13JOSWSCNwYXLO/giphy.gif)

                //       Curious about our product philosophy? Daniel X talks Glitch on [The New Stack @ Scale podcast](https://soundcloud.com/thenewstackatscale/show-11-agility-at-scale) (spoiler: we still don't know what the X stands for)
                //     """
                // ,

                //   id: 4
                //   title: "A Wild Dark Theme Appears"
                //   body:
                //     """
                //       It’s super effective! (for tired eyes, working at night, and just looking cool)

                //       ![gastly pokemon](https://24.media.tumblr.com/575771a9a2619163e911591c802513b5/tumblr_mj3martfgY1r0dbsno1_500.gif)
                //     """
                // ,
                //   id: 3
                //   title: "A New Community Site"
                //   body:
                //     """
                //       If we had smokey, backroom meetings about strategy and world domination, we'd mostly talk about how to empower and connect the people who make dope stuff with Glitch.

                //       So we redesigned the [Community Projects site](https://glitch.com) to make it easier to find projects to ogle and remix.

                //       ![shiny jewel](https://cdn.glitch.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fdiamond.svg)

                //       [Check it out](https://glitch.com)
                //     """
                // ,
                //   id: 2
                //   title: "A better way to add packages – and keep them updated"
                //   body:
                //     """
                //       Using open source packages is a key part of building web-apps.
                //       So we've made working with packages even easier.
                //       - `Add Packages` now uses [libraries.io](https://libraries.io/) for
                //       better search results
                //       - Adding a package now adds the latest version
                //       - We'll check your packages and let you know when any are out of
                //       date
                //     """
                // ,
                //   id: 1
                //   title: "The new stuff gazette"
                //   body:
                //     """
                //       We're constantly improving Glitch with helpful updates – and now
                //       we can tell you about them 🐈
                //     """
            ];
        },
    };

    return self;
};