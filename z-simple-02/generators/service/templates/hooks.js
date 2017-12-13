
const commonHooks = require('feathers-hooks-common');
<% if (requiresAuth) { %>const { authenticate } = require('@feathersjs/authentication').hooks;<% } %>
<%- insertFragment('imports') %>

<%- insertFragment('used', [
  'const { iff } = commonHooks;'
]) %>
<%- insertFragment('init') %>

let moduleExports = {
  before: {
    all: [ <% if (requiresAuth) { %> authenticate('jwt') <% } %>
      <%- insertFragment('before_all') %>
    ],
    find: [
      <%- insertFragment('before_find') %>
    ],
    get: [
      <%- insertFragment('before_get') %>
    ],
    create: [
      <%- insertFragment('before_create') %>
    ],
    update: [
      <%- insertFragment('before_update') %>
    ],
    patch: [
      <%- insertFragment('before_patch') %>
    ],
    remove: [
      <%- insertFragment('before_remove') %>
    ]
  },

  after: {
    all: [
     <%- insertFragment('after_all') %>
    ],
    find: [
      <%- insertFragment('after_find') %>
    ],
    get: [
      <%- insertFragment('after_get') %>
    ],
    create: [
      <%- insertFragment('after_create') %>
    ],
    update: [
      <%- insertFragment('after_update') %>
    ],
    patch: [
      <%- insertFragment('after_patch') %>
    ],
    remove: [
      <%- insertFragment('after_remove') %>
    ]
  },

  error: {
    all: [
      <%- insertFragment('error_all') %>
    ],
    find: [
      <%- insertFragment('error_find') %>
    ],
    get: [
      <%- insertFragment('error_get') %>
    ],
    create: [
      <%- insertFragment('error_create') %>
    ],
    update: [
      <%- insertFragment('error_update') %>
    ],
    patch: [
      <%- insertFragment('error_patch') %>
    ],
    remove: [
      <%- insertFragment('error_remove') %>
    ]
  },
  <%- insertFragment('moduleExports') %>
};

<%- insertFragment('exports') %>
module.exports = moduleExports;

<%- insertFragment('funcs') %>
<%- insertFragment('end') %>