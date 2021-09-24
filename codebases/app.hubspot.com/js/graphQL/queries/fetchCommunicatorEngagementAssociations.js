'use es6';

export var FETCH_UNIVERSAL_ENGAGEMENT_ASSOCIATIONS = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"fetchCommunicatorEngagementAssociations\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementExists\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Boolean\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementObjectId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Long\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementObjectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"isTicket\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Boolean\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"subjectObjectId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Long\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"subjectObjectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"limitPerType\"}},\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Int\"}},\"defaultValue\":{\"kind\":\"IntValue\",\"value\":\"10\"}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allAssociationTypesFromObjectType\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectType\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementObjectTypeId\"}}}],\"directives\":[{\"kind\":\"Directive\",\"name\":{\"kind\":\"Name\",\"value\":\"skip\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"if\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementExists\"}}}]}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabelPropertyNames\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"fromObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationCategory\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"cardinality\"}}]}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"engagement\"},\"name\":{\"kind\":\"Name\",\"value\":\"crmObject\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementObjectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementObjectId\"}}}],\"directives\":[{\"kind\":\"Directive\",\"name\":{\"kind\":\"Name\",\"value\":\"include\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"if\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementExists\"}}}]}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allAssociations\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasPipelines\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabelPropertyNames\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"fromObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationCategory\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"cardinality\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associatedObjects\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"first\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"limitPerType\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"edges\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"node\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"ListValue\",\"values\":[{\"kind\":\"StringValue\",\"value\":\"hs_is_closed\",\"block\":false},{\"kind\":\"StringValue\",\"value\":\"content\",\"block\":false}]}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userPermissions\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanCommunicate\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanView\"}}]}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pageInfo\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"endCursor\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasNextPage\"}}]}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}}]}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"engagementLegacyAssociations\"},\"name\":{\"kind\":\"Name\",\"value\":\"crmObject\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"StringValue\",\"value\":\"0-4\",\"block\":false}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementObjectId\"}}}],\"directives\":[{\"kind\":\"Directive\",\"name\":{\"kind\":\"Name\",\"value\":\"include\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"if\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"engagementExists\"}}}]}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allAssociations\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"fromObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationCategory\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"cardinality\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associatedObjects\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"first\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"limitPerType\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"edges\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"node\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Contact\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}}]}},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Deal\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"ListValue\",\"values\":[{\"kind\":\"StringValue\",\"value\":\"hs_is_closed\",\"block\":false}]}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}}]}},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Company\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}}]}},{\"kind\":\"InlineFragment\",\"typeCondition\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Ticket\"}},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"ListValue\",\"values\":[{\"kind\":\"StringValue\",\"value\":\"hs_is_closed\",\"block\":false},{\"kind\":\"StringValue\",\"value\":\"content\",\"block\":false}]}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userPermissions\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanCommunicate\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanView\"}}]}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pageInfo\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"endCursor\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasNextPage\"}}]}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}}]}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"subject\"},\"name\":{\"kind\":\"Name\",\"value\":\"crmObject\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"subjectObjectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"subjectObjectId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allAssociations\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasPipelines\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabelPropertyNames\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"toObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"fromObjectTypeId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associationCategory\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"cardinality\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"associatedObjects\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"first\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"limitPerType\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"edges\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"node\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"ListValue\",\"values\":[{\"kind\":\"StringValue\",\"value\":\"hs_is_closed\",\"block\":false},{\"kind\":\"StringValue\",\"value\":\"content\",\"block\":false}]}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userPermissions\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanCommunicate\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanView\"}}]}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pageInfo\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"endCursor\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasNextPage\"}}]}}]}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabels\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabel\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeDefinition\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pluralForm\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"primaryDisplayLabelPropertyName\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"secondaryDisplayLabelPropertyNames\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hasPipelines\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"StringValue\",\"value\":\"content\",\"block\":false}}],\"directives\":[{\"kind\":\"Directive\",\"name\":{\"kind\":\"Name\",\"value\":\"include\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"if\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"isTicket\"}}}]}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userPermissions\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanCommunicate\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"currentUserCanView\"}}]}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: [{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "fetchCommunicatorEngagementAssociations"
    },
    variableDefinitions: [{
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "engagementExists"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "Boolean"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "engagementObjectId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "Long"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "engagementObjectTypeId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "String"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "isTicket"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "Boolean"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "subjectObjectId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "Long"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "subjectObjectTypeId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "String"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "limitPerType"
        }
      },
      type: {
        kind: "NamedType",
        name: {
          kind: "Name",
          value: "Int"
        }
      },
      defaultValue: {
        kind: "IntValue",
        value: "10"
      }
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "allAssociationTypesFromObjectType"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "objectType"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "engagementObjectTypeId"
            }
          }
        }],
        directives: [{
          kind: "Directive",
          name: {
            kind: "Name",
            value: "skip"
          },
          arguments: [{
            kind: "Argument",
            name: {
              kind: "Name",
              value: "if"
            },
            value: {
              kind: "Variable",
              name: {
                kind: "Name",
                value: "engagementExists"
              }
            }
          }]
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "toObjectTypeDefinition"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "id"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "pluralForm"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "name"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "secondaryDisplayLabelPropertyNames"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "primaryDisplayLabelPropertyName"
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "toObjectTypeId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "associationTypeId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "fromObjectTypeId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "associationCategory"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "cardinality"
            }
          }]
        }
      }, {
        kind: "Field",
        alias: {
          kind: "Name",
          value: "engagement"
        },
        name: {
          kind: "Name",
          value: "crmObject"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "type"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "engagementObjectTypeId"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "id"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "engagementObjectId"
            }
          }
        }],
        directives: [{
          kind: "Directive",
          name: {
            kind: "Name",
            value: "include"
          },
          arguments: [{
            kind: "Argument",
            name: {
              kind: "Name",
              value: "if"
            },
            value: {
              kind: "Variable",
              name: {
                kind: "Name",
                value: "engagementExists"
              }
            }
          }]
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "allAssociations"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "associationDefinition"
                },
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "toObjectTypeDefinition"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "id"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "name"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "pluralForm"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "hasPipelines"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "primaryDisplayLabelPropertyName"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "secondaryDisplayLabelPropertyNames"
                        }
                      }]
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "toObjectTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "associationTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "fromObjectTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "associationCategory"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "cardinality"
                    }
                  }]
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "associatedObjects"
                },
                arguments: [{
                  kind: "Argument",
                  name: {
                    kind: "Name",
                    value: "first"
                  },
                  value: {
                    kind: "Variable",
                    name: {
                      kind: "Name",
                      value: "limitPerType"
                    }
                  }
                }],
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "edges"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "node"
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "properties"
                            },
                            arguments: [{
                              kind: "Argument",
                              name: {
                                kind: "Name",
                                value: "names"
                              },
                              value: {
                                kind: "ListValue",
                                values: [{
                                  kind: "StringValue",
                                  value: "hs_is_closed",
                                  block: false
                                }, {
                                  kind: "StringValue",
                                  value: "content",
                                  block: false
                                }]
                              }
                            }],
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "name"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "value"
                                }
                              }]
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "id"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "primaryDisplayLabel"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "secondaryDisplayLabels"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "userPermissions"
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "currentUserCanCommunicate"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "currentUserCanView"
                                }
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "pageInfo"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "endCursor"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "hasNextPage"
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "id"
            }
          }]
        }
      }, {
        kind: "Field",
        alias: {
          kind: "Name",
          value: "engagementLegacyAssociations"
        },
        name: {
          kind: "Name",
          value: "crmObject"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "type"
          },
          value: {
            kind: "StringValue",
            value: "0-4",
            block: false
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "id"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "engagementObjectId"
            }
          }
        }],
        directives: [{
          kind: "Directive",
          name: {
            kind: "Name",
            value: "include"
          },
          arguments: [{
            kind: "Argument",
            name: {
              kind: "Name",
              value: "if"
            },
            value: {
              kind: "Variable",
              name: {
                kind: "Name",
                value: "engagementExists"
              }
            }
          }]
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "allAssociations"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "associationDefinition"
                },
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "toObjectTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "associationTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "fromObjectTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "associationCategory"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "cardinality"
                    }
                  }]
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "associatedObjects"
                },
                arguments: [{
                  kind: "Argument",
                  name: {
                    kind: "Name",
                    value: "first"
                  },
                  value: {
                    kind: "Variable",
                    name: {
                      kind: "Name",
                      value: "limitPerType"
                    }
                  }
                }],
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "edges"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "node"
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "id"
                            }
                          }, {
                            kind: "InlineFragment",
                            typeCondition: {
                              kind: "NamedType",
                              name: {
                                kind: "Name",
                                value: "Contact"
                              }
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "id"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "primaryDisplayLabel"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "secondaryDisplayLabels"
                                }
                              }]
                            }
                          }, {
                            kind: "InlineFragment",
                            typeCondition: {
                              kind: "NamedType",
                              name: {
                                kind: "Name",
                                value: "Deal"
                              }
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "id"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "primaryDisplayLabel"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "secondaryDisplayLabels"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "properties"
                                },
                                arguments: [{
                                  kind: "Argument",
                                  name: {
                                    kind: "Name",
                                    value: "names"
                                  },
                                  value: {
                                    kind: "ListValue",
                                    values: [{
                                      kind: "StringValue",
                                      value: "hs_is_closed",
                                      block: false
                                    }]
                                  }
                                }],
                                selectionSet: {
                                  kind: "SelectionSet",
                                  selections: [{
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "name"
                                    }
                                  }, {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "value"
                                    }
                                  }]
                                }
                              }]
                            }
                          }, {
                            kind: "InlineFragment",
                            typeCondition: {
                              kind: "NamedType",
                              name: {
                                kind: "Name",
                                value: "Company"
                              }
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "id"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "primaryDisplayLabel"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "secondaryDisplayLabels"
                                }
                              }]
                            }
                          }, {
                            kind: "InlineFragment",
                            typeCondition: {
                              kind: "NamedType",
                              name: {
                                kind: "Name",
                                value: "Ticket"
                              }
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "id"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "primaryDisplayLabel"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "secondaryDisplayLabels"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "properties"
                                },
                                arguments: [{
                                  kind: "Argument",
                                  name: {
                                    kind: "Name",
                                    value: "names"
                                  },
                                  value: {
                                    kind: "ListValue",
                                    values: [{
                                      kind: "StringValue",
                                      value: "hs_is_closed",
                                      block: false
                                    }, {
                                      kind: "StringValue",
                                      value: "content",
                                      block: false
                                    }]
                                  }
                                }],
                                selectionSet: {
                                  kind: "SelectionSet",
                                  selections: [{
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "name"
                                    }
                                  }, {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "value"
                                    }
                                  }]
                                }
                              }]
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "primaryDisplayLabel"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "userPermissions"
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "currentUserCanCommunicate"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "currentUserCanView"
                                }
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "pageInfo"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "endCursor"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "hasNextPage"
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "id"
            }
          }]
        }
      }, {
        kind: "Field",
        alias: {
          kind: "Name",
          value: "subject"
        },
        name: {
          kind: "Name",
          value: "crmObject"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "type"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "subjectObjectTypeId"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "id"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "subjectObjectId"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "allAssociations"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "associationDefinition"
                },
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "toObjectTypeDefinition"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "id"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "name"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "pluralForm"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "hasPipelines"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "primaryDisplayLabelPropertyName"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "secondaryDisplayLabelPropertyNames"
                        }
                      }]
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "toObjectTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "associationTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "fromObjectTypeId"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "associationCategory"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "cardinality"
                    }
                  }]
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "associatedObjects"
                },
                arguments: [{
                  kind: "Argument",
                  name: {
                    kind: "Name",
                    value: "first"
                  },
                  value: {
                    kind: "Variable",
                    name: {
                      kind: "Name",
                      value: "limitPerType"
                    }
                  }
                }],
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "edges"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "node"
                        },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "properties"
                            },
                            arguments: [{
                              kind: "Argument",
                              name: {
                                kind: "Name",
                                value: "names"
                              },
                              value: {
                                kind: "ListValue",
                                values: [{
                                  kind: "StringValue",
                                  value: "hs_is_closed",
                                  block: false
                                }, {
                                  kind: "StringValue",
                                  value: "content",
                                  block: false
                                }]
                              }
                            }],
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "name"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "value"
                                }
                              }]
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "id"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "primaryDisplayLabel"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "secondaryDisplayLabels"
                            }
                          }, {
                            kind: "Field",
                            name: {
                              kind: "Name",
                              value: "userPermissions"
                            },
                            selectionSet: {
                              kind: "SelectionSet",
                              selections: [{
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "currentUserCanCommunicate"
                                }
                              }, {
                                kind: "Field",
                                name: {
                                  kind: "Name",
                                  value: "currentUserCanView"
                                }
                              }]
                            }
                          }]
                        }
                      }]
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "pageInfo"
                    },
                    selectionSet: {
                      kind: "SelectionSet",
                      selections: [{
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "endCursor"
                        }
                      }, {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "hasNextPage"
                        }
                      }]
                    }
                  }]
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "id"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "secondaryDisplayLabels"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "primaryDisplayLabel"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "objectTypeDefinition"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "id"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "pluralForm"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "primaryDisplayLabelPropertyName"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "secondaryDisplayLabelPropertyNames"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "name"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "hasPipelines"
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "properties"
            },
            arguments: [{
              kind: "Argument",
              name: {
                kind: "Name",
                value: "names"
              },
              value: {
                kind: "StringValue",
                value: "content",
                block: false
              }
            }],
            directives: [{
              kind: "Directive",
              name: {
                kind: "Name",
                value: "include"
              },
              arguments: [{
                kind: "Argument",
                name: {
                  kind: "Name",
                  value: "if"
                },
                value: {
                  kind: "Variable",
                  name: {
                    kind: "Name",
                    value: "isTicket"
                  }
                }
              }]
            }],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "name"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "value"
                }
              }]
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "userPermissions"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "currentUserCanCommunicate"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "currentUserCanView"
                }
              }]
            }
          }]
        }
      }]
    }
  }]
});