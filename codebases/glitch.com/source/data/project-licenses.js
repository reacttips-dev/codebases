// Data for licenses that we fetch from GitHub.

export default [{
        id: 'mit',
        name: 'MIT License',
        description: 'Simple and permissive',
        spdxId: 'MIT',
        permissions: ['Use commercially', 'Modify', 'Distribute', 'Use privately'],
        conditions: ['Must include this license and copyright'],
        limitations: ['No liability', 'No warrantee'],
    },
    {
        id: 'apache-2.0',
        name: 'Apache License',
        description: 'Grants patent rights and secures trademark',
        spdxId: 'Apache-2.0',
        permissions: ['Use commercially', 'Modify', 'Distribute', 'Use privately', 'Patent use'],
        conditions: ['Must include this license and copyright', 'Must Document changes to code'],
        limitations: ['No liability', 'No warrantee', 'No trademark rights'],
    },
    {
        id: 'gpl-3.0',
        name: 'GNU General Public License',
        description: 'Remixed projects must be public too',
        spdxId: 'GPL-3.0',
        permissions: ['Use commercially', 'Modify', 'Distribute', 'Use privately', 'Patent use'],
        conditions: ['Remixes must be public', 'Must include this license and copyright', 'Must use this license', 'Must document changes'],
        limitations: ['No liability', 'No warrantee'],
    },
];