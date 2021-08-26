(behaviour
  name: (identifier) @local.definition
  contract: (identifier) @local.definition
)

(interface
  name: (identifier) @local.reference
  args: (parameter_list
          (parameter_declaration
            (type)
            (identifier) @local.definition)*
))

(assignment (type) (identifier) @local.definition)

(identifier) @local.reference
