/* global TrelloPowerUp */

const LZString = require('lz-string');

const Log = require('./logging.js');
const kApiEndpoint = require('./api-endpoint.js');

const CommandStorage = {
  init(trello) {
    let __cached_server_commands = {};
    trello = trello || TrelloPowerUp.iframe({ targetOrigin: 'https://trello.com' });
    const { Promise } = TrelloPowerUp;
    let __admin_obo;

    function clearCachedServerCommands() {
      __cached_server_commands = {};
    }

    CommandStorage.init = function(t) {
      trello = t || TrelloPowerUp.iframe({ targetOrigin: 'https://trello.com' });
    };
    CommandStorage.setAdminOnBehalfOf = function(user_id) {
      if (__admin_obo !== user_id) {
        __admin_obo = user_id || undefined;
        clearCachedServerCommands();
      }
    };
    CommandStorage.getAdminOnBehalfOf = function() {
      return __admin_obo;
    };

    function usePupStorage(type) {
      switch (type) {
        case 'board-button':
        case 'card-button':
          return true;
        case 'rule':
        case 'schedule':
        case 'on-date':
          return false;
        default:
          throw new Error('Unknown command type.');
      }
    }

    function saveOverrides(overrides) {
      return trello.set('board', 'private', 'overrides', overrides);
    }

    function getPupStorageCommands(ignore_overrides) {
      return Promise.join(trello.getAll(), trello.member('id')).spread(function(data, member) {
        let commands = [];
        const commands_by_id = {};
        Object.keys(data || []).forEach(function(scope) {
          Object.keys(data[scope]).forEach(function(visibility) {
            let d = data[scope][visibility].commands;
            if (!d) return;
            if (typeof d === 'string')
              try {
                d = JSON.parse(LZString.decompressFromUTF16(d));
              } catch (e) {
                Log.logError(
                  e,
                  'Context: getPupStorageCommands',
                  'PARSE DECOMPRESSED DATA',
                  d,
                  scope,
                  visibility,
                  member
                );
                return;
              }
            if (!d) return;

            d.forEach(function(command) {
              command.is_own = command.uid === member.id;
              commands_by_id[command.id] = command;
            });
            commands = commands.concat(d);
          });
        });

        if (ignore_overrides) return { commands };

        let overrides;
        try {
          overrides = data.board.private.overrides;
        } catch (e) {}
        let update_overrides = false;
        Object.keys(overrides || {}).forEach(function(id) {
          const command = commands_by_id[id];
          if (!command) {
            // Only remove old overrides after 90 days.
            // Otherwise another user can unshare, then re-share, potentially losing the override.
            if (+new Date() - overrides[id].ot > 90 * 24 * 3600 * 1000) {
              delete overrides[id];
              update_overrides = true;
            }
          } else {
            Object.keys(overrides[id]).forEach(function(key) {
              command[key] = overrides[id][key];
            });
          }
        });

        if (update_overrides)
          return saveOverrides(overrides).then(function() {
            return { commands };
          });

        return { commands };
      });
    }

    function getToken() {
      return trello.get('member', 'private', 'token');
    }

    function setCachedServerCommands(response, board_id) {
      const { commands } = response;
      commands.forEach(function(command) {
        command.is_own = true;
        command.enabled = command.b.indexOf(board_id) !== -1;
      });
      __cached_server_commands.commands = commands;
      if (response.oboWritable !== undefined) {
        __cached_server_commands.oboWritable = response.oboWritable;
      }
      return __cached_server_commands;
    }

    function getServerCommands() {
      if (__cached_server_commands.commands)
        return new Promise(function(resolve) {
          resolve(__cached_server_commands);
        });

      return getToken().then(function(token) {
        return new Promise(function(resolve, reject) {
          const board_id = trello.getContext().board;
          const b = `?b=${board_id}`;
          const obo = __admin_obo ? `&obo=${__admin_obo}` : '';
          $.ajax(`${kApiEndpoint}powerup-commands${b}${obo}`, {
            type: 'GET',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              return resolve(setCachedServerCommands(response.response, board_id));
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function getCommands(type, ignore_overrides) {
      return (usePupStorage(type)
        ? getPupStorageCommands(ignore_overrides)
        : getServerCommands()
      ).then(function(result) {
        const { commands } = result;
        return {
          commands: commands.filter(function(c) {
            return c.type === type;
          }),
          obo_writable: result.oboWritable,
        };
      });
    }

    function getCommand(type, id, ignore_overrides) {
      return getCommands(type, ignore_overrides).then(function(result) {
        return result.commands.find(function(c) {
          return c.id === id;
        });
      });
    }

    function getCommandById(id, ignore_overrides, local_only) {
      // First get local storage commands to avoid a server request.
      return getPupStorageCommands(ignore_overrides).then(function(result) {
        const command = result.commands.find(function(c) {
          return c.id === id;
        });
        if (command) return command;
        if (local_only) return undefined;

        // Fall back to server commands.
        return getServerCommands().then(function(result) {
          return result.commands.find(function(c) {
            return c.id === id;
          });
        });
      });
    }

    function getAllCommands(ignore_overrides) {
      return Promise.join(getPupStorageCommands(ignore_overrides), getServerCommands()).spread(
        function(pup_storage_result, server_result) {
          return {
            commands: pup_storage_result.commands.concat(server_result.commands),
            obo_writable: server_result.oboWritable,
          };
        }
      );
    }

    function saveFilteredCommands(scope, shared, commands) {
      const filtered = commands.filter(function(c) {
        return c.scope === scope && c.shared === shared;
      });
      const data = LZString.compressToUTF16(JSON.stringify(filtered));
      return (
        trello
          .set(
            scope === CommandStorage.ScopeTeam ? 'organization' : 'board',
            shared ? 'shared' : 'private',
            'commands',
            data
          )
          // EXPERIMENT
          .then(function() {
            trello
              .get(
                scope === CommandStorage.ScopeTeam ? 'organization' : 'board',
                shared ? 'shared' : 'private',
                'commands'
              )
              .then(function(d) {
                try {
                  d = JSON.parse(LZString.decompressFromUTF16(d));
                } catch (e) {
                  Log.logError(e, 'Context: saveFilteredCommands', {
                    in: JSON.stringify(commands),
                    out: d,
                  });
                }
              });
          })
      );
      // END EXPERIMENT
    }

    function addCommand_pupStorage(command) {
      return Promise.join(trello.member('id', 'username'), getPupStorageCommands(true)).spread(
        function(member, result) {
          const { commands } = result;
          let t = +new Date();
          let id;
          do {
            id = `${member.id}-${++t}`;
          } while (
            commands.some(function(c) {
              return c.id === id;
            })
          );
          command.id = id;
          command.uid = member.id;
          command.username = member.username;
          command.t = t;
          commands.push(command);
          return saveFilteredCommands(command.scope, command.shared, commands).then(function() {
            command.is_own = true;
            return command;
          });
        }
      );
    }

    function addCommand_server(command) {
      return Promise.join(getToken(), trello.board('id', 'name', 'url')).spread(function(
        token,
        board
      ) {
        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-commands`, {
            type: 'POST',
            data: JSON.stringify({
              op: 'new',
              params: { command, board },
              obo: __admin_obo,
            }),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              setCachedServerCommands(response.response, board.id);
              const addedCommand = response.response.commands.find(function(c) {
                return c.id === response.response.cmd_id;
              });
              return resolve(addedCommand);
            })
            .fail(function() {
              return reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function addCommand(command) {
      if (usePupStorage(command.type)) {
        return addCommand_pupStorage(command);
      }
      return addCommand_server(command);
    }

    function enableCommandId_pupStorage(command, enabled) {
      const command_id = command.id;
      return trello.get('board', 'private', 'overrides').then(function(overrides) {
        if (!overrides) overrides = {};
        let command_overrides = overrides[command_id];
        if (!command_overrides) command_overrides = overrides[command_id] = {};
        command_overrides.enabled = enabled;
        command_overrides.ot = +new Date();
        return saveOverrides(overrides).then(function() {
          // We should always display all the buttons, whether or not they're
          // enabled on the board.
          const returnCommands = Object.keys(overrides).map(id => {
            return { id };
          });
          return returnCommands;
        });
      });
    }

    function enableCommandId_server(command, enabled) {
      return Promise.join(getToken(), trello.board('id', 'name', 'url')).spread(function(
        token,
        board
      ) {
        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-commands/${command.id}`, {
            type: 'POST',
            data: JSON.stringify({
              op: 'enable',
              params: { enabled, board },
              obo: __admin_obo,
            }),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              return resolve(setCachedServerCommands(response.response, board.id).commands);
            })
            .fail(function() {
              return reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function enableCommandId(command_id, enabled) {
      return Promise.join(getPupStorageCommands(true), getServerCommands()).spread(function(
        pup_result,
        server_result
      ) {
        let i = pup_result.commands.findIndex(function(c) {
          return c.id === command_id;
        });
        if (i !== -1) return enableCommandId_pupStorage(pup_result.commands[i], enabled);

        i = server_result.commands.findIndex(function(c) {
          return c.id === command_id;
        });
        if (i !== -1) return enableCommandId_server(server_result.commands[i], enabled);

        return Promise.reject(new Error('Command not found.'));
      });
    }

    function updateCommand_pupStorage(commands, pos, member, update_fn, is_admin) {
      const command = commands[pos];

      if (command.uid !== member.id && !is_admin)
        return Promise.reject(new Error('Command not own.'));

      const { scope, shared } = command;
      const updated_command = update_fn(command);

      if (!updated_command) {
        commands.splice(pos, 1);
        return saveFilteredCommands(scope, shared, commands).then(function() {
          return command;
        });
      }

      updated_command.uid = member.id;
      updated_command.username = member.username;
      updated_command.t = +new Date();

      commands.splice(pos, 1, updated_command);

      if (updated_command.scope === scope && updated_command.shared === shared)
        return saveFilteredCommands(scope, shared, commands).then(function() {
          return updated_command;
        });

      // Perform sequentially in case the new scope is not supported.
      return saveFilteredCommands(command.scope, command.shared, commands)
        .then(function() {
          return saveFilteredCommands(scope, shared, commands);
        })
        .then(function() {
          return updated_command;
        });
    }

    function updateCommand_server(commands, pos, update_fn) {
      const command = commands[pos];
      const updated_command = update_fn(command);

      return Promise.join(getToken(), trello.board('id', 'name', 'url')).spread(function(
        token,
        board
      ) {
        let data;
        if (updated_command) {
          data = JSON.stringify({
            op: 'update',
            params: { command: updated_command, board },
            obo: __admin_obo,
          });
        } else {
          data = JSON.stringify({
            op: 'delete',
            params: { board },
            obo: __admin_obo,
          });
        }

        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-commands/${command.id}`, {
            type: 'POST',
            data,
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              setCachedServerCommands(response.response, board.id);
              const updated_command_server = response.response.commands.find(function(c) {
                return c.id === command.id;
              });
              return resolve(updated_command_server);
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function updateCommand(command_id, update_fn, is_admin) {
      return Promise.join(
        getPupStorageCommands(true),
        getServerCommands(),
        trello.member('id', 'username')
      ).spread(function(pup_result, server_result, member) {
        let i = pup_result.commands.findIndex(function(c) {
          return c.id === command_id;
        });
        if (i !== -1)
          return updateCommand_pupStorage(pup_result.commands, i, member, update_fn, is_admin);

        i = server_result.commands.findIndex(function(c) {
          return c.id === command_id;
        });
        if (i !== -1) return updateCommand_server(server_result.commands, i, update_fn);

        return Promise.reject(new Error('Command not found.'));
      });
    }

    function updateCommandId(command_id, fields, is_admin) {
      return updateCommand(
        command_id,
        function(command) {
          Object.keys(fields).forEach(function(field) {
            command[field] = fields[field];
          });
          return command;
        },
        is_admin
      );
    }

    function removeCommandId(command_id, is_admin) {
      return updateCommand(
        command_id,
        function() {
          return null;
        },
        is_admin
      );
    }

    function getSharedLibraries() {
      return getToken().then(function(token) {
        return new Promise(function(resolve, reject) {
          const b = `?b=${trello.getContext().board}&idOrganization=${
            trello.getContext().organization
          }`;
          const obo = __admin_obo ? `&obo=${__admin_obo}` : '';
          $.ajax(`${kApiEndpoint}powerup-commands${b}${obo}`, {
            // Same as commands.
            type: 'GET',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              return resolve(response.response.libs);
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function getSharedLibrary(link_id) {
      return getToken().then(function(token) {
        return new Promise(function(resolve, reject) {
          const b = `?b=${trello.getContext().board}&idOrganization=${
            trello.getContext().organization
          }`;
          const obo = __admin_obo ? `&obo=${__admin_obo}` : '';
          $.ajax(`${kApiEndpoint}powerup-library/${link_id}${b}${obo}`, {
            type: 'GET',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              return resolve(response.response.lib);
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function startSharing(lib_title) {
      return getToken().then(function(token) {
        return new Promise(function(resolve, reject) {
          const data = {
            title: lib_title,
            board: { id: trello.getContext().board },
            idOrganization: trello.getContext().organization,
            obo: __admin_obo,
          };
          $.ajax(`${kApiEndpoint}powerup-library-share`, {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              return resolve(response.response.lib);
            })
            .fail(function() {
              return reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function stopSharing(lib) {
      return getToken().then(function(token) {
        const data = {
          board: { id: trello.getContext().board },
          idOrganization: trello.getContext().organization,
          obo: __admin_obo,
        };
        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-library-unshare/${lib.link_id}`, {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              return resolve();
            })
            .fail(function() {
              return reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function importLibrary(link_id) {
      return getToken().then(function(token) {
        const data = {
          board: { id: trello.getContext().board },
          idOrganization: trello.getContext().organization,
          obo: __admin_obo,
        };
        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-library-import/${link_id}`, {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              setCachedServerCommands(response.response, trello.getContext().board);
              return resolve();
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function enableLibrary(lib_title, enable) {
      return Promise.join(getToken(), trello.board('id', 'name', 'url')).spread(function(
        token,
        board
      ) {
        const data = {
          title: lib_title,
          enable,
          board,
          idOrganization: trello.getContext().organization,
          obo: __admin_obo,
        };
        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-library-enable`, {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              setCachedServerCommands(response.response, board.id);
              return resolve();
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }

    function renameLibrary(lib_title, new_title) {
      return getToken().then(function(token) {
        const data = {
          title: lib_title,
          new_title,
          board: { id: trello.getContext().board },
          idOrganization: trello.getContext().organization,
          obo: __admin_obo,
        };
        return new Promise(function(resolve, reject) {
          $.ajax(`${kApiEndpoint}powerup-library-rename`, {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: { 'X-Butler-Trello-Token': token },
          })
            .done(function(response) {
              if (!response.success) {
                return reject(new Error(response.error || 'NO_RESPONSE'));
              }
              setCachedServerCommands(response.response, trello.getContext().board);
              return resolve();
            })
            .fail(function() {
              reject(new Error('NETWORK_ERROR'));
            });
        });
      });
    }



    CommandStorage.ScopeBoard = 'board';
    CommandStorage.ScopeTeam = 'team';

    CommandStorage.getCommand = getCommand;
    CommandStorage.getCommandById = getCommandById;
    CommandStorage.getCommands = getCommands;
    CommandStorage.getAllCommands = getAllCommands;
    CommandStorage.getLocalCommands = getPupStorageCommands;
    CommandStorage.addCommand = addCommand;
    CommandStorage.removeCommandId = removeCommandId;
    CommandStorage.updateCommandId = updateCommandId;
    CommandStorage.enableCommandId = enableCommandId;
    CommandStorage.clearCachedServerCommands = clearCachedServerCommands;
    CommandStorage.getSharedLibraries = getSharedLibraries;
    CommandStorage.getSharedLibrary = getSharedLibrary;
    CommandStorage.startSharing = startSharing;
    CommandStorage.stopSharing = stopSharing;
    CommandStorage.importLibrary = importLibrary;
    CommandStorage.enableLibrary = enableLibrary;
    CommandStorage.renameLibrary = renameLibrary;
  },
};

window.CommandStorage = CommandStorage;
module.exports = CommandStorage;
